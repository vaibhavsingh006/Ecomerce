const express = require('express');
const router = express.Router();
const productModel = require('../models/products-model');
const upload = require('../config/multer-config');

router.get('/', function (req, res) {
    res.send('hey products')
});


router.post('/create', upload.single('image'), async function (req, res) {

    // res.send(req.file);
    try {
        let { name, price, bgcolor, textcolor, panelcolor, discount, fakeprice, productquantity, productstock } = req.body;

        let product = await productModel.create({
            image: req.file.buffer,
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
        })

        // let stock = productstock;
        // availblestock = stock;
        // await product.save();


        res.redirect('/owner/admin');
    }
    catch (err) {
        res.send(err.message);
    }

});




module.exports = router;