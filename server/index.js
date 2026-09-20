import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Database } from './db.js';
import { connectMongoDB, onMongoConnect, isMongoConnected, getMongoUri, seedDataToMongo } from './mongo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.ADMIN_PASSKEY || 'robin123';

// Initialize MongoDB Connection (Non-blocking with two-way sync)
onMongoConnect(() => {
  Database.syncWithMongo();
});
connectMongoDB();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.text({ limit: '50mb' }));

// Ensure serverless cold starts trigger connection
app.use((req, res, next) => {
  if (!isMongoConnected()) {
    connectMongoDB().catch(() => {});
  }
  next();
});

// Global body parser error handler
app.use((err, req, res, next) => {
  if (err && (err.type === 'entity.too.large' || err.status === 413)) {
    return res.status(413).json({
      success: false,
      error: 'PAYLOAD_TOO_LARGE',
      message: 'The submitted payload is too large. Maximum payload size is 50MB.'
    });
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_JSON',
      message: 'Malformed JSON payload: ' + err.message
    });
  }
  next(err);
});

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTICATION MIDDLEWARES
// ─────────────────────────────────────────────────────────────────────────────
function participantAuth(req, res, next) {
  const token = req.headers['x-participant-token'] || (req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null);
  if (!token) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Missing participant authentication token.' });
  }

  const participant = Database.getParticipantByToken(token);
  if (!participant) {
    return res.status(401).json({ error: 'INVALID_TOKEN', message: 'Participant token expired or invalid.' });
  }

  req.participant = participant;
  next();
}

function adminAuth(req, res, next) {
  const adminToken = req.headers['x-admin-token'] || req.headers['admin-secret'];
  if (!adminToken || adminToken !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'FORBIDDEN', message: 'Admin authorization required.' });
  }
  next();
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC / EVENT APIS
// ─────────────────────────────────────────────────────────────────────────────

// Event state & synchronized server clock
app.get('/api/event/status', (req, res) => {
  const state = Database.getEventState();
  res.json({
    success: true,
    eventState: state
  });
});

// Event session details endpoint
app.get('/api/event/session', (req, res) => {
  const state = Database.getEventState();
  res.json({
    success: true,
    active_session: state.active_session,
    status: state.status,
    eventState: state
  });
});

// Legacy status endpoint
app.get('/api/status', (req, res) => {
  const state = Database.getEventState();
  res.json({
    status: state.status,
    system: 'LATVERIA-NET INTRUSION',
    uplink: 'STABLE',
    serverTime: Date.now(),
    eventState: state
  });
});

// Participant registration (Sign Up)
app.post('/api/participant/register', (req, res) => {
  try {
    const { teamName, teamPassword, passcode } = req.body;
    if (!teamName || !String(teamName).trim()) {
      return res.status(400).json({ error: 'MISSING_NAME', message: 'Team callsign is required.' });
    }

    const pass = teamPassword || passcode || '';
    const participant = Database.registerParticipant(teamName, pass);
    const eventState = Database.getEventState();

    res.json({
      success: true,
      participant: {
        id: participant.id,
        teamName: participant.teamName,
        token: participant.token
      },
      eventState
    });
  } catch (err) {
    res.status(400).json({ error: 'REGISTRATION_FAILED', message: err.message });
  }
});

// Participant login (Re-Enter Mission & Resume State)
const handleParticipantLogin = (req, res) => {
  try {
    const { teamName, teamPassword, passcode } = req.body;
    if (!teamName || !String(teamName).trim()) {
      return res.status(400).json({ error: 'MISSING_NAME', message: 'Team callsign is required.' });
    }

    const pass = teamPassword || passcode || '';
    const participant = Database.loginParticipant(teamName, pass);
    const eventState = Database.getEventState();

    res.json({
      success: true,
      participant: {
        id: participant.id,
        teamName: participant.teamName,
        token: participant.token
      },
      eventState
    });
  } catch (err) {
    res.status(400).json({ error: 'LOGIN_FAILED', message: err.message });
  }
};

app.post('/api/participant/login', handleParticipantLogin);
app.post('/api/participant/re-enter', handleParticipantLogin);

