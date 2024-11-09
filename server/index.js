const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt.js');
const errorHandler = require('./helpers/error-handler.js');
const path = require("path");
const verifyUser = require('./middleware/verifyUser.js');

require('dotenv').config();

app.use(cors());
app.options('*',cors())

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
// app.use(verifyUser);

// Serve static files
app.use('/css', express.static('path_to_css_directory'));
app.use('/images', express.static('path_to_images_directory'));
app.use(authJwt());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'public/uploads' directory
app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));


app.use(errorHandler);

const api = process.env.API_URL;

//Routes
const productsRouter = require('./routers/products.js');
const usersRouter = require('./routers/users.js');
const categoriesRouter = require('./routers/categories.js');
const ordersRouter = require('./routers/orders.js');
const cartRouter = require('./routers/shoppingCart.js');

const mongoURI = process.env.CONNECTION_STRING;

app.use(`${api}/products`,productsRouter);
app.use(`${api}/users`,usersRouter);
app.use(`${api}/categories`,categoriesRouter);
app.use(`${api}/orders`,ordersRouter);
app.use(`${api}/cart`,cartRouter);

//Database
mongoose.connect(mongoURI,{
    ssl: true,
})
.then(() => {
  console.log('MongoDB connected...');
  // Start the server only after successful DB connection
  app.listen(5000, () => {
      console.log('Server is running on http://localhost:5000');
  });
})
  .catch(err => console.log(err));

// //server
// app.listen(3000,()=>{
//     console.log('server is running http://localhost:3000');
// });



//CONNECTION_STRING=mongodb://127.0.0.1:27017/GOKUL_SEED_TECH_PVT_LTD

