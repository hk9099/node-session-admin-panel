const express = require('express');
const signUpRouter = express.Router();
const signUpcontroller = require('../../controller/admin/signUpController');
const sliderController = require('../../controller/admin/sliderController');
const addData = require('../../model/adminModel/addDataModal');
const addSlider = require('../../model/adminModel/sliderModel');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const googleAuth = require('../../config/googleAuth');
const signUp = require('../../config/passport');

//get request
signUpRouter.get('/', signUpcontroller.signin);
signUpRouter.get('/sign-up', signUpcontroller.signupPage);
signUpRouter.get('/dashboard', passport.check, signUpcontroller.dashboard);
signUpRouter.get('/profile', passport.check, signUpcontroller.profile);
signUpRouter.get('/logout', signUpcontroller.logout);
signUpRouter.get('/tables', passport.check, signUpcontroller.tables);
signUpRouter.get('/delete/:id', signUpcontroller.deleteData);
signUpRouter.get('/edit/:id', passport.check, signUpcontroller.editData);
signUpRouter.get('/deleteimg', signUpcontroller.deleteImage);
signUpRouter.get('/verify/:token', signUpcontroller.verifyAccount);
signUpRouter.get('/slider', passport.check, sliderController.slider);
signUpRouter.get('/slider/:id/:action', passport.check, sliderController.updateSliderStatus);
signUpRouter.get('/deleteslider/:id', passport.check, sliderController.deleteSlider);



//google auth
signUpRouter.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));
signUpRouter.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        return res.redirect('/dashboard');
    });


//post request
signUpRouter.post('/signUp', [check('email', 'Email is not valid').isEmail().normalizeEmail(),
check('name', 'Name length should be 5 characters').isLength({ min: 5 }),
check('password', 'Password length should be 6 to 10 characters').isLength({ min: 6, max: 20 })
], signUpcontroller.signup);

signUpRouter.post('/signIndata', passport.authenticate('local', { failureRedirect: '/admin', successRedirect: '/admin/dashboard', failureFlash: true, successFlash: true }), signUpcontroller.signIndata);
signUpRouter.post('/change-password', [check('currentPassword', 'Current Password is required').not().isEmpty(), check('newPassword', 'New Password is required').not().isEmpty(), check('confirmPassword', 'Confirm Password is required').not().isEmpty()], signUpcontroller.changePassword);
signUpRouter.post('/add-data', addData.uploadedimage, signUpcontroller.addData);
signUpRouter.post('/update/:id', addData.uploadedimage, signUpcontroller.updateData);
signUpRouter.post('/sliderdata', addSlider.uploadedimage, sliderController.addsliderData);



module.exports = signUpRouter;
