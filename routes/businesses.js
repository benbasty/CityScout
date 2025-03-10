const express = require('express');
const router = express.Router();
const businesses = require('../controllers/businesses');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateBusiness } = require('../middleware');

router.get('/', catchAsync(businesses.index));

router.get('/new', isLoggedIn, businesses.renderNewForm);

router.post('/', isLoggedIn, validateBusiness, catchAsync(businesses.createBusiness));

router.get('/:id', catchAsync(businesses.showBusiness));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(businesses.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateBusiness, catchAsync(businesses.updateBusiness));

router.delete('/:id', isAuthor, catchAsync(businesses.deleteBusiness));

module.exports = router;
