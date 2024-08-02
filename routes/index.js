const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const productsModel = require('../models/products-model');


router.get('/', function (req, res) {
    let error = req.flash('error');
    res.render('signUp', { error });
});

router.get('/logout', function (req, res) {
    res.cookie('token', '');
    res.redirect('/login');
});


router.get('/ownerLogin', function (req, res) {
    res.render('owner-login');
});

router.get('/ownerLogout', function (req, res) {
    res.cookie('token', '');
    res.cookie('owner', '');
    res.redirect('/login');
});





router.get('/login', function (req, res) {
    res.render('login');
})

// router.get('/createproduct', isLoggedIn, function (req, res) {
//     res.render('createproducts');
// })

router.get('/shop', isLoggedIn, async function (req, res) {
    let products = await productsModel.find();
    res.render('shop', { products });
})

module.exports = router;