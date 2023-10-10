const express = require('express');
const session = require('express-session');
const moongose = require('mongoose');
const userRouter = express();

// Local Module Import 
const userController = require('../controller/userControl')


// Application Middleware 
userRouter.use(session({
    secret : 'key',
    resave : false,
    saveUninitialized : true
 }));


// GET Request For User 
userRouter.get('/login',userController.loadUserLogin);

// POST Request For User 
userRouter.post('signup',userController.storeSignupData);
userRouter.post('/otp',userController.otpVerification)


module.exports = userRouter;