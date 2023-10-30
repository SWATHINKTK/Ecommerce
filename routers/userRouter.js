const express = require('express');
const session = require('express-session');
const moongose = require('mongoose');
const userRouter = express();

// Local Module Import 
const userController = require('../controller/userControl');
const auth = require('../middleware/userAuth');
const { compareSync } = require('bcrypt');


// Application Middleware 
userRouter.use(express.urlencoded({extended:true}));
userRouter.use(express.json())
userRouter.use(session({
    secret : 'key',
    resave : false,
    saveUninitialized : true
 }));


// GET Request For User 
userRouter.get('/',userController.guestPage);
userRouter.get('/login',userController.loadUserLogin);
userRouter.get('/logout',userController.userLogout);
userRouter.get('/otpverification',userController.loadOTPVerification);
userRouter.get('/home',userController.loadHomePage);


userRouter.get('/allproductview',userController.loadAllProductViewPage);
userRouter.get('/categoryproductview',userController.loadSpecificCategoryProducts);
userRouter.get('/resendotp',userController.resendOTP);
userRouter.get('/error500',userController.load500ErrorPage);
userRouter.get('/error404',userController.load404ErrorPage);
userRouter.get('/productdetails',userController.loadProductDetailPage);
userRouter.get('/userprofile',auth.isUserLogin,userController.loadUserProfile);
userRouter.get('/addressinformation',auth.isUserLogin,userController.loadAddressInformation);
// userRouter.get('/addaddress',auth.isUserLogin,userController.loadAddressForm);
userRouter.get('/*',userController.load500ErrorPage);

// POST Request For User 
userRouter.post('/signup',userController.storeSignupData);
userRouter.post('/signin',userController.verifyUser);
userRouter.post('/otpverification',userController.OTPCheck);
userRouter.post('/edituserinformation',userController.editUserInformations)
    


module.exports = userRouter;