const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            // Capitalize the first letter of the username
            const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1);
            req.flash('success', `Welcome to CityScout, ${formattedUsername}!`);
            res.redirect('/businesses');
        });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req,res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/businesses'; //redirect to the page they were on before or to the businesses page
    res.redirect(redirectUrl); //redirect the link to the redirectUrl
}

module.exports.logout = (req,res) => {
    req.logout(function (err) { // logout() is a function given by passport
        if (err) { // handle errors
            return next(err); // will generate a 500 error
        }
        req.flash('success', 'Goodbye!'); // flash a success message
        res.redirect('/businesses'); // redirect to the home page
    });
}

