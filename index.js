// *** ENV VARIABLE REQUIRE ****
require('dotenv').config();

// **** CORE AND NPM MODULE IMPORT ****
const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const app = express();



// **** VIEW ENGINE SETUP ****
app.set('view engine','ejs');


// **** SERVER PATH SETTING ****
app.use('/',express.static(path.join(__dirname)));
app.use('/asserts',express.static(path.join(__dirname,'./public/admin/assets')));
app.use('/public',express.static(path.join(__dirname,'./public')));



// **** MOONGOSE CONNECTION SETUP ****
const connectDB = require('./db');
connectDB();




// **** USER ROUTER ****
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


// **** ADMIN ROUTER ****
const adminRouter = require('./routers/adminRouter');
app.use('/admin',adminRouter);

// **** SALESREPORT ROUTER *****
const salesReport = require('./routers/salesReportRouter');
app.use('/admin',salesReport);

// **** BANNER ROUTER *****
const bannerRouter = require('./routers/bannerRouter');
app.use('/admin', bannerRouter);


// **** COUPON ROUTER *****
const couponRouter = require('./routers/couponRouter');
app.use('/admin',couponRouter);

// **** OFFER ROUTER *****
const offerRouter = require('./routers/offerRouter');
app.use('/admin',offerRouter);


// // HADLING THE NOT DEFINED ROUTER CALL


app.use('*',(req,res,next)=>{
    try {
        console.log(req.originalUrl)
        throw new Error('Page is Not Found');
    } catch (error) {
        error.statusCode = 404;
        next(error);
    } 
})


// **** ERROR HANDLING MIDDLEWARE ****
app.use((err,req,res,next) => {

    console.log('hello')
    const errStatus = err.statusCode || 500 ;
    console.log()
    console.log(err.message)

    console.log(err.stack);

    if(errStatus == 404){
        if(req.session.adminId){
            res.status(errStatus).render('errors/error404',{link:'/admin'});
        }else{
            res.status(errStatus).render('errors/error404',{link:'/'});
        }
    }else{

        if(req.session.adminId){
            res.status(errStatus).render('errors/error-500',{errorCode:errStatus, link:'/admin'});
        }else{
            res.status(errStatus).render('errors/error-500',{errorCode:errStatus, link:'/'});
        }
    }
 
})






// *** SERVER START ****
const port = process.env.PORT || 5000;
const hostname = '127.0.0.1';

app.listen(5000,()=>{
    console.log(`server is runnning @ http://${hostname}:${port}/`);
    console.log(`server is runnning @ http://${hostname}:${port}/admin`);
})