const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
const session = require('express-session');
require('dotenv').config();
const crypto = require('crypto')
const uuidv1 = require('uuidv1')
// import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
// const categoryRoutes = require('./routes/category');
const bookRoutes = require('./src/routes/book');
// const braintreeRoutes = require('./routes/braintree');
// const orderRoutes = require('./routes/order');
// const Schema = mongoose.Schema;

// app
const app = express();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
// db
mongoose
.connect(`mongodb+srv://vanquy1306:quypv1306@crudapp.s69oc.mongodb.net/Rentbook?retryWrites=true&w=majority

`,
    {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
//    useFindAndModify: false,
   dbName: 'Rentbook'

})
.then(() => console.log("DB Connected")
)
.catch(err=>{
    console.log(`db error ${err.message}`);
    process.exit(-1)
});
// Creating Structure of the collection
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        trim: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    },
    phonenumber:{
      type: Number

    }
},
{ timestamps: true }
);
  //virtual field
  userSchema.virtual('password')
.set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
})
.get(function() {
    return this._password;
});

userSchema.methods = {
authenticate: function(plainText){
return this.encryptPassword(plainText) === this.hashed_password;

},

    encryptPassword: function(password) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    } 
};
// Creating collection
const collections = mongoose.model("user", userSchema);
collections
  .create({
    // Inserting value of only one key
    name: process.env.Set_name,
    email: process.env.Set_email, 
    password: process.env.Set_password,
    role: process.env.Set_role
    
  })
  .then((ans) => {
    console.log(ans);
  })
  .catch((err) => {
    console.log(err.message);
  });
// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
// app.use('/api', categoryRoutes);
app.use('/api', bookRoutes);
// app.use('/api', braintreeRoutes);
// app.use('/api', orderRoutes);


// const port = process.env.PORT || 8000;

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// Production
var server = app.listen(process.env.PORT || 3000 , function () {
    var port = server.address().port;
    console.log(`Server is running on port ${port}`)
});