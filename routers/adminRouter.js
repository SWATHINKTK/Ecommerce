// Npm and core Module import 
const express = require('express');
const mongoose = require('mongoose');
const adminRouter = express();


//Local Module Import 
const adminController = require('../controller/adminControl');


// Application Middlewares
adminRouter.use(express.urlencoded({extended:true}))



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


adminRouter.post('/',adminController.verifyLogin);
adminRouter.post('/logout',adminController.logoutAdmin);




module.exports = adminRouter;