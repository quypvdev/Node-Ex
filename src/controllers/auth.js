const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.signup = (req, res) => {
   // console.log("req.body", req.body);
   const user = new User(req.body);
   user.save((err, user) => {
      if (err) {
         return res.status(400).json({
            // err: errorHandler(err),
            err: "Email is already exists",
         });
      }
      user.salt = undefined;
      user.hashed_password = undefined;
      res.json({
         user,
      });
   });
};
// exports.create_user = async (req, res) => {
//    await User.create(
//       {
//          name: req.body.name,
//          email: req.body.email,
//          password: req.body.password,
//       },
//       (err, user) => {
//          if (err)
//             return res
//                .status(500)
//                .json({ success: false, message: err.message });
//          res.status(200).json({ success: true, user });
//       }
//    );
// };
exports.signin = (req, res) => {
   // find the user based on email
   const { email, password } = req.body;
   User.findOne({ email }, (err, user) => {
      if (err || !user) {
         return res.status(401).json({
            error: "User with that email does not exist. Please signup",
         });
      }
      // if user is found make sure that email and password math
      // create authenticate method in user model
      if (!user.authenticate(password)) {
         return res.status(401).json({
            error: "Email and password dont match",
         });
      }
      // req.session.signin = true;
      // req.session.authUser = user;
      const newUser = {
         ...user._doc,
      };
      delete newUser.hashed_password;
      req.session.user = newUser;

      // console.log("cc", newUser);
      //generate a signed token with user id and secret
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      // console.log(token, "dddd");

      // persist the token as 't' in coolie with expiry date
      res.cookie("t", token, { expire: new Date() + 9999 });
      // return response with user and token t frontend client
      const { _id, name, email, role } = user;
      return res.json({ token, user: { _id, email, name, role } });
   });
};

exports.signout = (req, res) => {
   res.clearCookie("t");
   res.json({
      message: "Signout Success",
   });
};

// exports.requireSignin = expressJwt(
//    {
//       secret: process.env.JWT_SECRET,
//       algorithms: ["HS256"],
//       userProperty: "auth",
//    },
//    { message: "User is not logged in." }
// );

exports.requireSignin = (req, res, next) => {
   const tokenSignin = req.header("Authorization");
   if (!tokenSignin) {
      return res.status(403).json({
         error: "You are not allowed to do that. Please login...",
      });
   }
   // console.log(tokenSignin, "aaa");
   const token = req.cookies.t;
   // console.log(atoken, "adad");
   if (tokenSignin !== token)
      return res.status(403).json({ error: "Invalid token." });

   next();
};
exports.isAuth = (req, res, next) => {
   let user = req.profile && req.auth && req.profile._id == req.auth._id;
   if (!user) {
      return res.status(403).json({
         error: "Access denied",
      });
   }
   next();
};
exports.isUser = (req, res, next) => {
   try {
      let isUser = req.session.user._id == req.params.userId;
      if (!isUser) {
         return res.status(403).json({
            message: "unauthorize",
         });
      }
      return next();
   } catch (error) {
      return next(error);
   }
};
exports.islibRole = async (req, res, next) => {
   try {
      let isLib = req.user.role == "librarian";
      // console.log(isLib, "role");
      if (isLib) {
         return res.status(403).json({
            message: "The user is already a librarian",
         });
      }
      return next();
   } catch (error) {
      return next(error);
   }
};
exports.isAdmin = (req, res, next) => {
   try {
      const isUserRole = req.session.user.role;
      // console.log("isUserRole", isUserRole);

      if (isUserRole !== "librarian") {
         return res.status(403).json({
            message: "unauthorize_admin",
         });
      }
      return next();
   } catch (error) {
      return next(error);
   }
};
