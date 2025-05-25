const express = require('express');
const router = express.Router();
const { signup, login ,getUserScore} = require('../controllers/UserController');
const  requireAuth  = require('../middleware/requireAuth');

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;