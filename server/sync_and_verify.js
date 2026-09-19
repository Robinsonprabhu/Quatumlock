import { Database } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'escape_db.json');

async function syncAndVerify() {
  console.log('[Sync] Loading persistent DB...');
  
  // Reload questions from default curated 20 questions
  Database.reloadQuestionsFromDefaults();
  Database.resetCompetition();
  
  // Reload questions
  const questions = Database.getAllQuestions(true);
  console.log(`[Sync] Total questions loaded in bank: ${questions.length}`);
  
  let hintErrors = 0;
  questions.forEach((q) => {
    if (!q.hints || q.hints.length !== 2) {
      console.error(`[Error] Question ${q.id} does not have exactly 2 hints! Has ${q.hints?.length}`);
      hintErrors++;
    }
  });

  if (hintErrors === 0) {
    console.log('[Sync] ✅ All 20 questions have EXACTLY 2 hints.');
  }

  // Register a test participant
  const testTeam = Database.registerParticipant('AVENGERS_ALPHA', 'robin123');
  console.log(`[Test] Registered participant: ${testTeam.teamName} (${testTeam.id})`);

  // Activate Session 1
  Database.updateEventState('SESSION_1_ACTIVE');
  
  // Retrieve Session 1 questions
  const s1Questions = Database.getParticipantQuestionsForSession(testTeam.id, 1);
  console.log(`[Test] Session 1 question count: ${s1Questions.length} (Expected: 7)`);
  if (s1Questions.length !== 7) {
    console.error(`[FAIL] Expected 7 questions in Session 1, got ${s1Questions.length}`);
  }

  // Check titles: should be ROOM 01 to ROOM 07
  s1Questions.forEach((q, i) => {
    console.log(`  S1-${i + 1}: ${q.title} (Level: ${q.levelNumber}, Hints: ${q.hints?.length})`);
  });

  // Test Hint Usage on Question 1
  const q1 = s1Questions[0];
  Database.recordHintUsage(testTeam.id, q1.id, 0, q1.hints[0].penalty);
  console.log(`[Test] Hint 1 recorded for ${q1.id} with penalty -${q1.hints[0].penalty}`);

  // Submit correct answer for Q1
  const fullQ1 = questions.find(q => q.id === q1.id);
  const ansRes = Database.submitAnswer(testTeam.id, q1.id, 1, fullQ1.keywords[0]);
  console.log(`[Test] Submitted answer for Q1 (${fullQ1.keywords[0]}): isCorrect=${ansRes.isCorrect}`);

  // Activate Session 2
  Database.updateEventState('SESSION_2_ACTIVE');
  const s2Questions = Database.getParticipantQuestionsForSession(testTeam.id, 2);
  console.log(`[Test] Session 2 question count: ${s2Questions.length} (Expected: 7)`);
  if (s2Questions.length !== 7) {
    console.error(`[FAIL] Expected 7 questions in Session 2, got ${s2Questions.length}`);
  }

  // Check titles: should be ROOM 08 to ROOM 14
  s2Questions.forEach((q, i) => {
    console.log(`  S2-${i + 1}: ${q.title} (Level: ${q.levelNumber}, Hints: ${q.hints?.length})`);
  });

  // Check Leaderboard
  const lb = Database.getLeaderboard();
  console.log('[Test] Leaderboard result:', JSON.stringify(lb[0], null, 2));

  // Reset test data so user gets clean start
  Database.resetCompetition();
  console.log('[Sync] ✅ Database cleanly reset and ready for competition.');
  process.exit(0);
}

syncAndVerify().catch(err => {
  console.error('[Sync] Error:', err);
  process.exit(1);
});
