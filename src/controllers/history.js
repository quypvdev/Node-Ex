// const History = require("../models/History");
// const Book = require("../models/book");
// const User = require("../models/user");

// // Get all the history
// exports.history_get = async (req, res) => {
//    try {
//       const history = await History.find();
//       res.status(200).json({ success: true, count: history.length, history });
//    } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//    }
// };

// // Get a single history
// exports.history_details_get = async (req, res) => {
//    try {
//       const history = await History.find({ _id: req.params.id });
//       res.status(200).json({ success: true, history });
//    } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//    }
// };

// // Get a single history detailed
// exports.history_details_extended_get = async (req, res) => {
//    try {
//       const bookHistory = await History.findOne({ _id: req.params.id });
//       const book = await Book.findOne({ _id: bookHistory.book });
//       const history = {
//          _id: bookHistory._id,
//          user: bookHistory.user,
//          book: {
//             title: book.title,
//             description: book.description,
//             author: book.author,
//          },
//          returned: bookHistory.returned,
//       };
//       res.status(200).json({ success: true, history });
//    } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//    }
// };

// // Create a history
// exports.history_post = async (req, res, next) => {
//    //    await History.create({
//    //       book: req.body.book,
//    //       user: req.body.user,
//    //    })
//    //       .then((history) => {
//    //          if (history.returned === true) {
//    //             return res.status(200).json({ success: true, history });
//    //          }

//    //          return res.status(401).json({ success: false });
//    //       })
//    //       .catch((error) => {
//    //          return next(error);
//    //       });

//    try {
//       const book = await Book.findOne(req.params.id, req.body);
//       const status = book.returned;
//       const response = await History.create({
//          book: req.body.book,
//          user: req.body.user,
//          returned: "BORROWED",
//       });

//       if (status === "BORROWED")
//          return res
//             .status(401)
//             .json({ success: false, message: "Book has been BORROWED" });

//       return res.status(200).json({ success: true, response, changeStatus });
//    } catch (error) {
//       return next(error);
//    }
// };
// // Update a history
// exports.history_patch = async (req, res) => {
//    try {
//       const history = await History.findByIdAndUpdate(req.params.id, req.body, {
//          useFindAndModify: false,
//       });
//       res.status(200).json({ success: true, history });
//    } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//    }
// };

// //  Delete a history
// exports.history_delete = async (req, res) => {
//    try {
//       const history = await History.findOneAndDelete(req.params.id);
//       res.status(200).json({ success: true, history });
//    } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//    }
// };
