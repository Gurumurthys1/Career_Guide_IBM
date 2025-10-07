import express from 'express';
import { pool } from '../database/schema';

const router = express.Router();

// Get all certifications
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM certifications ORDER BY platform, title'
    );

    res.json({ certifications: result.rows });
  } catch (error) {
    console.error('Get certifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get certifications by platform
router.get('/platform/:platform', async (req, res) => {
  try {
    const { platform } = req.params;

    const result = await pool.query(
      'SELECT * FROM certifications WHERE platform = $1 ORDER BY title',
      [platform]
    );

    res.json({ certifications: result.rows });
  } catch (error) {
    console.error('Get certifications by platform error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get certifications by skill
router.get('/skill/:skill', async (req, res) => {
  try {
    const { skill } = req.params;

    const result = await pool.query(
      'SELECT * FROM certifications WHERE $1 = ANY(skill_tags) ORDER BY title',
      [skill]
    );

    res.json({ certifications: result.rows });
  } catch (error) {
    console.error('Get certifications by skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new certification (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, platform, url, skill_tags } = req.body;

    if (!title || !platform || !skill_tags) {
      return res.status(400).json({ error: 'Title, platform, and skill tags are required' });
    }

    const result = await pool.query(
      'INSERT INTO certifications (title, platform, url, skill_tags) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, platform, url, skill_tags]
    );

    res.status(201).json({ certification: result.rows[0] });
  } catch (error) {
    console.error('Create certification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
