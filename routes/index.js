const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const productsModel = require('../models/products-model');
const usersModel = require('../models/users-model');
const upload = require('../config/multer-config');

const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

// ================================================

// router.get('/testing', function (req, res) {
//     let error = req.flash('error');
//     res.render('testing', { error, title: 'Testing', loggedin: false });
// })

// router.post('/send-email', async (req, res) => {
//     const senderEmail = 'EMAIL_ID'; // Your email address
//     const senderPassword = 'PASS_KEY'; // Your email password

//     const subject = req.body.subject;
//     const email = req.body.email;
//     const message = req.body.message;
//     // const messages = Send From {receiverEmail},{message};

//     // Create a transporter
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: senderEmail,
//             pass: senderPassword,
//         },
//     });

// Set up email data
//     const mailOptions = {
//         from: senderEmail,
//         to: 'prateekya23@gmail.com',
//         subject: subject,
//         text: messages,
//     };

//     try {
//         // Send the email
//         await transporter.sendMail(mailOptions);
//         res.render('index.html'); // Render your HTML template
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send('Error sending email');
//     }
// });

// ==========================================================

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
    let owner = req.cookies.owner;
    // console.log(req.cookies.productquantity)
    res.render('shop', { products, title: 'Shop', success, owner });
})


router.get('/product/:id', isLoggedIn, async function (req, res) {
    let user = await usersModel.findOne({ email: req.user.email });

    // console.log(user.cart)
    let findeProduc = user.cart.indexOf(req.params.id);
    if (findeProduc > -1) {
        req.flash('success', 'Already exites in cart_!😬');
        res.redirect('/shop');
    } else {
        user.cart.push(req.params.id);
        await user.save();
        req.flash('success', 'Add to cart_!😁');
        res.redirect('/shop');
    }
})

// ------------------ Buy Now button in cart
router.get('/done/:id', isLoggedIn, async function (req, res) {
    let product = await productsModel.findOne({ _id: req.params.id });

    try {
        let user = req.user;
        const { _id, productquantity, price } = product
        let productId = _id;
        // user.orders.set(product._id, product.productquantity);
        let amount = price * productquantity;
        let totalamount = amount;
        user.orders.push({ productId, productquantity, totalamount });
        await user.save();

        product.productquantity = 1;
        await product.save();
        let updateUser = await usersModel.findOneAndUpdate({ email: req.user.email }, { $pull: { cart: req.params.id } }, { new: true })
        await updateUser.save();

        // console.log(user);
        req.flash('success', 'Payment successfully_!😁');
        res.redirect('/cart')
    } catch (err) {
        console.log(err)
    }

})
// ---------------- Buy Now button in cart


// -------------- delete product by admin

router.get('/delete/:id', isLoggedIn, async function (req, res) {
    let productId = req.params.id;

    await productsModel.findByIdAndDelete(productId)

    res.redirect('/shop');
    // console.log(user.cart)

})



// --------------- edit product page

router.get('/editproduct/:id', async function (req, res) {
    let product = await productsModel.findOne({ _id: req.params.id });
    if (product) {
        let success = req.flash('success');
        res.render(`editproduct`, { success, title: 'update product', loggedin: false, product })
    } else {
        res.send('Somthing went worng')
    }
})

// ---------------- edit product

router.post('/editproduct', upload.single('image'), async function (req, res) {
    // let product = await productsModel.findOne({ _id: req.body.id });
    const { name, price, bgcolor, textcolor, panelcolor, discount, fakeprice, productquantity, productstock } = req.body
    let updatedData = {
        name,
        price,
        bgcolor,
        textcolor,
        panelcolor,
        discount,
        fakeprice,
        productquantity,
        productstock,
        availblestock: req.body.productstock - 1,
    }
    let id = req.body.id;
    let product = await productsModel.findByIdAndUpdate(id, updatedData, { new: true });
    res.redirect('/shop')
})

//  --------------  L

// ------- increas the quantity

router.get('/add/:id', async function (req, res) {
    let product = await productsModel.findOne({ _id: req.params.id });
    // console.log(product);
    try {
        if (product.availblestock > 1) {
            let newQuantity = product.productquantity + 1;
            let newStock = product.availblestock - 1;

            if (newQuantity >= product.productstock) {
                return res.send('stock full')
            }
            product.productquantity = newQuantity;
            product.availblestock = newStock;
            await product.save();
            res.redirect('/cart')
        } else {
            res.send('product stock not availble_!')
        }
    } catch (err) {
        res.send(err)
    }
})

// ------- dicrease the quantity
router.get('/remove/:id', async function (req, res) {
    let product = await productsModel.findOne({ _id: req.params.id });
    // console.log(product);
    try {

        let newQuantity = product.productquantity - 1;
        let newStock = product.availblestock + 1;
        if (1 > newQuantity) {
            return res.send('not do that')
        }
        product.productquantity = newQuantity;
        product.availblestock = newStock;
        await product.save();
        res.redirect('/cart')
    } catch (err) {
        res.send(err)
    }
})

// --------------- remove from cart only 
router.get('/deletecart/:id', isLoggedIn, async function (req, res) {
    let updateUser = await usersModel.findOneAndUpdate({ email: req.user.email }, { $pull: { cart: req.params.id } }, { new: true })
    await updateUser.save();
    res.redirect('/cart')
})



router.get('/cart', isLoggedIn, async function (req, res) {
    let user = await usersModel.findOne({ email: req.user.email }).populate('cart')
    if (!user) {
        return res.send('you are admin')
    } else {
        let success = req.flash('success');
        res.render('cart', { title: 'Cart', user, success })
    }
})

// ------------------ Profile Page route

router.get('/profile', isLoggedIn, async function (req, res) {
    let user = await usersModel.findOne({ email: req.user.email }).populate({
        path: "orders.productId",
        model: 'product'
    })
    // console.log(user.orders);

    res.render('profile', { user, loggedin: true });
})

// Profile Page route

// -------------------- update user information

router.post('/updateuser', upload.single('profilePicture'), async function (req, res) {
    // let product = await productsModel.findOne({ _id: req.body.id });
    const { fullname, email, contact, address } = req.body
    let updatedData = {
        fullname,
        email,
        contact,
        address,
    }

    if (req.file) {
        updatedData.profilePicture = req.file.buffer;
    }

    let id = req.body.id;
    let product = await usersModel.findByIdAndUpdate(id, updatedData, { new: true });
    res.redirect('/profile')
})

router.get('/updateuser/:id', async function (req, res) {
    let user = await usersModel.findOne({ _id: req.params.id });
    if (user) {
        let success = req.flash('success');
        res.render(`updateuser`, { success, title: 'update user', loggedin: false, user })
    } else {
        res.send('Somthing went worng')
    }
})

// update user information

module.exports = router;