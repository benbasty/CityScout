const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin) //render login form
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login); //passport.authenticate logs the user in and clears req.session, //login user

router.get('/logout', users.logout);

module.exports = router; //export router