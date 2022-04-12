const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
const session = require("express-session");
require("dotenv").config();
const crypto = require("crypto");
const uuidv1 = require("uuidv1");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

// import routes
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");
const bookRoutes = require("./src/routes/book");
const imageRoutes = require("./src/routes/image");
const imgModel = require("./src/models/image");

// app
const app = express();

app.set("trust proxy", 1); // trust first proxy
app.use(
   session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
   })
);
app.use(function (req, res, next) {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Credentials", "true");
   res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,OPTIONS,POST,PUT,DELETE"
   );
   res.setHeader(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization"
   );
   next();
});

//cloudinary config
cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.API_KEY,
   api_secret: process.env.API_SECRET,
});
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "uploads");
   },
   filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now());
   },
});

const upload = multer({ storage: storage });
app.post("/api/image/uploadimage", upload.single("image"), (req, res, next) => {
   const data = {
      image: req.file.path,
   };
   cloudinary.uploader
      .upload(data.image)
      .then((result) => {
         const image = new imgModel({
            img: result.url,
         });
         const response = image.save();
         res.status(200).send({
            message: "success",
            result,
         });
      })
      .catch((error) => {
         res.status(500).send({
            message: "failure",
            error,
         });
      });
});
// db
mongoose
   .connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@crudapp.s69oc.mongodb.net/Rentbook?retryWrites=true&w=majority`,
      {
         useNewUrlParser: true,
         // useCreateIndex: true,
         useUnifiedTopology: true,
         //    useFindAndModify: false,
         dbName: "Rentbook",
      }
   )
   // .then(() =>
   // // console.log("DB Connected")
   // )
   .catch((err) => {
      console.log(`db error ${err.message}`);
      process.exit(-1);
   });
// Creating Structure of the collection
const userSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         trim: true,
         required: true,
         maxlength: 32,
      },
      email: {
         type: String,
         trim: true,
         required: true,
         unique: true,
      },
      hashed_password: {
         type: String,
         required: true,
      },
      salt: String,
      role: {
         type: String,
         default: "member",
      },
   },
   { timestamps: true }
);

//virtual field
userSchema
   .virtual("password")
   .set(function (password) {
      this._password = password;
      this.salt = uuidv1();
      this.hashed_password = this.encryptPassword(password);
   })
   .get(function () {
      return this._password;
   });

userSchema.methods = {
   authenticate: function (plainText) {
      return this.encryptPassword(plainText) === this.hashed_password;
   },

   encryptPassword: function (password) {
      if (!password) return "";
      try {
         return crypto
            .createHmac("sha1", this.salt)
            .update(password)
            .digest("hex");
      } catch (err) {
         return "";
      }
   },
};
// Creating collection
const collections = mongoose.model("user", userSchema);
collections
   .create({
      // Inserting value of only one key
      name: process.env.Set_name,
      email: process.env.Set_email,
      password: process.env.Set_password,
      role: process.env.Set_role,
   })
   .then((ans) => {
      // console.log("Admin has been added");
   })
   .catch((err) => {
      // console.log("Admin already existed");
   });
// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", bookRoutes);
app.use("/api", imageRoutes);

// Production
var server = app.listen(process.env.PORT || 3000, function () {
   var port = server.address().port;
   console.log(`Server is running on port ${port}`);
});
module.exports = server;
