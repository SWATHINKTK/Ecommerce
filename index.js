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




// Admin Router 
const adminRouter = require('./routers/adminRouter');
app.use('/admin',adminRouter);

// User Router 
const userRouter = require('./routers/userRouter');
app.use('/',userRouter);


app.listen(5000,()=>{
    console.log(`server is runnning @ http://${hostname}:${port}/`);
    console.log(`server is runnning @ http://${hostname}:${port}/admin`);
})