const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const dbc = require('./config/mongoose.connection');
const ownersRouter = require('./routes/ownersRouter')
const usersRouter = require('./routes/usersRouter')
const indexRouter = require('./routes/index')
const productsRouter = require('./routes/productsRouter')
const flash = require('connect-flash');
const expressSession = require('express-session');

require('dotenv').config();

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
}))

app.use(flash())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// app.get('/', function (req, res) {
//     res.send('hello')
// })
app.use('/', indexRouter);
app.use('/owner', ownersRouter);
app.use('/product', productsRouter);
app.use('/user', usersRouter);

app.listen(3000);