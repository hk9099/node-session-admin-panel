const signUp = require('../../model/adminModel/signupModel');
const addData = require('../../model/adminModel/addDataModal');
const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const multer = require('multer');
const nodemailer = require('nodemailer');

// Create a transporter using the SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hk.bitcoding@gmail.com', // Your Gmail email address
        pass: 'cbwgyagcyfxucseh' // Your Gmail password
    }
});

const sendVerificationEmail = async (email, token) => {
    try {
        const mailOptions = {
            from: 'hk.bitcoding@gmail.com',
            to: email,
            subject: 'Account Verification',
            html: `
                <p>Hi there,</p>
                <p>Please click on the following link to verify your account:</p>
                <a href="http://localhost:8083/verify/${token}">Verify Account</a>
            `
        };

        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error('Failed to send verification email:', error);
    }
};


module.exports.signin = async (req, res) => {
    // console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return res.redirect('admin/dashboard');
    } else {
        return res.render('admin_views/sign-in');
    }
}

module.exports.signupPage = async (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('admin/dashboard');
    } else {
        const signupSuccess = req.query.signup === 'success';
        const errors = req.query.errors === 'true';
        return res.render('admin_views/sign-up', { signupSuccess, errors });
    }
}

module.exports.dashboard = async (req, res) => {
    return res.render('admin_views/dashboard');
}

module.exports.profile = async (req, res) => {
    return res.render('admin_views/profile', { errors: req.query.errors });
}

// Generate verification token
function generateVerificationToken() {
    return Math.floor(100000 + Math.random() * 900000);
}

module.exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Handle validation errors
            return res.render('admin_views/sign-up', { errors: errors.array() });
        }

        const existingUser = await signUp.findOne({ email });

        if (existingUser) {
            // User with same email already exists
            return res.render('admin_views/sign-up', { errors: [{ msg: 'Email already registered' }] });
        }

        // Generate verification token
        const token = generateVerificationToken();

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new signUp({ name, email, password: hashedPassword, token });

        // Save user to database
        await newUser.save();

        // Send verification email
        await sendVerificationEmail(email, token);

        // Redirect to signup success page
        return res.redirect('./sign-up?signup=success');
    } catch (error) {
        console.error('Failed to signup:', error);
        return res.render('admin_views/sign-up', { errors: [{ msg: 'Failed to signup' }] });
    }
};




module.exports.verifyAccount = async (req, res) => {
    const token = req.params.token;

    try {
        // Find the user in the database based on the token
        const user = await signUp.findOne({ token });

        if (user) {
            // Update the user's verification status to true
            user.isVerified = true;
            await user.save();

            // Redirect to a success page or show a success message
            return res.render('admin_views/sign-in', { signupSuccess: true, isVerified: true, errors: [{ msg: 'Account verified successfully' }] });
        } else {
            // Redirect to an error page or show an error message
            return res.render('admin_views/sign-up', { signupSuccess: false, errors: [{ msg: 'Verification failed' }] });
        }
    } catch (error) {
        // Handle any errors that may occur
        console.error(error);
        return res.render('verification-error');
    }
};


module.exports.signIndata = async (req, res) => {
    const { email, password } = req.body;

    // Retrieve the user from the database based on the entered email
    const user = await signUp.findOne({ email });

    if (!user) {
        // User not found in the database
        return res.render('admin_views/sign-in', { error: 'Invalid email or password' });
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
        return res.render('admin_views/sign-in', { error: 'Please verify your email' });
    }

    // Compare the entered password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        // Passwords match, sign in the user and redirect to the dashboard
        req.session.authenticated = true;
        // Add user data to session
        req.session.userId = user._id;
        req.session.email = user.email;
        // ... add more user data to session as needed
        return res.redirect('admin/dashboard');
    } else {
        // Passwords do not match, show an error message
        return res.render('admin_views/sign-in', { error: 'Invalid email or password' });
    }
}






