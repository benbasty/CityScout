const Business = require('../models/businesses');

module.exports.index = async (req, res) => {
    const businesses = await Business.find({});
    res.render('businesses/index', { businesses });
}

module.exports.renderNewForm = (req, res) => {
    res.render('businesses/new');
}

module.exports.createBusiness = async (req, res) => {
    const business = new Business(req.body.business);
    business.author = req.user._id;
    await business.save();
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
    const business = await Business.findByIdAndUpdate(id, { ...req.body.business }, {new: true});
    req.flash('success', 'Successfully made a new business!');
    res.redirect(`/businesses/${business._id}`);
}

module.exports.deleteBusiness = async (req, res) => {
    const { id } = req.params;
    await Business.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a business!');
    res.redirect('/businesses');
}