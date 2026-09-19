const BASE = 'http://localhost:5000';
const ADMIN_TOKEN = 'robin123';

async function testTimingAndHints() {
  console.log('=== TEST SUITE: TIMING SYNC, HINT TIMER PENALTY & 3 HINTS ZERO POINTS ===\n');

  // 1. Reset competition and open Session 1 with 10 minutes duration
  console.log('1. Setting up fresh competition with Session 1 (10 min duration)...');
  await fetch(`${BASE}/api/admin/event/reset`, {
    method: 'POST',
    headers: { 'x-admin-token': ADMIN_TOKEN }
  });
  await fetch(`${BASE}/api/admin/event/state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
    body: JSON.stringify({ status: 'SESSION_1_ACTIVE', durationMinutes: 10 })
  });

  // 2. Register team
  const reg = await fetch(`${BASE}/api/participant/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamName: 'CHRONO_SQUAD', passcode: 'time2026' })
  }).then(r => r.json());
  const token = reg.participant.token;
  const pId = reg.participant.id;
  console.log('Team CHRONO_SQUAD registered. Token:', token.substring(0, 10) + '...');

  // 3. Verify Authoritative Timer in state
  const state1 = await fetch(`${BASE}/api/participant/state`, {
    headers: { 'x-participant-token': token }
  }).then(r => r.json());
  const rem1 = state1.eventState.session_remaining_seconds;
  console.log(`Initial session remaining time: ${rem1}s (expect ~600s)`);
  if (rem1 < 590 || rem1 > 600) {
    throw new Error(`Timer out of expected range: got ${rem1}`);
  }
  console.log('✅ PASS: Timing is authoritatively synchronized with server!');

  // 4. Test Hint 1: Deducts time penalty
  const q1 = state1.questions[0];
  console.log(`\n2. Using Hint 1 on question ${q1.id} (Room 1)...`);
  const hint1Res = await fetch(`${BASE}/api/session/1/hint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': token },
    body: JSON.stringify({ questionId: q1.id, hintIdx: 0, penalty: 20 })
  }).then(r => r.json());
  console.log('Hint 1 response remainingSeconds:', hint1Res.remainingSeconds, 'penaltyDeducted:', hint1Res.penaltyDeducted);

  const stateAfterHint1 = await fetch(`${BASE}/api/participant/state`, {
    headers: { 'x-participant-token': token }
  }).then(r => r.json());
  const remAfterHint1 = stateAfterHint1.eventState.session_remaining_seconds;
  console.log(`After Hint 1: remaining time is ${remAfterHint1}s (penalty: 20s applied)`);
  if (remAfterHint1 > rem1 - 18) {
    throw new Error(`Hint penalty did not reduce timer: before ${rem1}, after ${remAfterHint1}`);
  }
  console.log('✅ PASS: Hint usage immediately and authoritatively reduces session timer!');

  // 5. Use Hint 2 and Hint 3 on Room 1 (Total 3 hints used)
  console.log('\n3. Using Hint 2 and Hint 3 on Room 1 (reaching 3 hints total)...');
  await fetch(`${BASE}/api/session/1/hint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': token },
    body: JSON.stringify({ questionId: q1.id, hintIdx: 1, penalty: 40 })
  });
  await fetch(`${BASE}/api/session/1/hint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': token },
    body: JSON.stringify({ questionId: q1.id, hintIdx: 2, penalty: 60 })
  });

  const stateAfter3Hints = await fetch(`${BASE}/api/participant/state`, {
    headers: { 'x-participant-token': token }
  }).then(r => r.json());
  console.log(`After 3 Hints: total penalty is ${stateAfter3Hints.eventState.participant_hint_penalty_seconds}s`);
  console.log(`Remaining time: ${stateAfter3Hints.eventState.session_remaining_seconds}s (total 120s penalty deducted)`);

  // 6. Look up correct answer for Room 1 and submit
  const bank = await fetch(`${BASE}/api/admin/questions`, {
    headers: { 'x-admin-token': ADMIN_TOKEN }
  }).then(r => r.json());
  const q1Bank = bank.questions.find(q => q.id === q1.id);
  const q1Answer = q1Bank.answer || q1Bank.keywords[0];

  console.log('\n4. Submitting correct answer for Room 1 with 3 hints used...');
  const sub1 = await fetch(`${BASE}/api/session/1/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': token },
    body: JSON.stringify({ questionId: q1.id, answer: q1Answer })
  }).then(r => r.json());
  console.log('Submission 1 result:', sub1.success, 'pointsEarned:', sub1.pointsEarned, 'successNote:', sub1.successNote);
  if (sub1.pointsEarned !== 0) {
    throw new Error(`Expected 0 points for 3 hints used, but got: ${sub1.pointsEarned}`);
  }
  console.log('✅ PASS: Solving a question with 3 hints awards EXACTLY ZERO (0) points!');

  // 7. Solve Room 2 with ZERO hints used -> verify it awards 100 points
  const q2 = state1.questions[1];
  const q2Bank = bank.questions.find(q => q.id === q2.id);
  const q2Answer = q2Bank.answer || q2Bank.keywords[0];

  console.log(`\n5. Submitting correct answer for Room 2 (${q2.id}) with ZERO hints used...`);
  const sub2 = await fetch(`${BASE}/api/session/1/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': token },
    body: JSON.stringify({ questionId: q2.id, answer: q2Answer })
  }).then(r => r.json());
  console.log('Submission 2 result:', sub2.success, 'pointsEarned:', sub2.pointsEarned, 'successNote:', sub2.successNote);
  if (sub2.pointsEarned !== 100) {
    throw new Error(`Expected 100 points for 0 hints used, but got: ${sub2.pointsEarned}`);
  }
  console.log('✅ PASS: Clean solve with 0 hints awards full 100 points!');

  // 8. Check Leaderboard points
  console.log('\n6. Verifying Leaderboard points calculation...');
  const lb = await fetch(`${BASE}/api/leaderboard`).then(r => r.json());
  const myTeam = lb.leaderboard.find(t => t.participantId === pId);
  console.log(`Leaderboard Standing: totalPoints = ${myTeam.totalPoints} (0 pts from Q1 + 100 pts from Q2 = 100 total)`);
  if (myTeam.totalPoints !== 100) {
    throw new Error(`Expected leaderboard totalPoints to be 100, got ${myTeam.totalPoints}`);
  }
  console.log('✅ PASS: Leaderboard enforces 0 points for 3-hint rooms and full points for clean solves!');

  // 9. Session 1 Lock & Lunch Intermission
  console.log('\n7. Locking Session 1 for Lunch Intermission...');
  await fetch(`${BASE}/api/admin/session/lock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
    body: JSON.stringify({ session: 1 })
  });

  const stateLocked = await fetch(`${BASE}/api/participant/state`, {
    headers: { 'x-participant-token': token }
  }).then(r => r.json());
  console.log('Event status during lunch:', stateLocked.eventState.status);

  // 10. Start Session 2 Fresh Countdown
  console.log('\n8. Opening Session 2 (Chambers 8-14) with fresh 30-minute timer...');
  await fetch(`${BASE}/api/admin/session/open`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
    body: JSON.stringify({ session: 2, durationMinutes: 30 })
  });

  const stateS2 = await fetch(`${BASE}/api/participant/state`, {
    headers: { 'x-participant-token': token }
  }).then(r => r.json());
  const remS2 = stateS2.eventState.session_remaining_seconds;
  console.log(`Session 2 Fresh remaining time: ${remS2}s (expect ~1800s for fresh 30m countdown)`);
  if (remS2 < 1790 || remS2 > 1800) {
    throw new Error(`Session 2 timer not fresh: got ${remS2}`);
  }
  console.log('✅ PASS: Session 2 timer starts completely fresh and is scoped to Session 2!');

  console.log('\n🎉 ALL TIMING SYNC, HINT PENALTY, AND 3-HINT ZERO POINTS VERIFICATIONS PASSED!');
}

testTimingAndHints().catch(err => {
  console.error('❌ TEST FAILED:', err);
  process.exit(1);
});
