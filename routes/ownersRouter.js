const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const ownerLoggedIn = async function (req, res, next) {
    if (!req.cookies.owner) {
        req.flash('error', 'you need to login first');
        return res.redirect('/ownerLogin');
    }
    try {
        let decoded = jwt.verify(req.cookies.owner, process.env.JWT_KEY);
        let user = await ownerModel.findOne({ email: decoded.email }).select('-password');
        req.user = user;
        next();
    } catch (err) {
        req.flash('error', 'somthing went worng');
        res.redirect('/');
    }
}



router.get('/', function (req, res) {
    res.send("now it's working");
});

router.get('/admin', ownerLoggedIn, function (req, res) {
    let success = req.flash('success');
    res.render("createproducts", { success });
});



router.post('/create', async function (req, res) {
    let owners = await ownerModel.find();
    if (owners.length > 0) {
        return res.status(504).send('you do not have permission to create another owner');
    }
    else {
        let { fullname, email, password } = req.body;
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message)
                else {
                    let owners = await ownerModel.create({
                        fullname,
                        email,
                        password: hash,
                    })
                    let token = jwt.sign({ email, id: owners._id }, process.env.JWT_KEY);
                    res.cookie('owner', token);
                    res.send(owners);
                    // res.render('createproducts');
                }
            })
        })
    }
})

router.post('/login', async function (req, res) {
    let { email, password } = req.body;
    let owner = await ownerModel.findOne({ email })
    if (!owner) return res.send('You are not a admin_!')
    else {
        bcrypt.compare(password, owner.password, function (err, result) {
            if (!result) return res.send('somthing went worng i think you should leave')
            else {
                let token = jwt.sign({ email, id: owner._id }, process.env.JWT_KEY);
                res.cookie('owner', token);
                res.cookie('token', '');
                res.redirect('/owner/admin');
            }
        })
    }
})





// console.log(process.env.NODE_ENV);

module.exports = router;
