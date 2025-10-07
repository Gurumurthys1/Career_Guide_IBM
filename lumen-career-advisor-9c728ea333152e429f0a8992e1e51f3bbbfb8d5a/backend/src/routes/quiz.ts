import express from 'express';
import { pool } from '../database/schema';

const router = express.Router();

// Get quiz questions by subject
router.get('/:subject', async (req, res) => {
  try {
    const { subject } = req.params;

    const result = await pool.query(
      'SELECT * FROM quiz_questions WHERE subject = $1 ORDER BY RANDOM() LIMIT 10',
      [subject]
    );

    res.json({ questions: result.rows });
  } catch (error) {
    console.error('Get quiz questions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all subjects
router.get('/subjects/all', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT subject FROM quiz_questions ORDER BY subject'
    );

    res.json({ subjects: result.rows.map(row => row.subject) });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit quiz results
router.post('/results', async (req, res) => {
  try {
    const { user_id, subject, score, total_questions, answers } = req.body;

    if (!user_id || !subject || score === undefined || !total_questions || !answers) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await pool.query(
      'INSERT INTO quiz_results (user_id, subject, score, total_questions, answers) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, subject, score, total_questions, answers]
    );

    res.status(201).json({ result: result.rows[0] });
  } catch (error) {
    console.error('Submit quiz results error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's quiz results
router.get('/results/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      'SELECT * FROM quiz_results WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );

    res.json({ results: result.rows });
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
