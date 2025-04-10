if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const businessRoutes = require('./routes/businesses');
const reviewRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/business');
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(mongoSanitize({ replaceWith: '_' })); //sanitizes user input to prevent NoSQL injection attacks
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.engine('ejs', ejsMate);

const sessionConfig = {
    secret: 'asecretlikenooneeverthoughtabout!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig)); //session middleware
app.use(flash()); //flash middleware

app.use(passport.initialize()); //passport middleware
app.use(passport.session()); //passport middleware
passport.use(new LocalStrategy(User.authenticate())); //passport middleware
passport.serializeUser(User.serializeUser()); //store user in session
passport.deserializeUser(User.deserializeUser()); //get user out of session

app.use((req, res, next) => {
    res.locals.currentUser = req.user; //so we can access currentUser in all templates
    res.locals.success = req.flash('success'); //so we can access success in all templates
    res.locals.error = req.flash('error'); //so we can access error in all templates
    next(); //next middleware
}
)

app.use('/', usersRoutes);
app.use('/businesses', businessRoutes);
app.use('/businesses/:id/reviews', reviewRoutes);


app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})