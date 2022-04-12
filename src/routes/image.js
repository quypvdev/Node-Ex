const router = require("express").Router();
const { get_images } = require("../controllers/image");

// Get all books
router.get("/image/listimage", get_images);
// Create book

module.exports = router;
