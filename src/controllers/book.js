const Book = require("../models/book");
// const History = require('../models/history');

// Get all books
exports.get_books = async (req, res) => {
   await Book.find()
      .then((books) => {
         res.status(200).json({ success: true, count: books.length, books });
      })
      .catch((err) => {
         res.status(500).json({ success: false, message: err.message });
      });
};
// Get book by id
exports.get_book = async (req, res) => {
   await Book.findOne({ _id: req.params.id })
      .then((book) => {
         res.status(200).json({ success: true, book });
      })
      .catch((err) => {
         res.status(500).json({ success: false, message: err.message });
      });
};
// Create book
exports.create_book = async (req, res) => {
   await Book.create(
      {
         title: req.body.title,
         description: req.body.description,
         author: req.body.author,
      },
      (err, book) => {
         if (err)
            return res
               .status(500)
               .json({ success: false, message: err.message });
         res.status(200).json({ success: true, book });
      }
   );
};

// Update book
exports.update_book = async (req, res) => {
   await Book.findByIdAndUpdate(req.params.id, req.body, {
      useFindAndModify: false,
   })
      .then((book) => {
         res.status(200).json({
            success: true,
            message: "Book has been updated",
            book,
         });
      })
      .catch((err) => {
         res.status(500).json({ success: false, message: err.message });
      });
};

// Delete book
exports.delete_book = async (req, res) => {
   await Book.findByIdAndDelete(req.params.id)
      .then((book) => {
         res.status(200).json({
            success: true,
            message: "Book has been deleted",
         });
      })
      .catch((err) => {
         res.status(500).json({ success: false, message: err.message });
      });
};
// Borrow book

exports.borrow_book = async (req, res) => {
   //    await Book.findByIdAndUpdate(req.params.id, {
   //       status: "BORROWED",
   //    })
   //       .then((book) => {
   //          res.status(200).json({
   //             success: true,
   //             message: "Status book has been change BORROWED",
   //          });
   //       })
   //       .catch((err) => {
   //          res.status(500).json({ success: false, message: err.message });
   //       });
   // };
   const status = "BORROWED";
   Book.findOne({ _id: req.params.id }, (err, book) => {
      if (err || !book) {
         return res.status(400).json({
            error: "Book not found",
         });
      }

      if (status === book.status) {
         return res.status(400).json({
            error: "The book is already BORROWED",
         });
      } else {
         book.status = status;
      }

      book.save((err, updatedBook) => {
         if (err) {
            console.log("BOOK UPDATE ERROR", err);
            return res.status(400).json({
               error: "Book update failed",
            });
         }
         res.json(updatedBook);
      });
   });
};
// Returned book

exports.return_book = async (req, res) => {
   // await Book.findByIdAndUpdate(req.params.id, {
   //    status: "RETURNED",
   // })

   //    .then((book) => {
   //       res.status(200).json({
   //          success: true,
   //          message: "Status book has been change RETURNED",
   //       });
   //    })
   //    .catch((err) => {
   //       res.status(500).json({ success: false, message: err.message });
   //    });
   const status = "RETURNED";
   Book.findOne({ _id: req.params.id }, (err, book) => {
      if (err || !book) {
         return res.status(400).json({
            error: "Book not found",
         });
      }

      if (status === book.status) {
         return res.status(400).json({
            error: "The book is already RETURNED",
         });
      } else {
         book.status = status;
      }

      book.save((err, updatedBook) => {
         if (err) {
            console.log("BOOK UPDATE ERROR", err);
            return res.status(400).json({
               error: "Book update failed",
            });
         }
         res.json(updatedBook);
      });
   });
};
