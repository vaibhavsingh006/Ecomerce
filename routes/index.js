const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');


router.get('/', function (req, res) {
    let error = req.flash('error');
    res.send('index', { error });
});

router.get('/shop', isLoggedIn, function (req, res) {
    res.send('shop');
})

module.exports = router;