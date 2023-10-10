const bcrypt = require('bcrypt');
const {loginData,category} = require('../models/adminModel');
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
    // res.render('admin/login',{admin:false});
    res.render('admin/login',{admin:false,style:true});

}

// Verify the Admin Credential and Redirect Admin Homepage
const verifyLogin = async(req,res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        const adminData = await loginData.findOne({username:username});
        if(adminData){
            const passwordMatch = await bcrypt.compare(password,adminData.password)
            if(passwordMatch){
                req.session.name = adminData.adminname;
                req.session.admin_id = adminData._id;
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
    // const name = req.params.adminData.name;
    res.render('admin/main',{admin:true,name:req.session.name});
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

// ADD Data To Database 
const addCategory = async(req,res) => {
    try{
        const name = req.body.categoryname;
        const description = req.body.description;
        if(name && description){
            const checkData = await category.findOne({categoryname:{ $regex: new RegExp(`^${name}`, 'i') }})
            if(!checkData){
                const categoryData = category({
                    categoryname : name,
                    description : description
                })
                const dataSend = await categoryData.save();
                if(dataSend){
                    res.json({'message':'Category Sucessfullly Added','status':true});
                }else{
                    res.json({'message':'Category is not added try again'});
                }
                
            }else{
                res.json({'message':'Category is Already Exist'});
            }
        }else{
            res.json({'message':'Please Enter the Category and Description'});
        }
    }catch(error){
        console.log(error.message);
    }

    
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
    try{
        req.session.destroy((error) => {
            if(error){
                console.error(message.error);
            }else{
                res.redirect('/admin/');
            }
        })
    }catch(error){
        console.error(error.message);
    }
    
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
    logoutAdmin,
    addCategory
}