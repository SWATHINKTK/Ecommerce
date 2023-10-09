const bcrypt = require('bcrypt');
const adminModel = require('../models/adminModel');
async function strong(pass){
    try{
        const x = await bcrypt.hash(pass,10)
    return x;
    }catch(err){
        console.log(err)
    }
    
}

// Load Admin Login Page 
const loadAdminLogin = (req,res) =>{
    res.render('admin/login',{admin:false});
}

// Verify the Admin Credential and Redirect Admin Homepage
const verifyLogin = async(req,res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        console.log(username,password)
        const adminData = await adminModel.findOne({username:username});
        if(adminData){
            const passwordMatch = await bcrypt.compare(password,adminData.password)
            if(passwordMatch){
                res.redirect('admin/home');
            }else{
                res.send("Invalid Data");
            }
        }
    }catch(error){
        console.log(error.message);
    }
    
}

// Load Admin Home Window 
const loadAdminHomepage = (req,res) => {
    res.render('admin/main',{admin:true});
}


// Load User List Window
const loadUserList = (req,res) => {
    res.render('admin/viewUsers',{admin:true});
}

// Load Product List Window
const loadProductList = (req,res) => {
    res.render('admin/viewProducts',{admin:true});

}

// Load Add Product page 
const loadAddProductPage = (req,res) => {
    res.render('admin/addProduct',{admin:true});
}

// Load Edit Product page 
const loadEditProductPage = (req,res) => {
    res.render('admin/editProduct',{admin:true});
}


// Load Product List Window
const loadCategoryList = (req,res) => {
    res.render('admin/viewCategorys',{admin:true});
}

// Load Add Product page 
const loadAddCategoryPage = (req,res) => {
    res.render('admin/addCategory',{admin:true});
}

// Load Edit Product page 
const loadEditCategoryPage = (req,res) => {
    res.render('admin/editCategory',{admin:true});
}

// Load Add Banner page 
const loadAddBannerPage = (req,res) => {
    res.render('admin/addBanner',{admin:true});
}

// Load  Coupon List Window
const loadCouponList = (req,res) => {
    res.render('admin/viewCoupons',{admin:true});
}

// Load Add Coupon page 
const loadAddCouponPage = (req,res) => {
    res.render('admin/addCoupon',{admin:true});
}


// Load  Order List Window
const loadOrderList = (req,res) => {
    res.render('admin/viewOrders',{admin:true})
}



const logoutAdmin = (req,res) => {
    res.redirect('/admin/');
}
module.exports = {
    loadAdminLogin,
    verifyLogin,
    loadAdminHomepage ,
    loadUserList,
    loadProductList,
    loadAddProductPage,
    loadEditProductPage,
    loadCategoryList,
    loadAddCategoryPage,
    loadEditCategoryPage,
    loadAddBannerPage,
    loadCouponList,
    loadAddCouponPage,
    loadOrderList,
    logoutAdmin
}