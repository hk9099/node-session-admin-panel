const addSlider = require('../../model/adminModel/sliderModel');
const path = require('path');
const fs = require('fs');

module.exports.addsliderData = async (req, res) => {
    var imgpaths = [];
    if (req.files) {
        imgpaths = req.files.map(file => addSlider.imagefile + '/' + file.filename);
        req.body.image = imgpaths;
    }

    req.body.isActive = req.body.isActive === 'on';

    const adddata = await addSlider.create(req.body);
    if (adddata) {
        req.flash('success', 'Data added successfully');
        return res.redirect('/admin/slider');
    } else {
        req.flash('error', 'Data not added');
        return res.redirect('/admin/slider');
    }
}


module.exports.slider = async (req, res) => {
    const slider = await addSlider.find({});
    res.render('admin_views/slider', { slider: slider });
}

// Update isActive field based on action (active/inactive)
module.exports.updateSliderStatus = async (req, res) => {
    const itemId = req.params.id;
    const action = req.params.action;

    try {
        const slider = await addSlider.findById(itemId);

        if (!slider) {
            req.flash('error', 'Slider not found');
            return res.redirect('/admin/slider');
        }

        slider.isActive = (action === 'true') ? true : false;
        await slider.save();

        req.flash('success', 'Slider status updated successfully');
        console.log('Slider status updated successfully');
        return res.redirect('/admin/slider');
    } catch (err) {
        req.flash('error', 'Failed to update slider status');
        return res.redirect('/admin/slider');
    }
};


module.exports.deleteSlider = async (req, res) => {
    try {
        const slider = await addSlider.findByIdAndDelete(req.params.id);
        console.log(slider);
        if (slider) {
            req.flash('success', 'Slider deleted successfully');
            return res.redirect('/admin/slider'); 
        } else {
            req.flash('error', 'Slider not deleted');
            return res.redirect('/admin/slider'); 
        }
    } catch (err) {
        req.flash('error', 'Failed to delete slider');
        return res.redirect('/admin/slider'); 
    }
};