// Auth login alias
app.post('/api/auth/login', (req, res) => {
  const { teamName, teamPassword, passcode, token } = req.body;
  if (token) {
    const participant = Database.getParticipantByToken(token);
    if (participant) {
      return res.json({
        success: true,
        participant: {
          id: participant.id,
          teamName: participant.teamName,
          token: participant.token
        },
        eventState: Database.getEventState()
      });
    }
  }

  if (teamName) {
    try {
      const pass = teamPassword || passcode || '';
      const participant = Database.registerParticipant(teamName, pass);
      return res.json({
        success: true,
        participant: {
          id: participant.id,
          teamName: participant.teamName,
          token: participant.token
        },
        eventState: Database.getEventState()
      });
    } catch (err) {
      return res.status(400).json({ error: 'LOGIN_FAILED', message: err.message });
    }
  }

  return res.status(400).json({ error: 'MISSING_CREDENTIALS', message: 'teamName or token is required.' });
});

// Participant profile endpoint
app.get('/api/participant/profile', participantAuth, (req, res) => {
  const participant = req.participant;
  const sessions = Database.getAdminProgress().participants.find((p) => p.id === participant.id) || {};
  res.json({
    success: true,
    participant: {
      id: participant.id,
      teamName: participant.teamName
    },
    stats: sessions
  });
});

// Restore participant profile & state — single source of truth for the frontend
app.get('/api/participant/state', participantAuth, (req, res) => {
  const participant = req.participant;
  const eventState = Database.getEventState(participant.id);
  const sessionNum = eventState.active_session || 1;

  const isSessionActive = eventState.status === 'SESSION_1_ACTIVE' || eventState.status === 'SESSION_2_ACTIVE';
  const currentQuestions = isSessionActive
    ? Database.getParticipantQuestionsForSession(participant.id, sessionNum)
    : [];

  const hints = Database.getParticipantHints(participant.id);

  // Compute sessionStats directly from answer records (authoritative, not the pSession.completed flag)
  const rawDb = Database.getRawDb();
  const pSession = (rawDb.participant_sessions || {})[participant.id] || {};
  const answers = (rawDb.answers || []).filter(a => a.participantId === participant.id && a.isCorrect);
  const s1Assignments = (rawDb.question_assignments?.[participant.id] || []).filter(a => a.sessionNumber === 1);
  const s2Assignments = (rawDb.question_assignments?.[participant.id] || []).filter(a => a.sessionNumber === 2);
  const s1SolvedCount = answers.filter(a => s1Assignments.some(x => x.questionId === a.questionId)).length;
  const s2SolvedCount = answers.filter(a => s2Assignments.some(x => x.questionId === a.questionId)).length;

  const sessionStats = {
    ...pSession,
    session1Completed: s1Assignments.length > 0 && s1SolvedCount >= s1Assignments.length,
    session2Completed: s2Assignments.length > 0 && s2SolvedCount >= s2Assignments.length,
    s1SolvedCount,
    s2SolvedCount,
    s1Total: s1Assignments.length,
    s2Total: s2Assignments.length
  };

  res.json({
    success: true,
    participant: {
      id: participant.id,
      teamName: participant.teamName
    },
    eventState,
    sessionNumber: sessionNum,
    questions: currentQuestions,
    hintsUsed: hints,
    sessionStats
  });
});

