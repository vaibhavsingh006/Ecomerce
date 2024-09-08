const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],
    orders: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
            },
            productquantity: Number,
            totalamount: Number,
            dateAdded: {
                type: Date,
                default: Date.now
            }
        }
    ],
    contact: Number,
    profilePicture: Buffer,
    address: String
});

module.exports = mongoose.model('user', userSchema);

// purchased: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'product'
// }],
// orders: {
//     type: Map,
//     of: Number,
//     default: {},
//     ref: 'product'
// it's show the data like :- productId, productquantity
// },