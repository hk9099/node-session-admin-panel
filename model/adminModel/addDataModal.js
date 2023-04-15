const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const filepath = '/media';

// store image
const imagestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../', filepath))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    },
});


const addDataSchema = new mongoose.Schema({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Email: { type: String, required: true },
    Date: { type: Date, default: Date.now },
    Phone: { type: Number, required: true },
    Address: { type: String, required: true },
    city: { type: String, required: true },
    gender: { type: String, required: true },
    hobbies: { type: Array, required: true },
    image: { type: Array, required: true },
    content: { type: String, required: true },
});

// connect image in schema
addDataSchema.statics.uploadedimage = multer({ storage: imagestorage }).array('image', 10);
addDataSchema.statics.imagefile = filepath;

const addData = mongoose.model('addData', addDataSchema);

module.exports = addData;
