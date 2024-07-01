const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:receiverId', verifyToken, getMessages);
router.post('/:receiverId', verifyToken, sendMessage);

module.exports = router;
