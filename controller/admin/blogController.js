const addblog = require('../../model/adminModel/blogModel');
const path = require('path');
const fs = require('fs');

module.exports.blogPage = async (req, res) => {
    const blog = await addblog.find();
    res.render('admin_views/blog', { blog: blog });
}

module.exports.addblog = async (req, res) => {
    var imgpaths = [];
    if (req.files) {
        imgpaths = req.files.map(file => addblog.imagefile + '/' + file.filename);
        req.body.image = imgpaths;
    }

    req.body.isActive = req.body.isActive === 'on';

    const addblogdata = await addblog.create(req.body);
    if (addblogdata) {
        req.flash('success', 'Data added successfully');
        return res.redirect('/admin/blog');
    } else {
        req.flash('error', 'Data not added');
        return res.redirect('/admin/blog');
    }
}

module.exports.updateBlogStatus = async (req, res) => {
    const itemId = req.params.id;
    const action = req.params.action;

    try {
        const blog = await addblog.findById(itemId);

        if (!blog) {
            req.flash('error', 'blog not found');
            return res.redirect('/admin/blog');
        }

        blog.isActive = (action === 'true') ? true : false;
        await blog.save();

        req.flash('success', 'blog status updated successfully');
        console.log('blog status updated successfully');
        return res.redirect('/admin/blog');
    } catch (err) {
        req.flash('error', 'Failed to update blog status');
        return res.redirect('/admin/blog');
    }
};


module.exports.deleteblog = async (req, res) => {
    try {
        const blog = await addblog.findByIdAndDelete(req.params.id);
        console.log(blog);
        if (blog) {
            req.flash('success', 'blog deleted successfully');
            return res.redirect('/admin/blog');
        } else {
            req.flash('error', 'blog not deleted');
            return res.redirect('/admin/blog');
        }
    } catch (err) {
        req.flash('error', 'Failed to delete blog');
        return res.redirect('/admin/blog');
    }
};
