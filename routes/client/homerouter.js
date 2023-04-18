const express = require('express');
const homerouter = express.Router();
const homecontroller = require('../../controller/client/homeController');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');



homerouter.get('/', homecontroller.index);
homerouter.get('/client/blogsingle/:id', homecontroller.blogsingle);


homerouter.use('/admin', require('../admin/signupRouter'));



module.exports = homerouter;
