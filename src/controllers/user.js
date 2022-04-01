const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const user = require("../models/user");

exports.userById = (req, res, next, id) => {
   User.findById(id).exec((err, user) => {
      if (err || !user) {
         return res.status(400).json({
            error: "User not found",
         });
      }
      req.profile = user;
      next();
   });
};

exports.read = (req, res) => {
   req.profile.hashed_password = undefined;
   req.profile.salt = undefined;
   return res.json(req.profile);
};

exports.update = (req, res) => {
   // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
   const { name, password } = req.body;

   User.findOne({ _id: req.profile._id }, (err, user) => {
      if (err || !user) {
         return res.status(400).json({
            error: "User not found",
         });
      }
      if (!name) {
         return res.status(400).json({
            error: "Name is required",
         });
      } else {
         user.name = name;
      }

      if (password) {
         if (password.length < 6) {
            return res.status(400).json({
               error: "Password should be min 6 characters long",
            });
         } else {
            user.password = password;
         }
      }

      user.save((err, updatedUser) => {
         if (err) {
            console.log("USER UPDATE ERROR", err);
            return res.status(400).json({
               error: "User update failed",
            });
         }
         updatedUser.hashed_password = undefined;
         updatedUser.salt = undefined;
         res.json(updatedUser);
      });
   });
};
exports.updaterole = (req, res) => {
   // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
   const { name, password, role } = req.body;

   User.findOne({ _id: req.profile._id }, (err, user) => {
      if (err || !user) {
         return res.status(400).json({
            error: "User not found",
         });
      }
      if (!name) {
         return res.status(400).json({
            error: "Name is required",
         });
      } else {
         user.name = name;
      }

      if (password) {
         if (password.length < 6) {
            return res.status(400).json({
               error: "Password should be min 6 characters long",
            });
         } else {
            user.password = password;
         }
      }
      if (!role) {
         return res.status(400).json({
            error: "Role is required",
         });
      } else {
         user.role = role;
      }

      user.save((err, updatedUser) => {
         if (err) {
            console.log("USER UPDATE ERROR", err);
            return res.status(400).json({
               error: "User update failed",
            });
         }
         updatedUser.hashed_password = undefined;
         res.json(updatedUser);
      });
   });
};
exports.setlibRole = async (req, res) => {
   const role = "librarian";
   User.findOne({ _id: req.profile._id }, (err, user) => {
      if (err || !user) {
         return res.status(400).json({
            error: "User not found",
         });
      }

      if (role === user.role) {
         return res.status(400).json({
            error: "The user is already a librarian",
         });
      } else {
         user.role = role;
      }

      user.save((err, updatedUser) => {
         if (err) {
            console.log("USER UPDATE ERROR", err);
            return res.status(400).json({
               error: "User update failed",
            });
         }
         updatedUser.hashed_password = undefined;
         res.json(updatedUser);
      });
   });
};
exports.setmemberRole = async (req, res) => {
   const role = "member";
   User.findOne({ _id: req.profile._id }, (err, user) => {
      if (err || !user) {
         return res.status(400).json({
            error: "User not found",
         });
      }

      if (role === user.role) {
         return res.status(400).json({
            error: "The user is already a member",
         });
      } else {
         user.role = role;
      }

      user.save((err, updatedUser) => {
         if (err) {
            console.log("USER ROLE UPDATE ERROR", err);
            return res.status(400).json({
               error: "User role update failed",
            });
         }
         updatedUser.hashed_password = undefined;
         res.json(updatedUser);
      });
   });
};

exports.listUsers = (req, res) => {
   User.find().exec((err, data) => {
      if (err) {
         return res.status(400).json({
            error: errorHandler(err),
         });
      }
      res.json(data);
   });
};
exports.remove = (req, res, next) => {
   // console.log('req.params._id', req.body._id)
   User.findByIdAndRemove(req.params.userId, (error, data) => {
      if (error) {
         return next(error);
      } else {
         //  console.log("remove", data);
         res.status(200).json({
            messenger: "Delete successfully",
            msg: data,
         });
      }
   });
};
