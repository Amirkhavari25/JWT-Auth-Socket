const path = require('path');

const express = require('express');
const { registerUser,loginUser } = require('../controllers/authController');
const router = express.Router();


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Client/login.html'));
});

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;