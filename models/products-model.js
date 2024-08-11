const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image: Buffer,
    name: String,
    price: Number,
    bgcolor: String,
    panelcolor: String,
    textcolor: String,
    fakeprice: Number,
    productquantity: {
        type: Number,
        default: 1,
    },
    productstock: Number,
    availblestock: Number,
    discount: {
        type: Number,
        default: 0,
    }
})

module.exports = mongoose.model('product', productSchema)