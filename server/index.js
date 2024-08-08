const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();


const productsRouter = require('../routers/product.js');

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

//Routers
app.use(`${api}/products`,productsRouter)



const api = process.env.API_URL || '/api';

const mongoURI = process.env.CONNECTION_STRING;

mongoose.connect(mongoURI,{
    ssl: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// mongoose.connect(mongoURI,{
//     dbName: 'E-commerce-Database'
// })
// .then(()=>{
//     console.log('Database Connection is ready...');
// })
// .catch((err)=>{
//     console.log(err);
// })

app.listen(3000,()=>{
    console.log('server is running http://localhost:3000');
});

