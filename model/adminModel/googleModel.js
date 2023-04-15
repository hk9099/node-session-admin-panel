const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const googleSchema = new mongoose.Schema({
    googleId: { type: String, required: true },
    name: { type: String, required: true },
    photo: { type: String, required: true },
});

const googleData = mongoose.model('googleData', googleSchema);

module.exports = googleData;
