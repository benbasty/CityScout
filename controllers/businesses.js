const Business = require('../models/businesses');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const businesses = await Business.find({});
    res.render('businesses/index', { businesses });
}

module.exports.renderNewForm = (req, res) => {
    res.render('businesses/new');
}

module.exports.createBusiness = async (req, res) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.business.city, { limit: 1 });
    console.log(geoData);
    const business = new Business(req.body.business);
    business.geometry = geoData.features[0].geometry;
    business.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    business.author = req.user._id;
    await business.save();
    console.log(business);
    req.flash('success', 'Successfully made a new business!');
    res.redirect(`/businesses/${business._id}`);
}

module.exports.showBusiness = async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id)
    .populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!business) {
        req.flash('error', 'Cannot find that business!');
        return res.redirect('/businesses')
    }
    res.render('businesses/show', { business });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id);
    if(!business) {
        req.flash('error', 'Cannot find that business!');
        return res.redirect('/businesses')
    }
    res.render('businesses/edit', { business });
}

module.exports.updateBusiness = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const business = await Business.findByIdAndUpdate(id, { ...req.body.business }, {new: true});
    const geoData = await maptilerClient.geocoding.forward(req.body.business.city, { limit: 1 });
    business.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    business.images.push(...imgs);
    await business.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await business.updateOne({$pull: {images: {filename: { $in: req.body.deleteImages}}}});
        console.log(business);
    }
    req.flash('success', 'Successfully made a new business!');
    res.redirect(`/businesses/${business._id}`);
}

module.exports.deleteBusiness = async (req, res) => {
    const { id } = req.params;
    await Business.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a business!');
    res.redirect('/businesses');
}