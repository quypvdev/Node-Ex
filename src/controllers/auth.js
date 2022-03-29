const User = require('../models/user')
const jwt = require('jsonwebtoken'); 
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { body } = require('express-validator/check');
const user = require('../models/user');

exports.signup = (req, res) => {
    // console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
if(err) {
    return res.status(400).json({
        err: errorHandler(err)
    });
}
user.salt = undefined
user.hashed_password = undefined
res.json({
    user
});
    });
};


exports.signin = (req, res) => {
    // find the user based on email
    const {email, password} = req.body
    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                error: "User with that email does not exist. Please signup"
            });
        }
// if user is found make sure that email and password math
// create authenticate method in user model
if(!user.authenticate(password)) {
    return res.status(401).json({
        error: "Email and password dont match"
    });
}
// req.session.signin = true;
// req.session.authUser = user;
    const newUser = {
        ...user._doc,
    }
    delete newUser.hashed_password;
    req.session.user = newUser;

console.log('cc',req.session.user);
//generate a signed token with user id and secret
const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
// persist the token as 't' in coolie with expiry date
res.cookie('t', token, {expire: new Date() + 9999})
// return response with user and token t frontend client               
const {_id, name, email, role} = user
return res.json({token, user: {_id, email, name, role}})
    });
};


exports.signout = (req, res) => {
    res.clearCookie('t')
    res.json({
        message: "Signout Success"
    });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: "auth"
});
exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if(!user) {
        return res.status(403).json({
            error: "Access denied"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    try {
        const isUserRole = req.session.user.role;
        // console.log('isUserRole', isUserRole)

        if(isUserRole !== 1) {
            return res.status(403).json({
                message: 'unauthorize_admin'
            });
        };
        return next();
    } catch (error) {
        return next(error)
    }
}
