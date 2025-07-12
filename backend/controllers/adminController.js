const pool = require('../models/db');
const { createObjectCsvStringifier } = require('csv-writer');
const { validationResult } = require('express-validator');

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, location, profile_photo, availability, is_public, is_banned, created_at FROM Users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const banUnbanUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userId = req.params.id;
  try {
    const user = await pool.query('SELECT is_banned FROM Users WHERE id = $1', [userId]);
    if (user.rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    const newStatus = !user.rows[0].is_banned;
    const result = await pool.query('UPDATE Users SET is_banned = $1 WHERE id = $2 RETURNING id, is_banned', [newStatus, userId]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllSwaps = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM SwapRequests ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const sendAdminMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { message } = req.body;
  try {
    const result = await pool.query('INSERT INTO AdminMessages (message) VALUES ($1) RETURNING *', [message]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getLogs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ActivityLog ORDER BY timestamp DESC');
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'user_id', title: 'UserID' },
        { id: 'activity', title: 'Activity' },
        { id: 'timestamp', title: 'Timestamp' }
      ]
    });
    const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(result.rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="logs.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllUsers, banUnbanUser, getAllSwaps, sendAdminMessage, getLogs }; 