// Register-or-Login: single unified endpoint for participants
// Tries to register; if team already exists, falls back to login with provided password.
app.post('/api/participant/join', (req, res) => {
  try {
    const { teamName, passcode, teamPassword } = req.body;
    if (!teamName || !String(teamName).trim()) {
      return res.status(400).json({ error: 'MISSING_NAME', message: 'Team callsign is required.' });
    }
    const pass = teamPassword || passcode || '';
    let participant;
    try {
      participant = Database.registerParticipant(teamName, pass);
    } catch (registerErr) {
      // Team exists — try login instead
      try {
        participant = Database.loginParticipant(teamName, pass);
      } catch (loginErr) {
        return res.status(401).json({ error: 'AUTH_FAILED', message: loginErr.message });
      }
    }
    const eventState = Database.getEventState();
    return res.json({
      success: true,
      participant: { id: participant.id, teamName: participant.teamName, token: participant.token },
      eventState
    });
  } catch (err) {
    return res.status(400).json({ error: 'JOIN_FAILED', message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SESSION & QUESTION APIS (ANTI-CHEAT PROTECTED)
// ─────────────────────────────────────────────────────────────────────────────

// Get questions for active session (Sanitized: NO ANSWERS)
app.get('/api/session/:sessionNum/questions', participantAuth, (req, res) => {
  const sessionNum = parseInt(req.params.sessionNum, 10);
  const eventState = Database.getEventState();

  // Validate session gate
  if (sessionNum === 1 && eventState.status !== 'SESSION_1_ACTIVE') {
    return res.status(403).json({
      error: 'SESSION_LOCKED',
      message: 'Session 1 is currently locked by the Game Master.',
      eventState
    });
  }

  if (sessionNum === 2 && eventState.status !== 'SESSION_2_ACTIVE') {
    return res.status(403).json({
      error: 'SESSION_LOCKED',
      message: 'Session 2 is currently locked by the Game Master.',
      eventState
    });
  }

  const questions = Database.getParticipantQuestionsForSession(req.participant.id, sessionNum);
  res.json({
    success: true,
    sessionNumber: sessionNum,
    questions,
    serverTime: Date.now()
  });
});

// Submit answer for assigned question (supports both /answer and /submit)
const handleAnswerSubmission = (req, res) => {
  const sessionNum = parseInt(req.params.sessionNum, 10);
  const { questionId, answer } = req.body;
  const eventState = Database.getEventState();

  if (!questionId || answer === undefined) {
    return res.status(400).json({ error: 'MISSING_DATA', message: 'questionId and answer are required.' });
  }

  if (sessionNum === 1 && eventState.status !== 'SESSION_1_ACTIVE') {
    return res.status(403).json({ error: 'SESSION_LOCKED', message: 'Session 1 is no longer active.' });
  }

  if (sessionNum === 2 && eventState.status !== 'SESSION_2_ACTIVE') {
    return res.status(403).json({ error: 'SESSION_LOCKED', message: 'Session 2 is no longer active.' });
  }

  try {
    const result = Database.submitAnswer(req.participant.id, questionId, sessionNum, answer);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: 'SUBMISSION_FAILED', message: err.message });
  }
};

app.post('/api/session/:sessionNum/answer', participantAuth, handleAnswerSubmission);
app.post('/api/session/:sessionNum/submit', participantAuth, handleAnswerSubmission);

// Record hint usage & penalty
const handleHintEndpoint = (req, res) => {
  const { questionId, hintIdx, penalty } = req.body;
  if (!questionId || hintIdx === undefined) {
    return res.status(400).json({ error: 'MISSING_DATA', message: 'questionId and hintIdx are required.' });
  }
  try {
    const hintResult = Database.recordHintUsage(req.participant.id, questionId, hintIdx, penalty);
    res.json({
      success: true,
      ...hintResult
    });
  } catch (err) {
    res.status(400).json({ error: 'HINT_LOG_FAILED', message: err.message });
  }
};

app.post('/api/session/:sessionNum/hint', participantAuth, handleHintEndpoint);
app.post('/api/session/hint', participantAuth, handleHintEndpoint);

// Complete session & calculate duration
app.post('/api/session/:sessionNum/complete', participantAuth, (req, res) => {
  const sessionNum = parseInt(req.params.sessionNum, 10);
  try {
    const sessionSummary = Database.completeSession(req.participant.id, sessionNum);
    res.json({
      success: true,
      sessionSummary
    });
  } catch (err) {
    res.status(400).json({ error: 'COMPLETION_FAILED', message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// LEADERBOARD API
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/leaderboard', (req, res) => {
  const leaderboard = Database.getLeaderboard();
  const eventState = Database.getEventState();
  res.json({
    success: true,
    eventState,
    leaderboard
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN APIS (PROTECTED)
// ─────────────────────────────────────────────────────────────────────────────

// Admin passkey login
app.post('/api/admin/login', (req, res) => {
  const { passkey } = req.body;
  if (passkey === ADMIN_SECRET) {
    return res.json({
      success: true,
      adminToken: ADMIN_SECRET,
      eventState: Database.getEventState()
    });
  } else {
    return res.status(401).json({ error: 'INVALID_PASSKEY', message: 'Incorrect Doctor Doom Admin Passkey.' });
  }
});

// Change event state (OPEN SESSION 1, LOCK SESSION 1, OPEN SESSION 2, etc.)
app.post('/api/admin/event/state', adminAuth, (req, res) => {
  const { status, durationMinutes } = req.body;
  try {
    const updatedState = Database.updateEventState(status, { durationMinutes });
    res.json({
      success: true,
      eventState: updatedState
    });
  } catch (err) {
    res.status(400).json({ error: 'STATE_TRANSITION_FAILED', message: err.message });
  }
});

// Real-time Dynamic Timer Control (+1m, +5m, +10m, -1m, pause, resume, set duration)
app.post('/api/admin/event/adjust-time', adminAuth, (req, res) => {
  const { minutes, durationMinutes, action } = req.body;
  try {
    const updatedState = Database.adjustEventTime({ minutes, durationMinutes, action });
    res.json({
      success: true,
      eventState: updatedState
    });
  } catch (err) {
    res.status(400).json({ error: 'TIMER_ADJUST_FAILED', message: err.message });
  }
});

// Admin Session Open (Session 1 or 2)
// Also ensures all registered participants have their question assignments.
app.post('/api/admin/session/open', adminAuth, (req, res) => {
  const { session = 1, durationMinutes } = req.body;
  const targetStatus = Number(session) === 2 ? 'SESSION_2_ACTIVE' : 'SESSION_1_ACTIVE';
  try {
    const updatedState = Database.updateEventState(targetStatus, { durationMinutes });

    // Ensure every registered participant has their question assignments.
    // This fixes blank page when participants registered before/during a session start.
    const rawDb = Database.getRawDb();
    const participantIds = Object.keys(rawDb.participants || {});
    let assignedCount = 0;
    for (const pid of participantIds) {
      const existing = (rawDb.question_assignments || {})[pid] || [];
      if (existing.length < 14) {
        Database.generateRandomQuestionsForParticipant(pid);
        assignedCount++;
      }
    }
    if (assignedCount > 0) {
      console.log(`[Admin] Auto-assigned questions to ${assignedCount} participant(s) on session open.`);
    }

    res.json({
      success: true,
      sessionOpened: Number(session),
      eventState: updatedState,
      participantsAssigned: assignedCount
    });
  } catch (err) {
    res.status(400).json({ error: 'OPEN_SESSION_FAILED', message: err.message });
  }
});

// Admin Session Lock (Session 1 or 2)
app.post('/api/admin/session/lock', adminAuth, (req, res) => {
  const { session = 1 } = req.body;
  const targetStatus = Number(session) === 2 ? 'SESSION_2_LOCKED' : 'SESSION_1_LOCKED';
  try {
    const updatedState = Database.updateEventState(targetStatus);
    res.json({
      success: true,
      sessionLocked: Number(session),
      eventState: updatedState
    });
  } catch (err) {
    res.status(400).json({ error: 'LOCK_SESSION_FAILED', message: err.message });
  }
});

// Reset entire competition
app.post('/api/admin/event/reset', adminAuth, (req, res) => {
  const resetState = Database.resetCompetition();
  res.json({
    success: true,
    message: 'Competition reset successfully.',
    eventState: resetState
  });
});

// Get real-time participant progress tracker
app.get('/api/admin/progress', adminAuth, (req, res) => {
  const progressData = Database.getAdminProgress();
  res.json({
    success: true,
    ...progressData
  });
});

// Get participants list & credentials
app.get('/api/admin/participants', adminAuth, (req, res) => {
  const progressData = Database.getAdminProgress();
  res.json({
    success: true,
    totalParticipants: progressData.totalParticipants,
    participants: progressData.participants
  });
});

// Admin Create Participant Credentials (supports /participant/create, /participants/create, and POST /participants)
const handleAdminCreateParticipant = (req, res) => {
  try {
    const { teamName, teamPassword, passcode } = req.body;
    const pass = teamPassword || passcode || '';
    const participant = Database.createParticipantCredentials(teamName, pass);
    res.json({
      success: true,
      participant: {
        id: participant.id,
        teamName: participant.teamName,
        teamPassword: participant.teamPassword,
        token: participant.token,
        registeredAt: participant.registeredAt
      }
    });
  } catch (err) {
    res.status(400).json({ error: 'CREATION_FAILED', message: err.message });
  }
};

app.post('/api/admin/participant/create', adminAuth, handleAdminCreateParticipant);
app.post('/api/admin/participants/create', adminAuth, handleAdminCreateParticipant);

// Admin Update Participant Password Credentials
const handleAdminUpdateParticipant = (req, res) => {
  try {
    const { participantId, teamPassword, passcode } = req.body;
    const pass = teamPassword || passcode || '';
    const updated = Database.updateParticipantCredentials(participantId, pass);
    res.json({
      success: true,
      participant: {
        id: updated.id,
        teamName: updated.teamName,
        teamPassword: updated.teamPassword
      }
    });
  } catch (err) {
    res.status(400).json({ error: 'UPDATE_FAILED', message: err.message });
  }
};

app.post('/api/admin/participant/update', adminAuth, handleAdminUpdateParticipant);
app.post('/api/admin/participants/update', adminAuth, handleAdminUpdateParticipant);

// Admin Delete Participant Credentials
const handleAdminDeleteParticipant = (req, res) => {
  try {
    const deleted = Database.deleteParticipant(req.params.id);
    res.json({
      success: deleted
    });
  } catch (err) {
    res.status(400).json({ error: 'DELETE_FAILED', message: err.message });
  }
};

app.delete('/api/admin/participant/:id', adminAuth, handleAdminDeleteParticipant);
app.delete('/api/admin/participants/:id', adminAuth, handleAdminDeleteParticipant);

// Admin Leaderboard
app.get('/api/admin/leaderboard', adminAuth, (req, res) => {
  const leaderboard = Database.getLeaderboard();
  const eventState = Database.getEventState();
  res.json({
    success: true,
    eventState,
    leaderboard
  });
});

// Question Bank CRUD
app.get('/api/admin/questions', adminAuth, (req, res) => {
  const questions = Database.getAllQuestions(true); // Include secret keywords
  res.json({
    success: true,
    questions
  });
});

app.post('/api/admin/questions', adminAuth, (req, res) => {
  try {
    const newQuestion = Database.addQuestion(req.body);
    res.json({
      success: true,
      question: newQuestion
    });
  } catch (err) {
    res.status(400).json({ error: 'CREATION_FAILED', message: err.message });
  }
});

// Bulk Import Questions via JSON
app.post('/api/admin/questions/bulk-import', adminAuth, (req, res) => {
  const questions = Array.isArray(req.body) ? req.body : (req.body?.questions || []);
  try {
    const imported = Database.bulkImportQuestions(questions);
    res.json({
      success: true,
      count: imported.length,
      questions: imported
    });
  } catch (err) {
    res.status(400).json({ error: 'IMPORT_FAILED', message: err.message });
  }
});

app.put('/api/admin/questions/:id', adminAuth, (req, res) => {
  const updated = Database.updateQuestion(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'NOT_FOUND', message: 'Question not found.' });
  }
  res.json({
    success: true,
    question: updated
  });
});

app.delete('/api/admin/questions/:id', adminAuth, (req, res) => {
  const deleted = Database.deleteQuestion(req.params.id);
  res.json({
    success: deleted
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DATABASE & MONGODB SYNC APIS
// ─────────────────────────────────────────────────────────────────────────────

// Get MongoDB and Local Database Connection Status
app.get('/api/admin/db/status', adminAuth, (req, res) => {
  const isConnected = isMongoConnected();
  const rawDb = Database.getRawDb();
  res.json({
    success: true,
    mongoConnected: isConnected,
    mongoUri: getMongoUri(),
    stats: {
      questionsCount: (rawDb.questions || []).length,
      participantsCount: Object.keys(rawDb.participants || {}).length,
      answersCount: (rawDb.answers || []).length,
      sessionsCount: Object.keys(rawDb.participant_sessions || {}).length,
      eventStatus: rawDb.event_state?.status || 'N/A'
    }
  });
});

// Trigger full two-way synchronization between local file and MongoDB
app.post('/api/admin/db/sync', adminAuth, async (req, res) => {
  try {
    const rawDb = Database.getRawDb();
    if (isMongoConnected()) {
      await seedDataToMongo(rawDb);
      await Database.syncWithMongo();
      res.json({
        success: true,
        message: 'Successfully synchronized all database collections to MongoDB cluster.',
        mongoConnected: true
      });
    } else {
      // Attempt connection first
      const connected = await connectMongoDB();
      if (connected) {
        await seedDataToMongo(rawDb);
        await Database.syncWithMongo();
        res.json({
          success: true,
          message: 'Connected and synchronized state to MongoDB cluster.',
          mongoConnected: true
        });
      } else {
        res.status(503).json({
          success: false,
          error: 'MONGO_OFFLINE',
          message: `Could not connect to MongoDB (${getMongoUri()}). Local persistent database is active with zero data loss.`,
          mongoConnected: false
        });
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'SYNC_FAILED', message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// STATIC ASSETS & SINGLE PAGE APP ROUTING
// ─────────────────────────────────────────────────────────────────────────────
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'ENDPOINT_NOT_FOUND', message: 'API route does not exist.' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

function startServer(port) {
  const server = app.listen(port, '0.0.0.0', () => {
    try {
      // Only write port file locally (Vercel filesystem is read-only)
      if (!process.env.VERCEL) {
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(path.join(dataDir, '.backend_port'), String(port), 'utf8');
      }
    } catch (e) {}
    console.log(`\n[DOOM-OS SERVER] Express backend running on http://127.0.0.1:${port}\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[DOOM-OS SERVER] Port ${port} is in use. Trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('[DOOM-OS SERVER] Server error:', err);
    }
  });
}

// Only start the HTTP server when running locally (not on Vercel serverless)
if (!process.env.VERCEL) {
  startServer(DEFAULT_PORT);
}

// Export for Vercel serverless / testing
export default app;

