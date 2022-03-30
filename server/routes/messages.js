const express = require('express');
const router = express.Router();
const {catchErrors} = require('../middleware/errorHandler')
const messages = require('../controllers/messages');
const auth = require('../middleware/auth');

router.get('/messages/:id', auth ,catchErrors(messages.getMessages));

module.exports = router;