// Npm and core Module import 
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const adminRouter = express();


//Local Module Import 
const adminController = require('../controller/adminControl');


// Application Middlewares
adminRouter.use(express.urlencoded({extended:true}))
adminRouter.use(express.json());
adminRouter.use(session({
    secret:'key',
    resave : false,
    saveUninitialized : true
}))


// All GET request in Admin Panel 
adminRouter.get('/',adminController.loadAdminLogin);
adminRouter.get('/home',adminController.loadAdminHomepage);
adminRouter.get('/userlist',adminController.loadUserList);
adminRouter.get('/productlist',adminController.loadProductList);
adminRouter.get('/addproduct',adminController.loadAddProductPage);
adminRouter.get('/editproduct',adminController.loadEditProductPage);
adminRouter.get('/categorylist',adminController.loadCategoryList);
adminRouter.get('/addcategory',adminController.loadAddCategoryPage);
adminRouter.get('/editcategory',adminController.loadEditCategoryPage);
adminRouter.get('/addbanner',adminController.loadAddBannerPage);
adminRouter.get('/couponlist',adminController.loadCouponList);
adminRouter.get('/addcoupon',adminController.loadAddCouponPage);
adminRouter.get('/orderlist',adminController.loadOrderList);


// All POST request in Admin Panel 
adminRouter.post('/',adminController.verifyLogin);
adminRouter.post('/logout',adminController.logoutAdmin);
adminRouter.post('/addCategory',adminController.addCategory);


// All Patch Request Handle Admin
adminRouter.patch('/categorystatusupdate',adminController.categorySatusUpdate)






module.exports = adminRouter;