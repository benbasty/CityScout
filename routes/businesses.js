const express = require('express');
const router = express.Router();
const businesses = require('../controllers/businesses');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateBusiness } = require('../middleware');

router.route('/')
    .get(catchAsync(businesses.index))
    .post(isLoggedIn, validateBusiness, catchAsync(businesses.createBusiness));

router.get('/new', isLoggedIn, businesses.renderNewForm);

router.route('/:id')
    .get(catchAsync(businesses.showBusiness))
    .put(isLoggedIn, isAuthor, validateBusiness, catchAsync(businesses.updateBusiness))
    .delete(isLoggedIn, isAuthor, catchAsync(businesses.deleteBusiness));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(businesses.renderEditForm));

module.exports = router;
