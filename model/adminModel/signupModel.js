const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SignUpSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: true },
    isVerified: { type: Boolean, required: true, default: false }
});

const signUp = mongoose.model('signUp', SignUpSchema);

module.exports = signUp;
