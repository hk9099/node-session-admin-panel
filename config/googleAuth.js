const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/adminModel/signupModel');

const GOOGLE_CLIENT_ID = '46227264388-1qnpc2n6abubft64kpbalcll06otlq1c.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8083/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            const user = await User.findOne({ googleId: profile.id });
            if (user) {
                done(null, user);
            }
            else {
                const newUser = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    photo: profile.photos[0].value,
                });
                await newUser.save();
                done(null, newUser);
            }
        } catch (error) {
            console.log(error);
        }
    }

));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

module.exports = passport;
