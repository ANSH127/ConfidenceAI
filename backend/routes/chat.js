const express= require('express');
const router= express.Router();
const ChatController= require('../controllers/ChatController');
const  requireAuth  = require('../middleware/requireAuth');


router.use(requireAuth);
router.post('/create', ChatController.createChat);
router.get('/', ChatController.getChats);

module.exports= router;