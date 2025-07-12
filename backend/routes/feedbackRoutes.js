const express = require('express');
const router = express.Router();
const { addFeedback, getFeedbackForUser } = require('../controllers/feedbackController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator');

router.post('/feedback', authMiddleware, [
  body('swap_id').notEmpty().withMessage('Swap ID is required.'),
  body('rating').isNumeric().custom(v => v >= 1 && v <= 5).withMessage('Rating must be a number between 1 and 5.'),
  body('comment').optional().isString()
], addFeedback);

router.get('/feedback/:userId', getFeedbackForUser);

module.exports = router; 