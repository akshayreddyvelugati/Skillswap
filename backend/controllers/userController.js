const pool = require('../models/db');
const { validationResult } = require('express-validator');

const listPublicUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, location, profile_photo, availability, is_public, is_banned, created_at FROM Users WHERE is_public = TRUE AND is_banned = FALSE ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query("SELECT id, name, email, location, profile_photo, availability, is_public, is_banned, created_at FROM Users WHERE id = $1", [userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userId = req.params.id;
  const { location, availability, is_public, profile_photo } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Users SET location = $1, availability = $2, is_public = $3, profile_photo = $4 WHERE id = $5 RETURNING id, name, email, location, profile_photo, availability, is_public, is_banned, created_at',
      [location, availability, is_public, profile_photo, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { listPublicUsers, getUserById, updateUser }; 