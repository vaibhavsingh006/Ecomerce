const mongoose = require('mongoose');
const config = require('config');
// const debug = require("debug")("development:mongoose");

mongoose.connect(`${config.get("MONGODB_URI")}/ecommerce`)
    // mongoose.connect(`mongodb://127.0.0.1:27017/ecommerce`)
    .then(function () {
        console.log("connect");
    })
    .catch(function (err) {
        console.log(err);
    })

// set debug=development:mongoose 
// set DEBUG=development:* 

module.exports = mongoose.connection;
