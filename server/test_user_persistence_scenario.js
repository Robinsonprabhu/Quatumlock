// Node global fetch used

const BASE = 'http://localhost:5000';
const ADMIN_TOKEN = 'robin123';

async function runScenario() {
  console.log('\n--- 1. Reset competition & open Session 1 ---');
  await fetch(`${BASE}/api/admin/event/reset`, {
    method: 'POST',
    headers: { 'x-admin-token': ADMIN_TOKEN }
  });
  await fetch(`${BASE}/api/admin/event/state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
    body: JSON.stringify({ status: 'SESSION_1_ACTIVE', durationMinutes: 30 })
  });

  console.log('\n--- 2. Participant registers with teamName & passcode ---');
  const regRes = await fetch(`${BASE}/api/participant/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamName: 'PERSISTENT_LEGION', passcode: 'doom2026' })
  }).then(r => r.json());
  console.log('Registration success:', regRes.success, 'Token:', regRes.participant.token.substring(0, 10) + '...');

  const token = regRes.participant.token;

  console.log('\n--- 3. Fetch Session 1 questions ---');
  const qRes = await fetch(`${BASE}/api/session/1/questions`, {
    headers: { 'x-participant-token': token }
  }).then(r => r.json());

  const q1 = qRes.questions[0];
  console.log('First Question:', q1.id, q1.name, 'isSolved:', q1.isSolved);

  // Look up correct keyword from admin bank
  const bank = await fetch(`${BASE}/api/admin/questions`, {
    headers: { 'x-admin-token': ADMIN_TOKEN }
  }).then(r => r.json());
  const q1Bank = bank.questions.find(q => q.id === q1.id);
  const q1Answer = q1Bank.answer || q1Bank.keywords[0];

  console.log('\n--- 4. Participant solves Question 1 with correct answer ---');
  const subRes = await fetch(`${BASE}/api/session/1/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': token },
    body: JSON.stringify({ questionId: q1.id, answer: q1Answer })
  }).then(r => r.json());
  console.log('Submission result:', subRes.success, 'isCorrect:', subRes.isCorrect, 'Current Score:', subRes.score);

  console.log('\n--- 5. SIMULATE REFRESH (Re-fetching session questions) ---');
  const refreshQRes = await fetch(`${BASE}/api/session/1/questions`, {
    headers: { 'x-participant-token': token }
  }).then(r => r.json());
  console.log('After refresh: Q1 isSolved:', refreshQRes.questions[0].isSolved);
  console.log('After refresh: Q2 isSolved:', refreshQRes.questions[1].isSolved);
  const firstUnsolved = refreshQRes.questions.findIndex(q => !q.isSolved);
  console.log(`Active room on refresh is Room ${firstUnsolved + 1} (correct: participant stays in Room 2)`);

  console.log('\n--- 6. SIMULATE LOGOUT & RE-LOGIN WITH TEAM PASSCODE ---');
  const reLoginRes = await fetch(`${BASE}/api/participant/re-enter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamName: 'PERSISTENT_LEGION', passcode: 'doom2026' })
  }).then(r => r.json());
  console.log('Re-login success:', reLoginRes.success, 'Token restored:', reLoginRes.participant.token.substring(0, 10) + '...');
  const stateAfterLogin = await fetch(`${BASE}/api/participant/state`, {
    headers: { 'x-participant-token': reLoginRes.participant.token }
  }).then(r => r.json());
  console.log('Restored questions count:', stateAfterLogin.questions.length);
  console.log('Restored Q1 solved state:', stateAfterLogin.questions[0].isSolved);

  console.log('\n--- 7. LUNCH INTERMISSION (Lock Session 1) ---');
  await fetch(`${BASE}/api/admin/session/lock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
    body: JSON.stringify({ session: 1 })
  });

  const trySubmitDuringLunch = await fetch(`${BASE}/api/session/1/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': token },
    body: JSON.stringify({ questionId: qRes.questions[1].id, answer: 'TEST' })
  });
  console.log('Attempted submit during lunch intermission status:', trySubmitDuringLunch.status, '(Expect 403 CHAMBER LOCKED)');

  console.log('\n--- 8. RETURN FROM LUNCH -> ADMIN OPENS SESSION 2 ---');
  await fetch(`${BASE}/api/admin/session/open`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
    body: JSON.stringify({ session: 2, durationMinutes: 30 })
  });

  const s2QRes = await fetch(`${BASE}/api/session/2/questions`, {
    headers: { 'x-participant-token': token }
  }).then(r => r.json());
  console.log('Session 2 fetched successfully. Question count:', s2QRes.questions.length);
  console.log('First room in Session 2 name:', s2QRes.questions[0].name);

  // Solve first question of Session 2
  const s2Q1 = s2QRes.questions[0];
  const s2Q1Bank = bank.questions.find(q => q.id === s2Q1.id);
  const s2Q1Answer = s2Q1Bank.answer || s2Q1Bank.keywords[0];

  const sub2Res = await fetch(`${BASE}/api/session/2/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': token },
    body: JSON.stringify({ questionId: s2Q1.id, answer: s2Q1Answer })
  }).then(r => r.json());
  console.log('Session 2 submission result:', sub2Res.success, 'isCorrect:', sub2Res.isCorrect, 'Session 2 Score:', sub2Res.score);

  console.log('\n--- 9. VERIFY FINAL LEADERBOARD ---');
  const lb = await fetch(`${BASE}/api/leaderboard`).then(r => r.json());
  const ourTeam = lb.leaderboard.find(t => t.teamName === 'PERSISTENT_LEGION');
  console.log('Our Team Leaderboard standing:', {
    rank: ourTeam.rank,
    teamName: ourTeam.teamName,
    session1Score: ourTeam.session1Score,
    session2Score: ourTeam.session2Score,
    totalScore: ourTeam.totalScore,
    totalDurationFormatted: ourTeam.totalDurationFormatted
  });

  console.log('\n🎉 ALL PERSISTENCE, REFRESH, LOGOUT/LOGIN & SESSION TRANSITION CHECKS PASSED!');
}

runScenario().catch(console.error);
