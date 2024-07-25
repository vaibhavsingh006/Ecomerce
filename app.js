const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const dbc = require('./config/mongoose.connection');
const ownerModel = require('./models/owner-model');
const ownersRouter = require('./routes/ownersRouter')
const usersRouter = require('./routes/usersRouter')
const productsRouter = require('./routes/productsRouter')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// app.get('/', function (req, res) {
//     res.send('hello')
// })

app.use('/owner', ownersRouter);
app.use('/product', productsRouter);
app.use('/user', usersRouter);

app.listen(3000);