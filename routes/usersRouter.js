const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controlers/authControler')

router.get('/', function (req, res) {
    res.send('hey users')
});


router.post('/register', registerUser)

router.post('/login', loginUser);

module.exports = router;