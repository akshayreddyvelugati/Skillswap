const express = require('express');
const router = express.Router();
const { getAllUsers, banUnbanUser, getAllSwaps, sendAdminMessage, getLogs } = require('../controllers/adminController');
const { body, param } = require('express-validator');

router.get('/admin/users', getAllUsers);
router.put('/admin/users/:id/ban', [
  param('id').isNumeric().withMessage('User ID must be numeric.')
], banUnbanUser);
router.get('/admin/swaps', getAllSwaps);
router.post('/admin/message', [
  body('message').notEmpty().isString().withMessage('Message is required.')
], sendAdminMessage);
router.get('/admin/logs', getLogs);

module.exports = router; 