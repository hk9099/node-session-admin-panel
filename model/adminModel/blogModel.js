const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const blogFilepath = '/media/blog';

// store image
const imagestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../', blogFilepath))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    },
});


const addBlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    catagory: { type: String, required: true },
    content: { type: String, required: true },
    about: { type: String, required: true },
    image: { type: Array, required: true },
    isActive: { type: Boolean, default: false }
});

// connect image in schema
addBlogSchema.statics.uploadedimage = multer({ storage: imagestorage }).array('image', 10);
addBlogSchema.statics.imagefile = blogFilepath;


const addBlog = mongoose.model('addBlog', addBlogSchema);

module.exports = addBlog;
