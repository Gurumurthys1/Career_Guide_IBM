import dotenv from 'dotenv';
import { Pool } from 'pg';
import { createTables } from './schema';

dotenv.config();

async function migrate() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Create a new pool with the DATABASE_URL from .env
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // Pass the pool to createTables
    await createTables(pool);
    
    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
