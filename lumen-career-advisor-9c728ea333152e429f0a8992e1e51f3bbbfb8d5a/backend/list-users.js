// list-users.js
const Database = require('better-sqlite3');
const db = new Database('dev.db');

console.log('List of users:');
try {
  const users = db.prepare("SELECT id, email, first_name, last_name, role FROM users").all();
  console.table(users);
} catch (e) {
  console.log('Error fetching users:', e.message);
}

db.close();