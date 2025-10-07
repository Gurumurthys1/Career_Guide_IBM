import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Create enum for user roles
const createUserRoleEnum = `
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
      CREATE TYPE user_role AS ENUM ('student', 'graduate', 'mentor', 'admin');
    END IF;
  END
  $$;
`;

// Create users table
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role user_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
`;

// Create quiz questions table
const createQuizQuestionsTable = `
  CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT quiz_questions_question_key UNIQUE (question)
  );
`;

// Create quiz results table
const createQuizResultsTable = `
  CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  )`;

// Create skills taxonomy table
const createSkillsTable = `
  CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    domain TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
`;

// Create jobs ontology table
const createJobsTable = `
  CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    required_skills TEXT[] NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT jobs_title_key UNIQUE (title)
  );
`;

// Create certifications table
const createCertificationsTable = `
  CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    platform TEXT NOT NULL,
    url TEXT,
    skill_tags TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT certifications_title_platform_key UNIQUE (title, platform)
  );
`;

// Create internships table
const createInternshipsTable = `
  CREATE TABLE IF NOT EXISTS internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    platform TEXT NOT NULL,
    url TEXT,
    job_role TEXT NOT NULL,
    required_skills TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT internships_title_platform_key UNIQUE (title, platform)
  );
`;

// Create graduate profiles table
const createGraduateProfilesTable = `
  CREATE TABLE IF NOT EXISTS graduate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    resume_text TEXT,
    extracted_skills TEXT[] DEFAULT '{}',
    job_matches JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
`;

// Create mentor feedback table
const createMentorFeedbackTable = `
  CREATE TABLE IF NOT EXISTS mentor_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    graduate_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    feedback TEXT NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
`;

// Insert sample admin user
const insertSampleAdmin = `
  INSERT INTO users (email, password, name, role)
  VALUES ('dharshandhiren@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin')
  ON CONFLICT (email) DO NOTHING;
`;

// Insert sample skills
const insertSampleSkills = `
  INSERT INTO skills (name, domain) VALUES
  ('Python', 'Programming'),
  ('SQL', 'Database'),
  ('Java', 'Programming'),
  ('React', 'Frontend'),
  ('Node.js', 'Backend'),
  ('AWS', 'Cloud'),
  ('Cybersecurity', 'Security'),
  ('Machine Learning', 'AI'),
  ('Statistics', 'Data Science'),
  ('HTML', 'Frontend'),
  ('CSS', 'Frontend'),
  ('Communication', 'Soft Skills'),
  ('Problem Solving', 'Soft Skills'),
  ('Git', 'Version Control'),
  ('Cloud Basics', 'Cloud')
  ON CONFLICT (name) DO NOTHING;
`;

// Insert sample jobs
const insertSampleJobs = `
  INSERT INTO jobs (title, required_skills, description) VALUES
  ('Data Analyst', ARRAY['Python', 'SQL', 'Statistics'], 'Analyze data and generate insights'),
  ('Full Stack Developer', ARRAY['React', 'Node.js', 'HTML', 'CSS', 'Git'], 'Build web applications'),
  ('Cloud Engineer', ARRAY['AWS', 'Cloud Basics', 'Python'], 'Manage cloud infrastructure'),
  ('Cybersecurity Analyst', ARRAY['Cybersecurity', 'Problem Solving'], 'Protect systems from threats'),
  ('ML Engineer', ARRAY['Python', 'Machine Learning', 'Statistics'], 'Build AI models')
  ON CONFLICT (title) DO NOTHING;
`;

// Insert sample certifications
const insertSampleCertifications = `
  INSERT INTO certifications (title, platform, url, skill_tags) VALUES
  ('Python for Data Science', 'Coursera', 'https://coursera.org/python-ds', ARRAY['Python', 'Statistics']),
  ('AWS Cloud Practitioner', 'Coursera', 'https://coursera.org/aws', ARRAY['AWS', 'Cloud Basics']),
  ('Full Stack Development', 'Udemy', 'https://udemy.com/fullstack', ARRAY['React', 'Node.js']),
  ('Machine Learning Basics', 'NPTEL', 'https://nptel.ac.in/ml', ARRAY['Machine Learning', 'Python']),
  ('Cybersecurity Fundamentals', 'Coursera', 'https://coursera.org/security', ARRAY['Cybersecurity'])
  ON CONFLICT (title, platform) DO NOTHING;
`;

// Insert sample internships
const insertSampleInternships = `
  INSERT INTO internships (title, platform, url, job_role, required_skills) VALUES
  ('Data Analysis Intern', 'LinkedIn', 'https://linkedin.com/jobs/1', 'Data Analyst', ARRAY['Python', 'SQL']),
  ('Web Development Intern', 'Internshala', 'https://internshala.com/jobs/2', 'Full Stack Developer', ARRAY['React', 'Node.js']),
  ('Cloud Computing Intern', 'Naukri', 'https://naukri.com/jobs/3', 'Cloud Engineer', ARRAY['AWS', 'Cloud Basics']),
  ('Security Analyst Intern', 'LinkedIn', 'https://linkedin.com/jobs/4', 'Cybersecurity Analyst', ARRAY['Cybersecurity']),
  ('AI Research Intern', 'Internshala', 'https://internshala.com/jobs/5', 'ML Engineer', ARRAY['Machine Learning', 'Python'])
  ON CONFLICT (title, platform) DO NOTHING;
`;

// Insert sample quiz questions
const insertSampleQuizQuestions = `
  INSERT INTO quiz_questions (subject, question, options, correct_answer) VALUES
  ('Physics', 'What is the SI unit of force?', '["Newton", "Joule", "Watt", "Pascal"]', 'Newton'),
  ('Chemistry', 'What is the atomic number of Carbon?', '["6", "12", "8", "14"]', '6'),
  ('Chemistry', 'What is H2O?', '["Water", "Hydrogen", "Oxygen", "Peroxide"]', 'Water'),
  ('Biology', 'What is the powerhouse of the cell?', '["Mitochondria", "Nucleus", "Ribosome", "Chloroplast"]', 'Mitochondria'),
  ('Maths', 'What is 15 × 8?', '["120", "125", "115", "130"]', '120'),
  ('Computer Science', 'What does CPU stand for?', '["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Central Processor Universal"]', 'Central Processing Unit')
  ON CONFLICT DO NOTHING`;

// Initialize the database
export async function createTables(pool: Pool) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create tables
    await client.query(createUserRoleEnum);
    await client.query(createUsersTable);
    await client.query(createQuizQuestionsTable);
    await client.query(createQuizResultsTable);
    await client.query(createSkillsTable);
    await client.query(createJobsTable);
    await client.query(createCertificationsTable);
    await client.query(createInternshipsTable);
    await client.query(createGraduateProfilesTable);
    await client.query(createMentorFeedbackTable);

    // Insert sample data
    await client.query(insertSampleAdmin);
    await client.query(insertSampleSkills);
    await client.query(insertSampleJobs);
    await client.query(insertSampleCertifications);
    await client.query(insertSampleInternships);
    await client.query(insertSampleQuizQuestions);

    await client.query('COMMIT');
    console.log('✅ Database tables created and seeded successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating database tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

export { pool };
