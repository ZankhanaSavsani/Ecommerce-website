const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

app.use(cors());
app.options('*',cors())

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));


const api = process.env.API_URL;

//Routes
const productsRouter = require('./routers/products.js');
const usersRouter = require('./routers/users.js');
const categoriesRouter = require('./routers/categories.js');
const ordersRouter = require('./routers/orders.js');


const mongoURI = process.env.CONNECTION_STRING;

app.use(`${api}/products`,productsRouter);
app.use(`${api}/users`,usersRouter);
app.use(`${api}/categories`,categoriesRouter);
app.use(`${api}/orders`,ordersRouter);

//Database
mongoose.connect(mongoURI,{
    ssl: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

//server
app.listen(3000,()=>{
    console.log('server is running http://localhost:3000');
});

