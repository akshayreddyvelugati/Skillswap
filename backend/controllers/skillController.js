const pool = require('../models/db');
const { validationResult } = require('express-validator');

const getSkillsByUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query('SELECT id, skill_name, type FROM Skills WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addSkill = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userId = req.user.id;
  const { skill_name, type } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Skills (user_id, skill_name, type) VALUES ($1, $2, $3) RETURNING id, skill_name, type',
      [userId, skill_name, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteSkill = async (req, res) => {
  const userId = req.user.id;
  const skillId = req.params.id;
  try {
    const result = await pool.query('DELETE FROM Skills WHERE id = $1 AND user_id = $2 RETURNING id', [skillId, userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Skill not found.' });
    res.json({ message: 'Skill deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getSkillsByUser, addSkill, deleteSkill }; 