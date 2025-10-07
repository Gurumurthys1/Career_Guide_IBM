import express from 'express';
import { pool } from '../database/schema';

const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM skills ORDER BY domain, name'
    );

    res.json({ skills: result.rows });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get skills by domain
router.get('/domain/:domain', async (req, res) => {
  try {
    const { domain } = req.params;

    const result = await pool.query(
      'SELECT * FROM skills WHERE domain = $1 ORDER BY name',
      [domain]
    );

    res.json({ skills: result.rows });
  } catch (error) {
    console.error('Get skills by domain error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new skill (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, domain } = req.body;

    if (!name || !domain) {
      return res.status(400).json({ error: 'Name and domain are required' });
    }

    const result = await pool.query(
      'INSERT INTO skills (name, domain) VALUES ($1, $2) RETURNING *',
      [name, domain]
    );

    res.status(201).json({ skill: result.rows[0] });
  } catch (error) {
    console.error('Create skill error:', error);
    if (error.code === '23505') { // unique_violation
      res.status(409).json({ error: 'Skill already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
