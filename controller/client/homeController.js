const sliderData = require('../../model/adminModel/sliderModel');
const blogData = require('../../model/adminModel/blogModel');


module.exports.index = async (req, res) => {
    const sliderdata = await sliderData.find({ isActive: true });
    const blogdata = await blogData.find({ isActive: true });
    res.render('client/index', { 'sliderdata': sliderdata, 'blogdata': blogdata });
}

module.exports.showblog = async (req, res) => {
    const blogdata = await blogData.findById(req.params.id);
    res.render('client/blog_single', { 'blogdata': blogdata });
}