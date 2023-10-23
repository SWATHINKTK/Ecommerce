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
const uploadProductImg = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,path.join(__dirname,'../public/admin/assets/productImages'));
    },
    filename:(req,file,cb) => {
        const name = Date.now()+'-'+file.originalname;
        cb(null,name)
    }
});

const uploadBrandImg = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,path.join(__dirname,'../public/admin/assets/brandImages'));
    },
    filename:(req,file,cb) => {
        const name = Date.now()+'-'+file.originalname;
        cb(null,name)
    }
});

const uploadCategoryImg = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,path.join(__dirname,'../public/admin/assets/categoryImages'));
    },
    filename:(req,file,cb) => {
        const name = Date.now()+'-'+file.originalname;
        cb(null,name)
    }
});

const uploadProductImage = multer({storage:uploadProductImg});
const uploadBrandImage = multer({storage:uploadBrandImg});
const uploadCategoryImage = multer({storage:uploadCategoryImg});



/* =========================================================== All Routing  Request in Admin Panel Order GET > POST > PATCH==================================================== */

//*** Login Routing *** 
adminRouter.get('/',adminController.loadAdminLogin);
adminRouter.get('/home',adminController.loadAdminHomepage);
adminRouter.post('/',adminController.verifyLogin);
adminRouter.post('/logout',adminController.logoutAdmin);


//*** User Route ***
adminRouter.get('/userlist',adminController.loadUserList);
adminRouter.get('/searchuser',adminController.searchUser);
adminRouter.patch('/blockuser',adminController.blockUser);



//*** Product Routing ***
adminRouter.get('/productlist',adminController.loadProductList);
adminRouter.get('/productmoredata:id',adminController.loadProductMoreData);
adminRouter.get('/productstausupdate:id',adminController.productStatusUpdate);
adminRouter.get('/searchproduct:data',adminController.searchProduct);
adminRouter.get('/addproduct',adminController.loadAddProductPage);
adminRouter.get('/editproduct:id',adminController.loadEditProductPage);
adminRouter.post('/productadd',uploadProductImage.array('productimages',4),adminController.productAdd);
adminRouter.post('/editproduct',uploadProductImage.array('productimages',4),adminController.editProduct);



//*** Category Routing ***
adminRouter.get('/categorylist',adminController.loadCategoryList);
adminRouter.get('/addcategory',adminController.loadAddCategoryPage);
adminRouter.get('/editcategory:id',adminController.loadEditCategoryPage);
adminRouter.post('/addcategory',uploadCategoryImage.single('categoryImage'),adminController.addCategory);
adminRouter.post('/editcategory',uploadCategoryImage.single('categoryImage'),adminController.editCategory);
adminRouter.post('/searchcategory',adminController.searchCategory);
adminRouter.patch('/categorystatusupdate',adminController.categorySatusUpdate);



//*** Brand Routing *** 
adminRouter.get('/viewbrand',adminController.loadBrandViewPage);
adminRouter.get('/addbrand',adminController.loadBrandAddPage);
adminRouter.get('/editbrand:id',adminController.loadEditBrandPage);
adminRouter.get('/searchbrand',adminController.searchBrandData);
adminRouter.post('/addbrand',uploadBrandImage.single('brandImage'),adminController.addBrandDetails);
adminRouter.post('/editbrand',uploadBrandImage.single('brandImage'),adminController.editBrandDetails);
adminRouter.get('/brandstatusupdate:id',adminController.brandStatusUpdate);




//*** Banner Routing ***
adminRouter.get('/addbanner',adminController.loadAddBannerPage);



//*** Coupon Routing */
adminRouter.get('/couponlist',adminController.loadCouponList);
adminRouter.get('/addcoupon',adminController.loadAddCouponPage);



//*** Order Routing ***
adminRouter.get('/orderlist',adminController.loadOrderList);



//*** Error Routing ***
adminRouter.get('/error500',adminController.load500ErrorPage);
adminRouter.get('/error404',adminController.load404ErrorPage);









module.exports = adminRouter;