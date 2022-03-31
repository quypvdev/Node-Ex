const router = require("express").Router();
const {
   get_books,
   create_book,
   update_book,
   delete_book,
   get_book_extended,
   borrow_book,
   available_book,
} = require("../controllers/book");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

// Get all books
router.get("/listbook", get_books);

// router.get('/extended', controller.get_books_extended);

// Get book by id
// router.get('/:id', controller.get_book);

// Get a more detailed book
// router.get('/admin/extended/:id',get_book_extended);

// Create book
router.post("/admin/newbook", create_book);

// Update book
router.put("/admin/book/:id", requireSignin, isAdmin, update_book);
router.patch("/book/borrow/:id", requireSignin, borrow_book);
router.patch("/book/available/:id", requireSignin, available_book);

// Delete book
router.delete("/admin/book/delete/:id", requireSignin, isAdmin, delete_book);

module.exports = router;