module.exports.changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(userId);

        const { currentPassword, newPassword, confirmPassword } = req.body;

        const errors = validationResult(req);
        // console.log(errors);
        if (!errors.isEmpty()) {
            // console.log(errors.array());
            return res.render('admin_views/dashboard', { errors: errors.array() });
        }

        const user = await signUp.findById(userId);
        // console.log(user);
        if (!user) {
            // console.log('User not found');
            return res.redirect('admin/dashboard');
        }
        // console.log(currentPassword, user.password);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            // console.log('Incorrect current password');
            return res.render('admin_views/dashboard', { error: 'Incorrect current password' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await signUp.findByIdAndUpdate(userId, { password: hashedNewPassword });

        // Destroy session data and log out user
        req.session.destroy(function (err) {
            if (err) {
                // console.log('Failed to destroy session data', err);
            }
        });

        return res.redirect('/admin');
    } catch (error) {
        console.log(error);
        return res.redirect('admin/dashboard');
    }
};

module.exports.logout = async (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            // console.log('Failed to destroy session data', err);
        }
    });
    return res.redirect('/admin');
}

module.exports.tables = async (req, res) => {
    const data = await addData.find({});
    const successMessage = req.flash('success');
    const errorMessage = req.flash('error');

    if (successMessage && successMessage.length > 0) {
        setTimeout(function () {
            req.flash('success', '');
            res.render('admin_views/tables', { "data": data, "success": null, "error": errorMessage });
        }, 5000);
    }

    if (errorMessage && errorMessage.length > 0) {
        setTimeout(function () {
            req.flash('error', '');
            res.render('admin_views/tables', { "data": data, "success": successMessage, "error": null });
        }, 5000);
    }

    res.render('admin_views/tables', { "editdata": '', "data": data, "success": successMessage, "error": errorMessage });
};


module.exports.addData = async (req, res) => {
    var imgpaths = [];
    if (req.files) {
        imgpaths = req.files.map(file => addData.imagefile + '/' + file.filename);
        req.body.image = imgpaths;
    }

    const adddata = await addData.create(req.body);
    if (adddata) {
        req.flash('success', 'Data added successfully');
        return res.redirect('admin/tables');
    } else {
        req.flash('error', 'Data not added');
        return res.redirect('admin/dashboard');
    }
}


module.exports.deleteData = async (req, res) => {
    try {
        const data = await addData.findByIdAndDelete(req.params.id);
        console.log(data);
        if (data) {
            req.flash('success', 'Data deleted successfully');
            return res.redirect('/admin/tables');
        } else {
            req.flash('error', 'Data not deleted');
            return res.redirect('/admin/tables');
        }
    } catch (err) {
        req.flash('error', 'Failed to delete Data');
        return res.redirect('/admin/tables');
    }
};


module.exports.editData = async (req, res) => {
    const editdata = await addData.findById(req.params.id);
    console.log(editdata);
    if (editdata) {
        const data = await addData.find({});
        const successMessage = req.flash('success');
        const errorMessage = req.flash('error');

        if (successMessage && successMessage.length > 0) {
            setTimeout(function () {
                req.flash('success', '');
                res.render('admin_views/tables', { "data": data, "success": null, "error": errorMessage });
            }, 5000);
        }

        if (errorMessage && errorMessage.length > 0) {
            setTimeout(function () {
                req.flash('error', '');
                res.render('admin_views/tables', { "data": data, "success": successMessage, "error": null });
            }, 5000);
        }
        res.render('admin_views/tables', { "editdata": editdata, "data": data, "success": successMessage, "error": errorMessage });
    } else {
        req.flash('error', 'Data not found');
        return res.redirect('admin/tables');
    }
};


module.exports.updateData = async (req, res) => {
    const data = await addData.findById(req.params.id);
    if (data) {
        data.FirstName = req.body.FirstName;

        var imgpaths = [];
        if (req.files) {
            imgpaths = req.files.map(file => addData.imagefile + '/' + file.filename);
        }
        data.image = imgpaths;

        await data.save();

        req.flash('success', 'Data updated successfully');
        return res.redirect('admin/tables');
    } else {
        req.flash('error', 'Data not found');
        return res.redirect('admin/tables');
    }
}


module.exports.deleteImage = async (req, res) => {
    try {
        const img = req.query.img;
        console.log(img);
        fs.unlinkSync(path.join(__dirname, '..', img));

        const id = req.params.id;
        const editdata = await addData.findById(id);
        if (editdata) {
            const index = editdata.image.indexOf(img);
            if (index !== -1) {
                editdata.image.splice(index, 1);
                await editdata.save();
            }
        }
        return res.redirect('admin/tables');
    } catch (error) {
        console.log(error);
        // return res.status(500).send('Internal Server Error');
    }
};

