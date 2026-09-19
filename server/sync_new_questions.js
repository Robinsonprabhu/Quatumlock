import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Database } from './db.js';
import { connectMongoDB, seedDataToMongo, isMongoConnected } from './mongo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'escape_db.json');

async function syncQuestions() {
  console.log('[Sync] Updating escape_db.json with new Q01-Q05...');
  const allQuestions = Database.getAllQuestions(true);

  let currentDb = {};
  if (fs.existsSync(DB_FILE)) {
    try {
      currentDb = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {}
  }

  currentDb.questions = allQuestions;
  fs.writeFileSync(DB_FILE, JSON.stringify(currentDb, null, 2), 'utf8');
  console.log('[Sync] ✅ escape_db.json successfully updated with 20 questions.');

  const mongoOk = await connectMongoDB();
  if (mongoOk) {
    await seedDataToMongo(currentDb);
    console.log('[Sync] ✅ Synced updated questions to MongoDB.');
  }
}

syncQuestions().then(() => {
  console.log('[Sync] Complete.');
  process.exit(0);
}).catch(err => {
  console.error('[Sync] Error:', err);
  process.exit(1);
});
