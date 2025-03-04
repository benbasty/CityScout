const express = require('express');
const router = express.Router({mergeParams:true});
const Business = require('../models/businesses');
const Review = require('../models/reviews');
const catchAsync = require('../utils/catchAsync');
const { validateReview } = require('../middleware');

router.post('/', validateReview, catchAsync(async (req, res) => {
    const business = await Business.findById(req.params.id);
    const review = new Review(req.body.review);
    business.reviews.push(review);
    await review.save();
    await business.save();
    req.flash('success', 'Successfully made a new review!');
    res.redirect(`/businesses/${business._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Business.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/businesses/${id}`);
}))

module.exports = router;