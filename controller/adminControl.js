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
    res.render('admin/samples/login');
}

// Verify the Admin Credential and Redirect Admin Homepage
const verifyLogin = async(req,res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        console.log(username,password)
        const adminData = await adminModel.findOne({username:username});
        console.log(adminData);
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
    res.render('admin/main');
}



module.exports = {
    loadAdminLogin,
    verifyLogin,
    loadAdminHomepage ,
}