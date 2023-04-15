const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sliderFilepath = '/media/slider';

// store image
const imagestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../', sliderFilepath))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    },
});


const addSliderSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: Array, required: true },
    content: { type: String, required: true },
    isActive: { type: Boolean, default: false } 
});

// connect image in schema
addSliderSchema.statics.uploadedimage = multer({ storage: imagestorage }).array('image', 10);
addSliderSchema.statics.imagefile = sliderFilepath;


const addSlider = mongoose.model('addSlider', addSliderSchema);

module.exports = addSlider;
