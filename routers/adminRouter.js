// Npm and core Module import 
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const adminRouter = express();


//Local Module Import 
const adminController = require('../controller/adminControl');


// Application Middlewares
adminRouter.use(express.json());
adminRouter.use(express.urlencoded({extended:true}))

adminRouter.use(session({
    secret:'key',
    resave : false,
    saveUninitialized : true
}))



// multer is used to upload file 
const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,path.join(__dirname,'../public/admin/assets/productImages'));
    },
    filename:(req,file,cb) => {
        const name = Date.now()+'-'+file.originalname;
        cb(null,name)
    }
});
const upload = multer({storage:storage})


// All GET request in Admin Panel 
adminRouter.get('/',adminController.loadAdminLogin);
adminRouter.get('/home',adminController.loadAdminHomepage);
adminRouter.get('/userlist',adminController.loadUserList);
adminRouter.get('/searchuser',adminController.searchUser);
adminRouter.get('/productlist',adminController.loadProductList);
adminRouter.get('/addproduct',adminController.loadAddProductPage);
adminRouter.get('/editproduct',adminController.loadEditProductPage);
adminRouter.get('/categorylist',adminController.loadCategoryList);
adminRouter.get('/addcategory',adminController.loadAddCategoryPage);
adminRouter.get('/editcategory:id',adminController.loadEditCategoryPage);
adminRouter.get('/addbanner',adminController.loadAddBannerPage);
adminRouter.get('/couponlist',adminController.loadCouponList);
adminRouter.get('/addcoupon',adminController.loadAddCouponPage);
adminRouter.get('/orderlist',adminController.loadOrderList);
adminRouter.get('/error500',adminController.load500ErrorPage);
adminRouter.get('/error404',adminController.load404ErrorPage);


// All POST request in Admin Panel 
adminRouter.post('/',adminController.verifyLogin);
adminRouter.post('/logout',adminController.logoutAdmin);
adminRouter.post('/addcategory',adminController.addCategory);
adminRouter.post('/editcategory',adminController.editCategory);
adminRouter.post('/searchcategory',adminController.searchCategory);
adminRouter.post('/productadd',upload.array('productimages',4),adminController.productAdd);

// All Patch Request Handle Admin
adminRouter.patch('/categorystatusupdate',adminController.categorySatusUpdate)
adminRouter.patch('/blockuser',adminController.blockUser);






module.exports = adminRouter;