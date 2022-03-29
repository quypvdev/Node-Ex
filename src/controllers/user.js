const User = require('../models/user');
// const { Order } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
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

// exports.update = (req, res) => {
//     console.log('user update', req.body);
//     req.body.role = 0; // role will always be 0
//     User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }, (err, user) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'You are not authorized to perform this action'
//             });
//         }
//         user.hashed_password = undefined;
//         user.salt = undefined;
//         res.json(user);
//     });
// };

exports.update = (req, res) => {
    // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
    const { name, password } = req.body;

    User.findOne({ _id: req.profile._id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            });
        } else {
            user.name = name;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                user.password = password;
            }
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'User update failed'
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
                error: 'User not found'
            });
        }
        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            });
        } else {
            user.name = name;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                user.password = password;
            }
        }
        if (!role) {
            return res.status(400).json({
                error: 'Role is required'
            });
        } else {
            user.role = role;
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'User update failed'
                });
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        });
    });
};
// exports.addOrderToUserHistory = (req, res, next) => {
//     let history = [];

//     req.body.order.products.forEach(item => {
//         history.push({
//             _id: item._id,
//             name: item.name,
//             description: item.description,
//             category: item.category,
//             quantity: item.count,
//             transaction_id: req.body.order.transaction_id,
//             amount: req.body.order.amount,
//             status: req.body.order.status
//         });
//     });

//     User.findOneAndUpdate({ _id: req.profile._id }, { $push: { history: history } }, { new: true }, (error, data) => {
//         if (error) {
//             return res.status(400).json({
//                 error: 'Could not update user purchase history'
//             });
//         }
//         next();
//     });
// };

// exports.purchaseHistory = (req, res) => {
//     Order.find({ user: req.profile._id })
//         .populate('user', '_id name')
//         .sort('-created')
//         .exec((err, orders) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: errorHandler(err)
//                 });
//             }
//             res.json(orders);
//         });
// };
// exports.getStatusValues = (req, res) => {
//     res.json(Order.schema.path('status').enumValues);
// };
// exports.listUsers = (req, res) => {
//     User.find()
//         .populate('user', '_id name')
//         .sort('-created')
//         .exec((err, users) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: errorHandler(error)
//                 });
//             }
//             res.json(users);
//         });
// };
exports.listUsers = (req, res) => {
    User.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};
// exports.remove = (req, res, next) => {
//     // console.log('req.params._id', req.body._id)
//     User.findByIdAndRemove(req.params.userId, (error, data) => {
//         if (error) {
//           return next(error);
//         } else {
//             console.log('remove', data)
//           res.status(200).json({
//             msg: data,
//           });
//         }
//       });
//     };