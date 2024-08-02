const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image: Buffer,
    name: String,
    price: Number,
    bgcolor: String,
    panelcolor: String,
    textcolor: String,
    discount: {
        type: Number,
        default: 0,
    }
})

module.exports = mongoose.model('product', productSchema)