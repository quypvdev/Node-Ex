const multer = require("multer");
const imgModel = require("../models/image");

// const Storage = multer.diskStorage({
//    destination: "uploads",
//    filename: (req, file, cb) => {
//       cb(null, file.originalname);
//    },
// });
// const upload = multer({
//    storage: Storage,
// }).single("testImage");
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "uploads");
   },
   filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now());
   },
});

const upload = multer({ storage: storage });
// Get all image
exports.get_images = async (req, res) => {
   //    imgModel.find({}, (err, items) => {
   //       if (err) {
   //          console.log(err);
   //       } else {
   //          res.json({ items: items });
   //       }
   //    });
   await imgModel
      .find()
      .then((images) => {
         res.status(200).json({ success: true, count: images.length, images });
      })
      .catch((err) => {
         res.status(500).json({ success: false, message: err.message });
      });
};
