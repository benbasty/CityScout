const express = require('express');
const router = express.Router();
const Business = require('../models/businesses');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { businessSchema } = require('../schemas');

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

router.get('/new', (req, res) => {
    res.render('businesses/new');
});

router.post('/', validateBusiness, catchAsync(async (req, res) => {
    const business = new Business(req.body.business);
    await business.save();
    req.flash('success', 'Successfully made a new business!');
    res.redirect(`/businesses/${business._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id).populate('reviews');
    console.log(business);
    if(!business) {
        req.flash('error', 'Cannot find that business!');
        return res.redirect('/businesses')
    }
    res.render('businesses/show', { business });
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id);
    if(!business) {
        req.flash('error', 'Cannot find that business!');
        return res.redirect('/businesses')
    }
    res.render('businesses/edit', { business });
}))

router.put('/:id', validateBusiness, catchAsync(async (req, res) => {
    const { id } = req.params;
    const business = await Business.findByIdAndUpdate(id, { ...req.body.business }, {new: true});
    req.flash('success', 'Successfully made a new business!');
    res.redirect(`/businesses/${business._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Business.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a business!');
    res.redirect('/businesses');
}))

module.exports = router;
