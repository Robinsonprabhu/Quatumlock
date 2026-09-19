import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detect backend port
let PORT = 5000;
try {
  const portFile = path.join(__dirname, 'data', '.backend_port');
  if (fs.existsSync(portFile)) {
    PORT = parseInt(fs.readFileSync(portFile, 'utf8').trim(), 10);
  }
} catch (e) {}

const BASE_URL = `http://127.0.0.1:${PORT}`;
const ADMIN_SECRET = 'robin123';

async function runVerification() {
  console.log('================================================================');
  console.log(`⚡ AIDEX\'26 SCORING, LEADERBOARD & TIMER CONTROLS TEST (PORT ${PORT})`);
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Reset Competition
  console.log('--- 1. Reset Competition ---');
  const resetRes = await fetch(`${BASE_URL}/api/admin/event/reset`, {
    method: 'POST',
    headers: { 'x-admin-token': ADMIN_SECRET }
  }).then(r => r.json());
  assert(resetRes.success && resetRes.eventState.status === 'CLOSED', 'Reset competition to initial state');

  // 2. Test Dynamic Timer Controls
  console.log('\n--- 2. Test Admin Dynamic Timer Controls ---');
  const timerAdjust1 = await fetch(`${BASE_URL}/api/admin/event/adjust-time`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_SECRET },
    body: JSON.stringify({ durationMinutes: 45 })
  }).then(r => r.json());
  assert(timerAdjust1.success && timerAdjust1.eventState.session_duration_minutes === 45, 'Admin set session duration to 45 minutes');

  const timerAdjust2 = await fetch(`${BASE_URL}/api/admin/event/adjust-time`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_SECRET },
    body: JSON.stringify({ minutes: 5 })
  }).then(r => r.json());
  assert(timerAdjust2.success && timerAdjust2.eventState.session_duration_minutes === 50, 'Admin extended time by +5 minutes');

  const pauseTimer = await fetch(`${BASE_URL}/api/admin/event/adjust-time`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_SECRET },
    body: JSON.stringify({ action: 'pause' })
  }).then(r => r.json());
  assert(pauseTimer.success && pauseTimer.eventState.timer_paused === true, 'Admin paused timer');

  const resumeTimer = await fetch(`${BASE_URL}/api/admin/event/adjust-time`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_SECRET },
    body: JSON.stringify({ action: 'resume' })
  }).then(r => r.json());
  assert(resumeTimer.success && resumeTimer.eventState.timer_paused === false, 'Admin resumed timer');

  // 3. Test Bulk JSON Question Import
  console.log('\n--- 3. Test Question JSON Schema & Bulk Import ---');
  const testQuestion = {
    id: 'Q_SCHEMA_TEST',
    title: 'ROOM 99: QUANTUM RECURSION PROTOCOL',
    subtitle: 'Advanced Algorithmic Complexity',
    category: 'Algorithms',
    difficulty: 'Hard',
    investigationType: 'code',
    story: ['Incident log for schema testing.'],
    codeLines: ['// Test Script', 'run_test();'],
    question: 'What is the answer for schema test? Transmit \'VERIFIED\'.',
    hints: [
      { text: 'Look at the test prompt.', penalty: 20 }
    ],
    keywords: ['VERIFIED']
  };

  const importRes = await fetch(`${BASE_URL}/api/admin/questions/bulk-import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_SECRET },
    body: JSON.stringify({ questions: [testQuestion] })
  }).then(r => r.json());
  assert(importRes.success && importRes.count === 1, 'Successfully imported question in standardized JSON schema');

  // 4. Test Points Scoring, Hint Deductions & Tie-Breaker
  console.log('\n--- 4. Test Points Scoring, Hint Penalty & Time Tie-Breaker ---');
  
  // Register 2 Teams
  const teamAlphaReg = await fetch(`${BASE_URL}/api/participant/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamName: 'TEAM_ALPHA' })
  }).then(r => r.json());
  const teamAlpha = teamAlphaReg.participant;

  const teamBetaReg = await fetch(`${BASE_URL}/api/participant/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamName: 'TEAM_BETA' })
  }).then(r => r.json());
  const teamBeta = teamBetaReg.participant;

  // Open Session 1
  await fetch(`${BASE_URL}/api/admin/event/state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_SECRET },
    body: JSON.stringify({ status: 'SESSION_1_ACTIVE', durationMinutes: 30 })
  });

  const alphaQ = await fetch(`${BASE_URL}/api/session/1/questions`, {
    headers: { 'x-participant-token': teamAlpha.token }
  }).then(r => r.json());

  const betaQ = await fetch(`${BASE_URL}/api/session/1/questions`, {
    headers: { 'x-participant-token': teamBeta.token }
  }).then(r => r.json());

  // Team Alpha reveals 2 hints on Room 1 (penalty 20 + 40 = 60)
  const hintRes = await fetch(`${BASE_URL}/api/session/1/hint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': teamAlpha.token },
    body: JSON.stringify({
      questionId: alphaQ.questions[0].id,
      hintIdx: 0,
      penalty: 20
    })
  }).then(r => r.json());
  assert(hintRes.success, 'Team Alpha recorded hint 1 usage (-20 pts)');

  await fetch(`${BASE_URL}/api/session/1/hint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': teamAlpha.token },
    body: JSON.stringify({
      questionId: alphaQ.questions[0].id,
      hintIdx: 1,
      penalty: 40
    })
  });

  // Team Alpha answers Room 1 correctly (Base 100 - 60 = 40 pts)
  const fullQAlpha = await fetch(`${BASE_URL}/api/admin/questions`, {
    headers: { 'x-admin-token': ADMIN_SECRET }
  }).then(r => r.json());
  const targetQ1 = fullQAlpha.questions.find(q => q.id === alphaQ.questions[0].id);
  const correctKw1 = targetQ1.keywords[0];

  const ansResAlpha = await fetch(`${BASE_URL}/api/session/1/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': teamAlpha.token },
    body: JSON.stringify({ questionId: alphaQ.questions[0].id, answer: correctKw1 })
  }).then(r => r.json());
  assert(ansResAlpha.success && ansResAlpha.isCorrect, 'Team Alpha answered Room 1 correctly');

  // Team Beta answers Room 1 with 0 hints (Base 100 - 0 = 100 pts)
  const targetQBeta1 = fullQAlpha.questions.find(q => q.id === betaQ.questions[0].id);
  const correctKwBeta1 = targetQBeta1.keywords[0];

  const ansResBeta = await fetch(`${BASE_URL}/api/session/1/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': teamBeta.token },
    body: JSON.stringify({ questionId: betaQ.questions[0].id, answer: correctKwBeta1 })
  }).then(r => r.json());
  assert(ansResBeta.success && ansResBeta.isCorrect, 'Team Beta answered Room 1 correctly with 0 hints');

  // Fetch Leaderboard
  const lbRes = await fetch(`${BASE_URL}/api/admin/leaderboard`, {
    headers: { 'x-admin-token': ADMIN_SECRET }
  }).then(r => r.json());

  const rank1 = lbRes.leaderboard[0];
  const rank2 = lbRes.leaderboard[1];

  assert(rank1.teamName === 'TEAM_BETA' && rank1.totalPoints === 100, `Team Beta is Rank 1 with 100 pts (Got: ${rank1.teamName} with ${rank1.totalPoints} pts)`);
  assert(rank2.teamName === 'TEAM_ALPHA' && rank2.totalPoints === 40, `Team Alpha is Rank 2 with 40 pts after 60 pts hint deductions (Got: ${rank2.teamName} with ${rank2.totalPoints} pts)`);

  console.log('\n--- 5. Test Tie-Breaker (Lowest Total Time Wins on Equal Points) ---');
  // Team Alpha solves Room 2 with 0 hints (giving +100 pts -> 140 pts)
  // Team Beta solves Room 2 with 2 hints (giving +40 pts -> 140 pts)
  const targetQAlpha2 = fullQAlpha.questions.find(q => q.id === alphaQ.questions[1].id);
  await fetch(`${BASE_URL}/api/session/1/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': teamAlpha.token },
    body: JSON.stringify({ questionId: alphaQ.questions[1].id, answer: targetQAlpha2.keywords[0] })
  });

  const targetQBeta2 = fullQAlpha.questions.find(q => q.id === betaQ.questions[1].id);
  await fetch(`${BASE_URL}/api/session/1/hint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': teamBeta.token },
    body: JSON.stringify({ questionId: betaQ.questions[1].id, hintIdx: 0, penalty: 60 })
  });
  await fetch(`${BASE_URL}/api/session/1/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': teamBeta.token },
    body: JSON.stringify({ questionId: betaQ.questions[1].id, answer: targetQBeta2.keywords[0] })
  });

  // Both have 140 points now.
  const lbTieRes = await fetch(`${BASE_URL}/api/admin/leaderboard`, {
    headers: { 'x-admin-token': ADMIN_SECRET }
  }).then(r => r.json());

  assert(lbTieRes.leaderboard[0].totalPoints === 140 && lbTieRes.leaderboard[1].totalPoints === 140, 'Both teams have tied at 140 total points');
  assert(lbTieRes.leaderboard[0].totalTime <= lbTieRes.leaderboard[1].totalTime, `Tie broken by completion time: Rank 1 has time ${lbTieRes.leaderboard[0].totalTime}s <= Rank 2 time ${lbTieRes.leaderboard[1].totalTime}s`);

  // Final cleanup
  await fetch(`${BASE_URL}/api/admin/event/reset`, {
    method: 'POST',
    headers: { 'x-admin-token': ADMIN_SECRET }
  });

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
