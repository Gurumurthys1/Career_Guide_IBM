import express from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../database/schema';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Get graduate profile by user ID
router.get('/:user_id', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.params;

    // Allow users to view their own profile or admins to view any profile
    if (req.user.id !== user_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      'SELECT * FROM graduate_profiles WHERE user_id = $1',
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile: result.rows[0] });
  } catch (error) {
    console.error('Get graduate profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update graduate profile
router.post('/:user_id', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    const { resume_text, extracted_skills, job_matches } = req.body;

    // Allow users to update their own profile or admins to update any profile
    if (req.user.id !== user_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if profile exists
    const existingProfile = await pool.query(
      'SELECT id FROM graduate_profiles WHERE user_id = $1',
      [user_id]
    );

    let result;

    if (existingProfile.rows.length > 0) {
      // Update existing profile
      result = await pool.query(
        'UPDATE graduate_profiles SET resume_text = $1, extracted_skills = $2, job_matches = $3, updated_at = NOW() WHERE user_id = $4 RETURNING *',
        [resume_text, extracted_skills || [], job_matches || [], user_id]
      );
    } else {
      // Create new profile
      result = await pool.query(
        'INSERT INTO graduate_profiles (user_id, resume_text, extracted_skills, job_matches) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, resume_text, extracted_skills || [], job_matches || []]
      );
    }

    res.status(existingProfile.rows.length > 0 ? 200 : 201).json({
      profile: result.rows[0],
      message: existingProfile.rows.length > 0 ? 'Profile updated successfully' : 'Profile created successfully'
    });
  } catch (error) {
    console.error('Create/update graduate profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update extracted skills
router.patch('/:user_id/skills', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    const { extracted_skills } = req.body;

    // Allow users to update their own profile or admins to update any profile
    if (req.user.id !== user_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!Array.isArray(extracted_skills)) {
      return res.status(400).json({ error: 'Extracted skills must be an array' });
    }

    const result = await pool.query(
      'UPDATE graduate_profiles SET extracted_skills = $1, updated_at = NOW() WHERE user_id = $2 RETURNING *',
      [extracted_skills, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile: result.rows[0] });
  } catch (error) {
    console.error('Update extracted skills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update job matches
router.patch('/:user_id/matches', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    const { job_matches } = req.body;

    // Allow users to update their own profile or admins to update any profile
    if (req.user.id !== user_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!Array.isArray(job_matches)) {
      return res.status(400).json({ error: 'Job matches must be an array' });
    }

    const result = await pool.query(
      'UPDATE graduate_profiles SET job_matches = $1, updated_at = NOW() WHERE user_id = $2 RETURNING *',
      [job_matches, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile: result.rows[0] });
  } catch (error) {
    console.error('Update job matches error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all graduate profiles (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const result = await pool.query(
      'SELECT gp.*, u.name, u.email FROM graduate_profiles gp JOIN users u ON gp.user_id = u.id ORDER BY gp.updated_at DESC'
    );

    res.json({ profiles: result.rows });
  } catch (error) {
    console.error('Get all graduate profiles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
