const express = require('express');
const router = express.Router();
const Business = require('../models/businesses');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { businessSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware');

const validateBusiness = (req, res, next) => {
    const {error} = businessSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const businesses = await Business.find({});
    res.render('businesses/index', { businesses });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('businesses/new');
});

router.post('/', isLoggedIn, validateBusiness, catchAsync(async (req, res) => {
    const business = new Business(req.body.business);
    business.author = req.user._id;
    await business.save();
    req.flash('success', 'Successfully made a new business!');
    res.redirect(`/businesses/${business._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id).populate('reviews').populate('author');
    console.log(business);
    if(!business) {
        req.flash('error', 'Cannot find that business!');
        return res.redirect('/businesses')
    }
    res.render('businesses/show', { business });
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id);
    if(!business) {
        req.flash('error', 'Cannot find that business!');
        return res.redirect('/businesses')
    }
    if(!business.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/businesses/${id}`);
    }
    res.render('businesses/edit', { business });
}))

router.put('/:id', isLoggedIn, validateBusiness, catchAsync(async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById;
    if(!business.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/businesses/${id}`);
    }
    const bizness = await Business.findByIdAndUpdate(id, { ...req.body.business }, {new: true});
    req.flash('success', 'Successfully made a new business!');
    res.redirect(`/businesses/${business._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById;
    if(!business.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/businesses/${id}`);
    }
    await Business.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a business!');
    res.redirect('/businesses');
}))

module.exports = router;
