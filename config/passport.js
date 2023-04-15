const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const signUp = require('../model/adminModel/signupModel');
const bcrypt = require('bcrypt');
const flash = require('express-flash');

passport.use(new passportLocal({
    usernameField: 'email',
}, async (email, password, done) => {
    let user = await signUp.findOne({ email });
    if (!user) {
        return done(null, false, { message: 'User not found. Please check your email and try again.' });
    }

    if (!user.isVerified) {
        return done(null, false, { message: 'Please verify your email before signing in.' });
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            return done(null, false, { message: 'Error occurred while checking password. Please try again later.' });
        }
        if (result) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Invalid email or password. Please check your credentials and try again.' });
        }
    });
}));


passport.serializeUser((data, done) => {
    return done(null, data.id);
});

passport.deserializeUser(async (id, done) => {
    let userData = await signUp.findById(id);
    if (userData) {
        return done(null, userData);
    } else {
        return done(null, false);
    }
});

passport.check = (req, res, next) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be logged in to access this page.');
    res.redirect('/admin');
};

module.exports = passport;
