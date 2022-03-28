const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
require('dotenv').config();
// import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
// const categoryRoutes = require('./routes/category');
// const productRoutes = require('./routes/product');
// const braintreeRoutes = require('./routes/braintree');
// const orderRoutes = require('./routes/order');


// app
const app = express();

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
// app.use('/api', productRoutes);
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