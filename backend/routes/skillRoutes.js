const express = require('express');
const router = express.Router();
const { getSkillsByUser, addSkill, deleteSkill } = require('../controllers/skillController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator');

router.get('/skills/user/:id', getSkillsByUser);
router.post('/skills', authMiddleware, [
  body('skill_name').notEmpty().isString().withMessage('Skill name is required.'),
  body('type').notEmpty().isString().isIn(['offered', 'wanted']).withMessage('Type must be "offered" or "wanted".')
], addSkill);
router.delete('/skills/:id', authMiddleware, deleteSkill);

module.exports = router; 