const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],
    orders: {
        type: Map,
        of: Number,
        default: {},
        ref: 'product'
    },
    contact: Number,
    picture: String
})

module.exports = mongoose.model('user', userSchema)
