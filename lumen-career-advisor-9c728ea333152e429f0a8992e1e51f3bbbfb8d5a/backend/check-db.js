// check-db.js
const Database = require('better-sqlite3');
const db = new Database('dev.db');

console.log('Database tables:');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.table(tables);

console.log('\nUsers table columns:');
try {
  const columns = db.prepare("PRAGMA table_info(users)").all();
  console.table(columns);
} catch (e) {
  console.log('Users table does not exist or error:', e.message);
}

db.close();