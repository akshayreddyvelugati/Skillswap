const pool = require('../models/db');
const { validationResult } = require('express-validator');

const createSwap = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const senderId = req.user.id;
  const { receiver_id, skill_offered, skill_requested } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO SwapRequests (sender_id, receiver_id, skill_offered, skill_requested) VALUES ($1, $2, $3, $4) RETURNING *',
      [senderId, receiver_id, skill_offered, skill_requested]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMySwaps = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      'SELECT * FROM SwapRequests WHERE sender_id = $1 OR receiver_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateSwapStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userId = req.user.id;
  const swapId = req.params.id;
  const { status } = req.body;
  try {
    const swap = await pool.query('SELECT * FROM SwapRequests WHERE id = $1', [swapId]);
    if (swap.rows.length === 0) return res.status(404).json({ message: 'Swap not found.' });
    if (swap.rows[0].receiver_id !== userId) return res.status(403).json({ message: 'Not authorized.' });
    const result = await pool.query(
      'UPDATE SwapRequests SET status = $1 WHERE id = $2 RETURNING *',
      [status, swapId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteSwap = async (req, res) => {
  const userId = req.user.id;
  const swapId = req.params.id;
  try {
    const swap = await pool.query('SELECT * FROM SwapRequests WHERE id = $1', [swapId]);
    if (swap.rows.length === 0) return res.status(404).json({ message: 'Swap not found.' });
    if (swap.rows[0].sender_id !== userId && swap.rows[0].receiver_id !== userId) return res.status(403).json({ message: 'Not authorized.' });
    if (swap.rows[0].status !== 'pending') return res.status(400).json({ message: 'Only pending swaps can be deleted.' });
    await pool.query('DELETE FROM SwapRequests WHERE id = $1', [swapId]);
    res.json({ message: 'Swap deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createSwap, getMySwaps, updateSwapStatus, deleteSwap }; 