// create-test-user.js
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const db = new Database('dev.db');

async function createTestUser() {
  const email = 'test@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const stmt = db.prepare(`
    INSERT INTO users (email, password_hash, first_name, last_name, role)
    VALUES (?, ?, 'Test', 'User', 'user')
  `);

  try {
    stmt.run(email, hashedPassword);
    console.log('✅ Test user created successfully');
    console.log('Email: test@example.com');
    console.log('Password: password123');
  } catch (e) {
    console.log('❌ Error creating test user:', e.message);
  } finally {
    db.close();
  }
}

createTestUser();