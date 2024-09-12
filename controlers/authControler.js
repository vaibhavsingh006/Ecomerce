const bcrypt = require('bcrypt');
const userModel = require('../models/users-model');
const jwt = require('jsonwebtoken');

module.exports.registerUser = async function (req, res) {
    try {
        let { fullname, email, password } = req.body;
        let user = await userModel.findOne({ email: email });
        // if (user) res.status(401).send('You already have a account please login_!')
        if (user) {
            req.flash('error', 'You already have a account 😬 please login_!')
            res.redirect('/')
        }
        else {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    if (err) {
                        console.log('error hai password me ')
                        req.flash('error', `${err.message}😬_!`)
                        res.redirect('/')
                    }
                    else {
                        let user = await userModel.create({
                            email,
                            password: hash,
                            fullname
                        })
                        // res.send(user)
                        let token = jwt.sign({ email, id: user._id }, process.env.JWT_KEY);
                        res.cookie('token', token);
                        res.cookie('owner', '');
                        res.redirect('/shop');
                    }
                })
            })
        }
    }
    catch (err) {
        res.send(err.send);
    }
}


module.exports.loginUser = async function (req, res) {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (!user) {

        req.flash('error', 'Email not found 😬 please register first_!')
        res.redirect('/login');
    }
    else {
        bcrypt.compare(password, user.password, (err, result) => {
            if (!result) {

                req.flash('error', ' 😬 password not match buddy_!')
                res.redirect('/login');
            }
            else {
                let token = jwt.sign({ email, id: user._id }, process.env.JWT_KEY);
                res.cookie('token', token);
                res.cookie('owner', '');
                res.redirect('/shop');
            }
        })
    }
}
