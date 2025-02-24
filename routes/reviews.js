const express = require('express');
const router = express.Router({mergeParams:true});
const Business = require('../models/businesses');
const Review = require('../models/reviews');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas');

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const business = await Business.findById(req.params.id);
    const review = new Review(req.body.review);
    business.reviews.push(review);
    await review.save();
    await business.save();
    res.redirect(`/businesses/${business._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Business.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/businesses/${id}`);
}))

module.exports = router;