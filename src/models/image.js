// const mongoose = require("mongoose");
// const imageSchema = mongoose.Schema({
//    img: String,
// });
// module.exports = ImageModel = mongoose.model("Image", imageSchema);

// // jk roling
// // firstname: jk
// // lastname: roling
const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
   img: String,
});

module.exports = new mongoose.model("Image", imageSchema);
