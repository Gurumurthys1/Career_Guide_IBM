import express from 'express';
import { pool } from '../database/schema';

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM jobs ORDER BY title'
    );

    res.json({ jobs: result.rows });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM jobs WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job: result.rows[0] });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new job (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, required_skills, description } = req.body;

    if (!title || !required_skills) {
      return res.status(400).json({ error: 'Title and required skills are required' });
    }

    const result = await pool.query(
      'INSERT INTO jobs (title, required_skills, description) VALUES ($1, $2, $3) RETURNING *',
      [title, required_skills, description]
    );

    res.status(201).json({ job: result.rows[0] });
  } catch (error) {
    console.error('Create job error:', error);
    if (error.code === '23505') { // unique_violation
      res.status(409).json({ error: 'Job already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update job (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, required_skills, description } = req.body;

    const result = await pool.query(
      'UPDATE jobs SET title = $1, required_skills = $2, description = $3 WHERE id = $4 RETURNING *',
      [title, required_skills, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job: result.rows[0] });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete job (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM jobs WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
