const sliderData = require('../../model/adminModel/sliderModel');


module.exports.index = async (req, res) => {
    const sliderdata = await sliderData.find({ isActive: true });
    res.render('client/index', { 'sliderdata': sliderdata });
}
