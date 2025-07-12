const express = require('express');
const router = express.Router();
const { createSwap, getMySwaps, updateSwapStatus, deleteSwap } = require('../controllers/swapController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator');

router.post('/swaps', authMiddleware, [
  body('receiver_id').notEmpty().withMessage('Receiver ID is required.'),
  body('skill_offered').notEmpty().withMessage('Skill offered is required.'),
  body('skill_requested').notEmpty().withMessage('Skill requested is required.')
], createSwap);

router.get('/swaps/my', authMiddleware, getMySwaps);

router.put('/swaps/:id/status', authMiddleware, [
  body('status').isIn(['pending', 'accepted', 'rejected', 'cancelled']).withMessage('Invalid status.')
], updateSwapStatus);

router.delete('/swaps/:id', authMiddleware, deleteSwap);

module.exports = router; 