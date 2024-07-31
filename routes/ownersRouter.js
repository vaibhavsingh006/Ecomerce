const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');

router.get('/', function (req, res) {
    res.send("now it's working");
});

router.post('/create', async function (req, res) {
    let owners = await ownerModel.find();
    if (owners.length > 0) {
        return res.status(504).send('you do not have permission to create another owner');
    }
    let { fullname, email, password } = req.body;
    let createdowner = await ownerModel.create({
        fullname,
        email,
        password
    })
    res.send(createdowner);
})

// console.log(process.env.NODE_ENV);

module.exports = router;
