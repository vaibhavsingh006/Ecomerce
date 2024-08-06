const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const productsModel = require('../models/products-model');
const usersModel = require('../models/users-model');


router.get('/', function (req, res) {
    let error = req.flash('error');
    res.render('signUp', { error, title: 'Sign Up', loggedin: false });
});

router.get('/logout', function (req, res) {
    res.cookie('token', '');
    res.cookie('owner', '');
    res.redirect('/login');
});


router.get('/ownerLogin', function (req, res) {
    let error = req.flash('error');
    res.render('owner-login', { title: 'Owner LogIn', loggedin: false, error });
});

router.get('/ownerLogout', function (req, res) {
    res.cookie('token', '');
    res.cookie('owner', '');
    res.redirect('/login');
});


router.get('/login', function (req, res) {
    let error = req.flash('error');
    res.render('login', { title: 'Log In', loggedin: false, error });
})

// router.get('/createproduct', isLoggedIn, function (req, res) {
//     res.render('createproducts');
// })

router.get('/shop', isLoggedIn, async function (req, res) {
    let products = await productsModel.find();
    let success = req.flash('success');
    res.render('shop', { products, title: 'Shop', success });
})


router.get('/product/:id', isLoggedIn, async function (req, res) {
    let user = await usersModel.findOne({ email: req.user.email });
    user.cart.push(req.params.id);
    await user.save();
    req.flash('success', 'Add to cart_!😁');
    res.redirect('/shop');
})

router.get('/delete/:id', isLoggedIn, async function (req, res) {
    let updateUser = await usersModel.findOneAndUpdate({ email: req.user.email }, { $pull: { cart: req.params.id } }, { new: true })
    await updateUser.save();
    res.redirect('/cart')
})



router.get('/cart', isLoggedIn, async function (req, res) {
    let user = await usersModel.findOne({ email: req.user.email }).populate('cart')
    console.log(user)
    if (!user) {
        return res.send('you are admin')
    } else {
        res.render('cart', { title: 'Cart', user })
    }
})



module.exports = router;