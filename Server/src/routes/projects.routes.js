import express from 'express';
import requireAuth from '../middlewares/requireAuth.js';
import { pool } from '../config/db.js';

const router = express.Router();

router.get('/',requireAuth, async (req, res) => {
  try {
    const userId = req.user.id; // Set by requireAuth middleware

    const result = await pool.query(
      `SELECT id, name, description, created_at, updated_at
       FROM projects
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      projects: result.rows,
      count: result.rowCount,
    });

  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

export default router;