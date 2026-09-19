import { connectMongoDB, seedDataToMongo, isMongoConnected, getMongoUri } from './mongo.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'escape_db.json');

async function runBackup() {
  console.log('═════════════════════════════════════════════════════════════════');
  console.log('  AIDEX\'26 ESCAPE ROOM // MONGODB LIVE BACKUP & SYNC UTILITY');
  console.log('═════════════════════════════════════════════════════════════════\n');

  if (!fs.existsSync(DB_FILE)) {
    console.error(`[Error] Database file not found at: ${DB_FILE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(DB_FILE, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('[Error] Corrupted escape_db.json:', e.message);
    process.exit(1);
  }

  console.log(`[Source] Reading local database:`);
  console.log(`  • Questions in bank: ${data.questions?.length || 0}`);
  console.log(`  • Participants: ${Object.keys(data.participants || {}).length}`);
  console.log(`  • Total Answer Records: ${data.answers?.length || 0}`);
  console.log(`  • Sessions: ${Object.keys(data.participant_sessions || {}).length}`);
  console.log(`  • Event Status: ${data.event_state?.status || 'N/A'}\n`);

  console.log(`[Connecting] MongoDB Target: ${getMongoUri()}`);
  const connected = await connectMongoDB();

  if (!connected) {
    console.error('\n❌ Could not connect to MongoDB.');
    console.error('Please verify your MONGODB_URI in .env:');
    console.error('  For MongoDB Atlas (cloud):');
    console.error('    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.xxxx.mongodb.net/escaperoom?retryWrites=true&w=majority');
    console.error('  For Local MongoDB:');
    console.error('    Ensure the mongod service is running on port 27017.\n');
    process.exit(1);
  }

  console.log('[Syncing] Uploading all collections to MongoDB...');
  await seedDataToMongo(data);

  console.log('\n✅ BACKUP COMPLETE! All data is perfectly stored in MongoDB.');
  process.exit(0);
}

runBackup();
