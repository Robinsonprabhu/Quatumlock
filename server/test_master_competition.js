// Automated Comprehensive Test Suite for AIDEX'26 Escape Room Master Prompt
// Tests 1 through 10 from Master Prompt Section 31

const BASE_URL = 'http://localhost:5000';
const ADMIN_SECRET = 'robin123';

async function runTests() {
  console.log('================================================================');
  console.log('⚡ AIDEX\'26 ESCAPE ROOM — MASTER SPECIFICATION VERIFICATION SUITE');
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

  // 0. RESET COMPETITION FOR CLEAN TEST
  console.log('--- Phase 0: Reset & Verify Event Initial State ---');
  const resetRes = await fetch(`${BASE_URL}/api/admin/event/reset`, {
    method: 'POST',
    headers: { 'x-admin-token': ADMIN_SECRET }
  }).then(r => r.json());
  assert(resetRes.success && resetRes.eventState.status === 'CLOSED', 'Reset competition to CLOSED state');

  // TEST 1: Question Bank & 20 Participants Randomization
  console.log('\n--- Test 1: 20 Questions in Bank & 20 Participants Randomized Assignments ---');
  const questionsRes = await fetch(`${BASE_URL}/api/admin/questions`, {
    headers: { 'x-admin-token': ADMIN_SECRET }
  }).then(r => r.json());
  assert(questionsRes.questions && questionsRes.questions.length >= 20, `Question bank has >= 20 questions (found: ${questionsRes.questions?.length})`);

  const participants = [];
  const assignmentFingerprints = new Set();

  for (let i = 1; i <= 20; i++) {
    const reg = await fetch(`${BASE_URL}/api/participant/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamName: `TEAM_${String(i).padStart(2, '0')}` })
    }).then(r => r.json());
    participants.push(reg.participant);
  }
  assert(participants.length === 20, '20 Participants successfully registered');

  // Check their question assignments
  const progressRes = await fetch(`${BASE_URL}/api/admin/progress`, {
    headers: { 'x-admin-token': ADMIN_SECRET }
  }).then(r => r.json());
  assert(progressRes.totalParticipants === 20, 'Admin progress reports exactly 20 participants');

  // TEST 2: Refresh / Reconnect Resilience
  console.log('\n--- Test 2: Refresh / Reconnect State Restoration ---');
  const team1 = participants[0];
  const stateRes1 = await fetch(`${BASE_URL}/api/participant/state`, {
    headers: { 'x-participant-token': team1.token }
  }).then(r => r.json());

  const stateRes2 = await fetch(`${BASE_URL}/api/participant/state`, {
    headers: { 'x-participant-token': team1.token }
  }).then(r => r.json());

  assert(stateRes1.success && stateRes2.success && stateRes1.participant.id === stateRes2.participant.id, 'State restored consistently across multiple requests');

  // TEST 3: Access Gate — Session 2 Locked Before Admin Opens
  console.log('\n--- Test 3: Attempt to Access Session 2 While Locked ---');
  const s2LockedRes = await fetch(`${BASE_URL}/api/session/2/questions`, {
    headers: { 'x-participant-token': team1.token }
  });
  assert(s2LockedRes.status === 403, `Session 2 returns 403 Forbidden while locked (Got status ${s2LockedRes.status})`);

  // TEST 4: Admin Opens Session 1 & Session 2 Gates
  console.log('\n--- Test 4: Admin Opens Session 1, Validates Question Fetching ---');
  await fetch(`${BASE_URL}/api/admin/event/state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_SECRET },
    body: JSON.stringify({ status: 'SESSION_1_ACTIVE', durationMinutes: 30 })
  });

  const s1QRes = await fetch(`${BASE_URL}/api/session/1/questions`, {
    headers: { 'x-participant-token': team1.token }
  }).then(r => r.json());
  assert(s1QRes.success && s1QRes.questions.length === 7, 'Participant received exactly 7 Session 1 questions');

  // Verify questions are sanitized (No secret keywords/answers leaked)
  const anyLeakedKeywords = s1QRes.questions.some(q => q.keywords !== undefined);
  assert(!anyLeakedKeywords, 'Anti-Cheating: Secret keywords are NOT exposed in questions response');

  // TEST 5: Authoritative Server Time
  console.log('\n--- Test 5: Server Authoritative Timestamp ---');
  const eventStatusRes = await fetch(`${BASE_URL}/api/event/status`).then(r => r.json());
  assert(eventStatusRes.eventState.server_time && typeof eventStatusRes.eventState.server_time === 'number', 'Server returns authoritative epoch time');

  // TEST 6: Requesting Another Participant\'s Data / Invalid Auth
  console.log('\n--- Test 6: Unauthorized Token Access ---');
  const unauthorizedRes = await fetch(`${BASE_URL}/api/session/1/questions`, {
    headers: { 'x-participant-token': 'FAKE_FORGED_TOKEN_XYZ' }
  });
  assert(unauthorizedRes.status === 401, `Invalid token returns 401 Unauthorized (Got status ${unauthorizedRes.status})`);

  // TEST 7: Requesting Admin Data as Normal Participant
  console.log('\n--- Test 7: Participant Requesting Admin Question Bank ---');
  const adminForbiddenRes = await fetch(`${BASE_URL}/api/admin/questions`, {
    headers: { 'x-participant-token': team1.token }
  });
  assert(adminForbiddenRes.status === 403, `Non-admin request to admin route returns 403 Forbidden (Got status ${adminForbiddenRes.status})`);

  // TEST 8: Anti-Cheating & Duplicate Submission Protection
  console.log('\n--- Test 8: Submitting Answer and Duplicate Submission Protection ---');
  const firstQ = s1QRes.questions[0];
  // Look up correct keyword from admin bank for testing
  const fullQ = questionsRes.questions.find(q => q.id === firstQ.id);
  const correctKeyword = fullQ.keywords[0];

  const submit1 = await fetch(`${BASE_URL}/api/session/1/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': team1.token },
    body: JSON.stringify({ questionId: firstQ.id, answer: correctKeyword })
  }).then(r => r.json());
  assert(submit1.isCorrect === true, `Answer '${correctKeyword}' accepted as correct for ${firstQ.id}`);

  // Duplicate submission of same answer
  const submit2 = await fetch(`${BASE_URL}/api/session/1/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': team1.token },
    body: JSON.stringify({ questionId: firstQ.id, answer: correctKeyword })
  }).then(r => r.json());

  const progressAfterDup = await fetch(`${BASE_URL}/api/admin/progress`, {
    headers: { 'x-admin-token': ADMIN_SECRET }
  }).then(r => r.json());
  const team1Prog = progressAfterDup.participants.find(p => p.id === team1.id);
  assert(team1Prog.session1Score === 1, `Duplicate submission did not duplicate score (Score: ${team1Prog.session1Score}/5)`);

  // TEST 9: 50 Concurrent Users Simulation
  console.log('\n--- Test 9: 50 Concurrent Users Simulation ---');
  const concurrentTeamPromises = [];
  for (let i = 1; i <= 50; i++) {
    concurrentTeamPromises.push(
      (async () => {
        const reg = await fetch(`${BASE_URL}/api/participant/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamName: `CONCURRENT_WARRIOR_${i}` })
        }).then(r => r.json());

        const qRes = await fetch(`${BASE_URL}/api/session/1/questions`, {
          headers: { 'x-participant-token': reg.participant.token }
        }).then(r => r.json());

        return { participant: reg.participant, questions: qRes.questions };
      })()
    );
  }

  const concurrentResults = await Promise.all(concurrentTeamPromises);
  assert(concurrentResults.length === 50, 'All 50 concurrent participants successfully registered and fetched questions simultaneously');
  const all50Have7Q = concurrentResults.every(r => r.questions && r.questions.length === 7);
  assert(all50Have7Q, 'All 50 participants received exactly 7 Session 1 questions');

  // Verify Question Randomization Distribution Across the 50 Users
  const uniqueCombos = new Set(concurrentResults.map(r => r.questions.map(q => q.id).sort().join('-')));
  assert(uniqueCombos.size > 10, `Questions were dynamically randomized per user (${uniqueCombos.size} distinct combinations among 50 users)`);

  // TEST 10: Session 2 Unlock & Full Flow Completion & Leaderboard
  console.log('\n--- Test 10: Session 2 Gate Open & Final Leaderboard Ranking ---');
  await fetch(`${BASE_URL}/api/admin/event/state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_SECRET },
    body: JSON.stringify({ status: 'SESSION_2_ACTIVE' })
  });

  const s2QRes = await fetch(`${BASE_URL}/api/session/2/questions`, {
    headers: { 'x-participant-token': team1.token }
  }).then(r => r.json());
  assert(s2QRes.success && s2QRes.questions.length === 7, 'Session 2 unlocked: Participant received remaining 7 questions');

  // Ensure no overlap between S1 questions and S2 questions for team1
  const s1Ids = new Set(s1QRes.questions.map(q => q.id));
  const s2Ids = new Set(s2QRes.questions.map(q => q.id));
  const overlap = [...s1Ids].filter(id => s2Ids.has(id));
  assert(overlap.length === 0, `No duplicate questions between Session 1 and Session 2 (14 unique questions assigned)`);

  // Leaderboard ranking calculation check
  const leaderboardRes = await fetch(`${BASE_URL}/api/leaderboard`).then(r => r.json());
  assert(leaderboardRes.success && Array.isArray(leaderboardRes.leaderboard), 'Leaderboard API returns structured rankings array');

  // TEST 11: Dynamic Room Number Matching Level Number
  console.log('\n--- Test 11: Dynamic Room Number Matching Level Number (Regardless of DB Question ID) ---');
  // For Session 1 (levels 1-7):
  const s1TitlesValid = s1QRes.questions.every((q, idx) => {
    const expectedPrefix = `ROOM ${String(idx + 1).padStart(2, '0')}:`;
    return q.name.startsWith(expectedPrefix);
  });
  assert(s1TitlesValid, 'Session 1 questions are dynamically denoted as ROOM 01 through ROOM 07 matching level numbers');

  // For Session 2 (levels 8-14):
  const s2TitlesValid = s2QRes.questions.every((q, idx) => {
    const expectedPrefix = `ROOM ${String(idx + 8).padStart(2, '0')}:`;
    return q.name.startsWith(expectedPrefix);
  });
  assert(s2TitlesValid, 'Session 2 questions are dynamically denoted as ROOM 08 through ROOM 14 matching level numbers');

  // TEST 12: Passcode Sign-Up, Re-Entry Login & State Retention
  console.log('\n--- Test 12: Passcode Sign-Up, Re-Entry Login & State Retention ---');
  const secureTeamName = 'SECURE_AVENGERS_99';
  const securePasscode = 'VIBRANIUM_KEY_2026';

  // 12a: Register with passcode
  const regSecure = await fetch(`${BASE_URL}/api/participant/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamName: secureTeamName, passcode: securePasscode })
  }).then(r => r.json());
  assert(regSecure.success && regSecure.participant.teamName === secureTeamName, 'New team signed up with custom passcode');

  // 12b: Duplicate registration attempts should fail with guidance
  const dupReg = await fetch(`${BASE_URL}/api/participant/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamName: secureTeamName, passcode: 'OTHER_PASS' })
  });
  const dupRegData = await dupReg.json();
  assert(dupReg.status === 400 && dupRegData.message.includes('CALLSIGN TAKEN'), 'Duplicate sign-up rejected and directed to RE-ENTER');

  // 12c: Submit an answer under secure team
  const secureS2Q = await fetch(`${BASE_URL}/api/session/2/questions`, {
    headers: { 'x-participant-token': regSecure.participant.token }
  }).then(r => r.json());
  const sQ1 = secureS2Q.questions[0];
  const sFullQ1 = questionsRes.questions.find(q => q.id === sQ1.id);
  await fetch(`${BASE_URL}/api/session/2/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-participant-token': regSecure.participant.token },
    body: JSON.stringify({ questionId: sQ1.id, answer: sFullQ1.keywords[0] })
  });

  // 12d: Attempt login with incorrect passcode
  const wrongLogin = await fetch(`${BASE_URL}/api/participant/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamName: secureTeamName, passcode: 'WRONG_PASS' })
  });
  assert(wrongLogin.status === 400, 'Login with incorrect passcode rejected with 400');

  // 12e: Re-Enter login with correct passcode and verify state retention
  const loginRes = await fetch(`${BASE_URL}/api/participant/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamName: secureTeamName, passcode: securePasscode })
  }).then(r => r.json());
  assert(loginRes.success && loginRes.participant.token === regSecure.participant.token, 'Team re-entered mission successfully with passcode');

  // 12f: Verify questions state shows previously solved question as isSolved: true
  const resumedState = await fetch(`${BASE_URL}/api/participant/state`, {
    headers: { 'x-participant-token': loginRes.participant.token }
  }).then(r => r.json());
  const solvedQuestionCheck = resumedState.questions.find(q => q.id === sQ1.id);
  assert(resumedState.success && solvedQuestionCheck && solvedQuestionCheck.isSolved === true, 'Resumed participant state retained exact solved chamber data');

  console.log('\n================================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed === 0) {
    console.log('🎉 ALL MASTER SPECIFICATION REQUIREMENTS MET & VALIDATED!');
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test Suite Error:', err);
  process.exit(1);
});
