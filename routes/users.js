const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.get('/register', users.renderRegister);

router.post('/register', catchAsync(users.register));

router.get('/login', users.renderLogin);

router.post('/login',
    storeReturnTo, //passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    users.login
)

router.get('/logout', users.logout);

module.exports = router; //export router