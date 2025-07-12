const pool = require('../models/db');
const { validationResult } = require('express-validator');

const addFeedback = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userId = req.user.id;
  const { swap_id, rating, comment } = req.body;
  try {
    // Check if user is part of the swap
    const swap = await pool.query('SELECT * FROM SwapRequests WHERE id = $1', [swap_id]);
    if (swap.rows.length === 0) return res.status(404).json({ message: 'Swap not found.' });
    if (swap.rows[0].sender_id !== userId && swap.rows[0].receiver_id !== userId) return res.status(403).json({ message: 'Not authorized.' });
    const result = await pool.query(
      'INSERT INTO Feedback (swap_id, rating, comment) VALUES ($1, $2, $3) RETURNING *',
      [swap_id, rating, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getFeedbackForUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await pool.query(
      `SELECT f.* FROM Feedback f
       JOIN SwapRequests s ON f.swap_id = s.id
       WHERE s.receiver_id = $1 OR s.sender_id = $1
       ORDER BY f.submitted_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { addFeedback, getFeedbackForUser }; 