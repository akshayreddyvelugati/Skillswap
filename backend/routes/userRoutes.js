const express = require('express');
const router = express.Router();
const { listPublicUsers, getUserById, updateUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator');

router.get('/users/public', listPublicUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', authMiddleware, [
  body('location').optional().isString(),
  body('availability').optional().isString(),
  body('is_public').optional().isBoolean(),
  body('profile_photo').optional().isString()
], updateUser);

module.exports = router; 