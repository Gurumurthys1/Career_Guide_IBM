// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();
// Debug log environment variables
console.log('Environment Variables:');
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '*** (set)' : 'Not set');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');

import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';

// Get the current file's directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lumen Career Advisor API',
      version: '1.0.0',
      description: 'API documentation for Lumen Career Advisor backend',
      contact: {
        name: 'API Support',
        url: 'http://localhost:3001',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/routes/*.js',
    './dist/routes/*.js',
  ],
};

const specs = swaggerJsdoc(options);
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import skillsRoutes from './routes/skills.js';
import jobsRoutes from './routes/jobs.js';
import certificationsRoutes from './routes/certifications.js';
import internshipsRoutes from './routes/internships.js';
import quizRoutes from './routes/quiz.js';
import profileRoutes from './routes/profiles.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Initialize SQLite database
console.log('🔄 Initializing SQLite database...');
const dbPath = path.join(process.cwd(), 'dev.db');
console.log(`🔗 Database file: ${dbPath}`);

// Create SQLite database instance
const sqlite = new Database(dbPath);

// Enable foreign key support
sqlite.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrency
sqlite.pragma('journal_mode = WAL');

// Close the database connection when the process exits
process.on('exit', () => {
  console.log('🔌 Closing database connection...');
  sqlite.close();
});

// Handle process termination
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

// Initialize Drizzle with SQLite
const db = drizzle(sqlite);

// Test database connection
const testConnection = async () => {
  console.log('🔍 Testing database connection...');
  try {
    // Test the connection with a simple query
    const result = sqlite.prepare('SELECT 1 as test').get();
    console.log('✅ Database connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:');
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      if ('code' in error) {
        console.error('Error code:', error.code);
      }
    }
    throw error;
  }
};

// Function to run database migrations
const runMigrations = async () => {
  console.log('🔄 Running database migrations...');
  const startTime = Date.now();
  
  try {
    // Since we already initialized the database with init-db.js,
    // we don't need to run migrations again.
    // Just verify the database is accessible and has the expected tables.
    console.log('🔍 Verifying database schema...');
    
    // Check if the required tables exist
    const checkTable = (table: string) => {
      try {
        const stmt = sqlite.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`);
        const result = stmt.get(table);
        if (!result) {
          throw new Error(`Table ${table} not found in the database`);
        }
        console.log(`✅ Found table: ${table}`);
      } catch (error) {
        console.error(`❌ Error checking table ${table}:`, error);
        throw error;
      }
    };

    // List of required tables
    const requiredTables = [
      'users', 'skills', 'jobs', 'certifications', 
      'internships', 'refresh_tokens', 'applications',
      'user_skills', 'job_skills'
    ];

    // Check each required table
    for (const table of requiredTables) {
      checkTable(table);
    }
    
    const endTime = Date.now();
    console.log(`✅ Database verification completed in ${endTime - startTime}ms`);
  } catch (error) {
    console.error('❌ Error running migrations:');
    
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      if ('code' in error) {
        console.error('Error code:', error.code);
      }
    }
    
    // Re-throw the error to prevent the server from starting with a failed migration
    throw error;
  }
};

// Test database connection and run migrations
const initializeDatabase = async () => {
  try {
    await testConnection();
    await runMigrations();
    console.log('✅ Database initialization completed successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
};

// Initialize the database and start the server
// Initialize the database and start the server
initializeDatabase().then(() => {
  // Security middleware
  app.use(helmet());

// Swagger UI
app.use('/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(specs, { 
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Lumen Career Advisor API',
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:8080',  // Explicitly set the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression({ level: 6 }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/internships', internshipsRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/profiles', profileRoutes);

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint with database status
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Test the database connection
    sqlite.prepare('SELECT 1').get();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'The provided token is invalid or expired.'
    });
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.errors
    });
  }

  // Default error handler
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `The requested route ${req.originalUrl} does not exist.` 
  });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log('\n=== Server Information ===');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🛡️  Rate limiting: 100 requests per 15 minutes per IP`);
  console.log('=========================\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Export the app and db for testing and other modules
module.exports = { app, sqlite, db };
});
