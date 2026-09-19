import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Configurable via .env MONGODB_URI or MONGO_URL (supports Atlas mongodb+srv://)
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/escaperoom';

// ─────────────────────────────────────────────────────────────────────────────
// MONGOOSE SCHEMAS & MODELS
// ─────────────────────────────────────────────────────────────────────────────

const EventStateSchema = new mongoose.Schema({
  status: { type: String, default: 'CLOSED' },
  active_session: { type: Number, default: 0 },
  session1_started_at: { type: Number, default: null },
  session1_locked_at: { type: Number, default: null },
  session2_started_at: { type: Number, default: null },
  session2_locked_at: { type: Number, default: null },
  event_finished_at: { type: Number, default: null },
  session_duration_minutes: { type: Number, default: 30 },
  timer_paused: { type: Boolean, default: false },
  timer_paused_at: { type: Number, default: null },
  time_adjustment_seconds: { type: Number, default: 0 }
}, { timestamps: true });

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  category: { type: String, default: 'Computer Science' },
  difficulty: { type: String, default: 'Medium' },
  enabled: { type: Boolean, default: true },
  investigationType: { type: String, default: 'code' },
  story: [{ type: String }],
  codeLines: [{ type: String }],
  question: { type: String, required: true },
  hints: [{
    text: { type: String },
    penalty: { type: Number, default: 20 }
  }],
  fragment: { type: Number, default: 1 },
  evidenceTitle: { type: String, default: 'Evidence Log' },
  consequence: [{ type: String }],
  keywords: [{ type: String }],
  answer: { type: String, default: '' }
}, { timestamps: true });

const ParticipantSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  teamName: { type: String, required: true },
  passcode: { type: String, default: '' },
  token: { type: String, required: true, unique: true },
  registeredAt: { type: Number, default: () => Date.now() },
  lastActiveAt: { type: Number, default: () => Date.now() }
}, { timestamps: true });

const QuestionAssignmentSchema = new mongoose.Schema({
  assignmentId: { type: String, required: true, unique: true },
  participantId: { type: String, required: true, index: true },
  questionId: { type: String, required: true },
  sessionNumber: { type: Number, required: true },
  questionOrder: { type: Number, required: true },
  assignedAt: { type: Number, default: () => Date.now() }
}, { timestamps: true });

const AnswerSchema = new mongoose.Schema({
  answerId: { type: String, required: true, unique: true },
  participantId: { type: String, required: true, index: true },
  questionId: { type: String, required: true },
  sessionNumber: { type: Number, required: true },
  submittedAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  submittedAt: { type: Number, default: () => Date.now() }
}, { timestamps: true });

const ParticipantSessionSchema = new mongoose.Schema({
  participantId: { type: String, required: true, unique: true },
  teamName: { type: String, default: '' },
  session1: {
    status: { type: String, default: 'LOCKED' },
    startedAt: { type: Number, default: null },
    completedAt: { type: Number, default: null },
    score: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    answersCount: { type: Number, default: 0 },
    completed: { type: Boolean, default: false }
  },
  session2: {
    status: { type: String, default: 'LOCKED' },
    startedAt: { type: Number, default: null },
    completedAt: { type: Number, default: null },
    score: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    answersCount: { type: Number, default: 0 },
    completed: { type: Boolean, default: false }
  },
  totalScore: { type: Number, default: 0 },
  totalTime: { type: Number, default: 0 }
}, { timestamps: true });

const HintUsedSchema = new mongoose.Schema({
  participantId: { type: String, required: true, index: true },
  questionId: { type: String, required: true },
  hintIdx: { type: Number, required: true },
  penalty: { type: Number, default: 20 },
  usedAt: { type: Number, default: () => Date.now() }
}, { timestamps: true });

export const MongoModels = {
  EventState: mongoose.models.EventState || mongoose.model('EventState', EventStateSchema),
  Question: mongoose.models.Question || mongoose.model('Question', QuestionSchema),
  Participant: mongoose.models.Participant || mongoose.model('Participant', ParticipantSchema),
  QuestionAssignment: mongoose.models.QuestionAssignment || mongoose.model('QuestionAssignment', QuestionAssignmentSchema),
  Answer: mongoose.models.Answer || mongoose.model('Answer', AnswerSchema),
  ParticipantSession: mongoose.models.ParticipantSession || mongoose.model('ParticipantSession', ParticipantSessionSchema),
  HintUsed: mongoose.models.HintUsed || mongoose.model('HintUsed', HintUsedSchema)
};

let isConnected = false;
let retryTimeout = null;
let onConnectListeners = [];

export function onMongoConnect(listener) {
  if (typeof listener === 'function') {
    onConnectListeners.push(listener);
    if (isConnected) listener();
  }
}

let hasLoggedOfflineNotice = false;

export async function connectMongoDB() {
  if (isConnected) return true;

  const sanitizedUri = MONGODB_URI.replace(/\/\/.*@/, '//***:***@');
  try {
    if (!hasLoggedOfflineNotice) {
      console.log(`[MongoDB] Connecting to cluster (${sanitizedUri})...`);
    }
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 5000
    });
    isConnected = true;
    console.log('[MongoDB] ✅ Successfully connected to MongoDB Escaperoom cluster!');
    
    // Notify registered listeners
    for (const fn of onConnectListeners) {
      try { fn(); } catch (e) {}
    }
    return true;
  } catch (err) {
    isConnected = false;
    if (!hasLoggedOfflineNotice) {
      console.warn(`[MongoDB] ⚠️ Notice: MongoDB offline (${err.message.split('\n')[0]}).`);
      console.warn('[MongoDB] Active engine: Local persistent JSON database (server/data/escape_db.json). Zero data loss guaranteed.');
      hasLoggedOfflineNotice = true;
    }

    // Schedule silent background reconnection attempt
    if (!retryTimeout) {
      retryTimeout = setTimeout(() => {
        retryTimeout = null;
        connectMongoDB();
      }, 30000);
    }
    return false;
  }
}

