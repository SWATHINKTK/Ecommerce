const bcrypt = require('bcrypt');

async function securePassword(password){

}

// Load User Login Page 
const loadUserLogin = (req,res) => {
    res.render('user/userAuthentication',{admin:false,title:'User'})
}

// Store Register Data to Session 
const storeSignupData = (req,res) => {
    res.render('user/otpVerification')
}

// OTP Verification and Go For the Home Window 
const otpVerification = (req,res) => {
    res.send("home");
}

module.exports = {
    loadUserLogin,
    storeSignupData,
    otpVerification
}