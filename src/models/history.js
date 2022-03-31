const mongoose = require("mongoose");
const historySchema = mongoose.Schema({
   book: {
      type: mongoose.Schema.Types.ObjectId, // Book id
      required: true,
   },
   user: {
      type: mongoose.Schema.Types.ObjectId, // User id
      required: true,
   },
   status: {
      type: mongoose.Schema.Types.ObjectId,
      // default: false
   },
   // date: {
   //     from: {
   //         type: Date,
   //         default: Date.now
   //     },
   //     to: {
   //         type: Date,
   //         required: true
   //     }
   // }
});
module.exports = mongoose.model("History", historySchema, "history");
