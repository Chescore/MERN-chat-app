const express = require('express');
const router = express.Router();
const {catchErrors} = require('../middleware/errorHandler')
const auth = require('../middleware/auth');
const chatroom = require('../controllers/chatroom')


router.post('/',auth ,catchErrors(chatroom.createChatroom));
router.get('/',auth ,catchErrors(chatroom.getChatRooms));
router.get('/:id', auth , catchErrors(chatroom.getChatroomById))

module.exports = router;