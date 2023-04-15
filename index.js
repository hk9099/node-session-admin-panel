const express = require('express');
const app = express();
const port = 8083;
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const db = require('./config/mongoose');
const passport = require('passport');
const passportLocal = require('./config/passport');
const bodyParser = require('body-parser');
const bycrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const multer = require('multer');

// set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './static/client')));
app.use(express.static(path.join(__dirname, './static/admin')));
app.use(express.urlencoded({ extended: true }));
app.use('/media', express.static(path.join(__dirname, 'media')))
app.use('/media/slider', express.static(path.join(__dirname, 'media/slider')))

// session
app.use(session({
    name: 'data',
    secret: 'codeadmin',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10000 * 60 * 60
    }
}));


// passport
app.use(passport.initialize());
app.use(passport.session());

// bodyparser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// set routes
app.use(flash());

// routes
app.use('/', require('./routes/client/homerouter'));
// app.get('*', async (req, res) => {
//     res.status(404).render('404');
// })




//flash

//port listen
app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
});
