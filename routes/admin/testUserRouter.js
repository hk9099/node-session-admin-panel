const express = require('express');
const testUser = express.Router();
const testUserController = require('../../controller/admin/testUserController');


testUser.get('/', testUserController.testUser);

testUser.post('/submit-form', testUserController.submitForm);
module.exports = testUser;