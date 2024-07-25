const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.send("now it's working");
});

module.exports = router;
