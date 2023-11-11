// Core & NPM modules 
const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const app = express();

// Hostname & Port Value Setting
const port = process.env.PORT || 5000;
const hostname = '127.0.0.1';

// Server Configuration 
app.set('view engine','ejs');

// Server Path Setting 
app.use('/asserts',express.static(path.join(__dirname,'./public/admin/assets')));
app.use('/public',express.static(path.join(__dirname,'./public')));



// Mongoose Connect 
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
    .then(()=> console.log("Database Connection Successful"))
    .catch((error) => console.log("Connection Lost  : ",error));




// User Router 
const userRouter = require('./routers/userRouter');
app.use('/',userRouter);


// **** CART ROUTER ****
const cartRouter = require('./routers/cartRouter');
app.use('/api',cartRouter);


// **** CHECKOUT ROUTER ****
const checkOutRouter = require('./routers/checkoutRouter');
app.use('/api',checkOutRouter);


// **** ORDER ROUTER ****
const orderRouter = require('./routers/orderRouter');
app.use('/api',orderRouter);


// ***** WISHLIST ROUTER *****
const wishlistRouter = require('./routers/wishlistRouter');
app.use('/api',wishlistRouter);


// Admin Router 
const adminRouter = require('./routers/adminRouter');
app.use('/admin',adminRouter);


app.listen(5000,()=>{
    console.log(`server is runnning @ http://${hostname}:${port}/`);
    console.log(`server is runnning @ http://${hostname}:${port}/admin`);
})