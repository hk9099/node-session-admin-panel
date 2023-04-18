const sliderData = require('../../model/adminModel/sliderModel');
const blogData = require('../../model/adminModel/blogModel');


module.exports.index = async (req, res) => {
    const sliderdata = await sliderData.find({ isActive: true });
    const blogdata = await blogData.find({ isActive: true });
    res.render('client/index', { 'sliderdata': sliderdata, 'blogdata': blogdata });
}

module.exports.blogsingle = async (req, res) => {
    try {
        const dataofblog = await blogData.findById(req.params.id);
        res.render('client/blogsingle', { 'recordofblog': dataofblog });
    } catch (err) {
        console.log(err);
    }
}

