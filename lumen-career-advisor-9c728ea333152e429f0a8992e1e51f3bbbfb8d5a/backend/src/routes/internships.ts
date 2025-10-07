import express from 'express';
import { pool } from '../database/schema';

const router = express.Router();

// Get all internships
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM internships ORDER BY platform, title'
    );

    res.json({ internships: result.rows });
  } catch (error) {
    console.error('Get internships error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get internships by platform
router.get('/platform/:platform', async (req, res) => {
  try {
    const { platform } = req.params;

    const result = await pool.query(
      'SELECT * FROM internships WHERE platform = $1 ORDER BY title',
      [platform]
    );

    res.json({ internships: result.rows });
  } catch (error) {
    console.error('Get internships by platform error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get internships by job role
router.get('/role/:role', async (req, res) => {
  try {
    const { role } = req.params;

    const result = await pool.query(
      'SELECT * FROM internships WHERE job_role = $1 ORDER BY title',
      [role]
    );

    res.json({ internships: result.rows });
  } catch (error) {
    console.error('Get internships by role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new internship (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, platform, url, job_role, required_skills } = req.body;

    if (!title || !platform || !job_role || !required_skills) {
      return res.status(400).json({ error: 'Title, platform, job role, and required skills are required' });
    }

    const result = await pool.query(
      'INSERT INTO internships (title, platform, url, job_role, required_skills) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, platform, url, job_role, required_skills]
    );

    res.status(201).json({ internship: result.rows[0] });
  } catch (error) {
    console.error('Create internship error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