export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

export function getMongoUri() {
  return MONGODB_URI.replace(/\/\/.*@/, '//***:***@');
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE RESTORATION & SEEDING
// ─────────────────────────────────────────────────────────────────────────────

export async function loadDataFromMongo() {
  if (!isMongoConnected()) return null;
  try {
    const [eventStateDoc, questionsDocs, participantDocs, assignmentDocs, answerDocs, sessionDocs, hintDocs] = await Promise.all([
      MongoModels.EventState.findOne({}).lean(),
      MongoModels.Question.find({}).lean(),
      MongoModels.Participant.find({}).lean(),
      MongoModels.QuestionAssignment.find({}).lean(),
      MongoModels.Answer.find({}).lean(),
      MongoModels.ParticipantSession.find({}).lean(),
      MongoModels.HintUsed.find({}).lean()
    ]);

    const participants = {};
    (participantDocs || []).forEach((p) => {
      participants[p.id] = {
        id: p.id,
        teamName: p.teamName,
        token: p.token,
        teamPassword: p.passcode || '',
        registeredAt: p.registeredAt,
        lastActiveAt: p.lastActiveAt
      };
    });

    const question_assignments = {};
    (assignmentDocs || []).forEach((a) => {
      if (!question_assignments[a.participantId]) question_assignments[a.participantId] = [];
      question_assignments[a.participantId].push({
        assignmentId: a.assignmentId,
        questionId: a.questionId,
        sessionNumber: a.sessionNumber,
        questionOrder: a.questionOrder,
        assignedAt: a.assignedAt
      });
    });

    const participant_sessions = {};
    (sessionDocs || []).forEach((s) => {
      participant_sessions[s.participantId] = {
        participantId: s.participantId,
        teamName: s.teamName || '',
        session1: s.session1,
        session2: s.session2,
        totalScore: s.totalScore || 0,
        totalTime: s.totalTime || 0
      };
    });

    const hints_used = {};
    (hintDocs || []).forEach((h) => {
      if (!hints_used[h.participantId]) hints_used[h.participantId] = [];
      hints_used[h.participantId].push({
        questionId: h.questionId,
        hintIdx: h.hintIdx,
        penalty: h.penalty || 20,
        usedAt: h.usedAt
      });
    });

    return {
      event_state: eventStateDoc || null,
      questions: (questionsDocs && questionsDocs.length > 0) ? questionsDocs : null,
      participants,
      question_assignments,
      answers: answerDocs || [],
      participant_sessions,
      hints_used
    };
  } catch (err) {
    console.warn('[MongoDB] Error loading state from Mongo:', err.message);
    return null;
  }
}

export async function seedDataToMongo(data) {
  if (!isMongoConnected() || !data) return;
  try {
    if (data.event_state) {
      await MongoModels.EventState.findOneAndUpdate({}, data.event_state, { upsert: true, new: true });
    }
    if (data.questions && data.questions.length > 0) {
      for (const q of data.questions) {
        await MongoModels.Question.findOneAndUpdate({ id: q.id }, q, { upsert: true });
      }
    }
    if (data.participants) {
      for (const p of Object.values(data.participants)) {
        await MongoModels.Participant.findOneAndUpdate({ id: p.id }, {
          id: p.id,
          teamName: p.teamName,
          passcode: p.teamPassword || '',
          token: p.token,
          registeredAt: p.registeredAt,
          lastActiveAt: p.lastActiveAt
        }, { upsert: true });
      }
    }
    if (data.question_assignments) {
      for (const arr of Object.values(data.question_assignments)) {
        for (const a of arr) {
          await MongoModels.QuestionAssignment.findOneAndUpdate({ assignmentId: a.assignmentId }, a, { upsert: true });
        }
      }
    }
    if (data.answers && data.answers.length > 0) {
      for (const ans of data.answers) {
        await MongoModels.Answer.findOneAndUpdate({ answerId: ans.answerId }, ans, { upsert: true });
      }
    }
    if (data.participant_sessions) {
      for (const [pId, sess] of Object.entries(data.participant_sessions)) {
        await MongoModels.ParticipantSession.findOneAndUpdate({ participantId: pId }, sess, { upsert: true });
      }
    }
    if (data.hints_used) {
      for (const [pId, hints] of Object.entries(data.hints_used)) {
        for (const h of hints) {
          await MongoModels.HintUsed.findOneAndUpdate(
            { participantId: pId, questionId: h.questionId, hintIdx: h.hintIdx },
            { ...h, participantId: pId },
            { upsert: true }
          );
        }
      }
    }
    console.log('[MongoDB] ✅ Full state successfully backed up & synchronized to MongoDB.');
  } catch (err) {
    console.warn('[MongoDB] Error seeding state to Mongo:', err.message);
  }
}

// Background asynchronous MongoDB sync helper
export async function syncToMongo(collectionName, operation, filter, doc) {
  if (!isMongoConnected()) return;
  try {
    const Model = MongoModels[collectionName];
    if (!Model) return;

    if (operation === 'upsert') {
      await Model.findOneAndUpdate(filter, doc, { upsert: true, new: true });
    } else if (operation === 'insert') {
      await Model.create(doc);
    } else if (operation === 'deleteMany') {
      await Model.deleteMany(filter);
    }
  } catch (err) {
    console.warn(`[MongoDB Sync] Warning during ${collectionName} ${operation}:`, err.message);
  }
}
