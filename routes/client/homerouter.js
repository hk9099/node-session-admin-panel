const express = require('express');
const homerouter = express.Router();
const homecontroller = require('../../controller/client/homeController');
const tesrUserController = require('../../controller/admin/testUserController');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');



homerouter.get('/', homecontroller.index);
homerouter.get('/client/blogsingle/:id', homecontroller.blogsingle);


homerouter.use('/admin', require('../admin/signupRouter'));
// homerouter.use('/users', require('../admin/testUserRouter'));


module.exports = homerouter;
