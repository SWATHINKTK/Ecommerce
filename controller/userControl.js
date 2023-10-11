const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {userData} = require('../models/userModal');

// Random bytes for OTP create using crypto Module 
async function generateRandomOtp(length){
    if(length % 2 != 0){
        throw new Error('Length must be even For OTP Generation.');
    }

    const randomBytes = crypto.randomBytes(length/2);
    const otp = randomBytes.toString('hex')
    return otp;

}

// Email Sending Using NodeMailer 
async function sendEmail(name,email,otp){
    const transporter = nodemailer.createTransport({
        host : 'smtp.gmail.com',
        port : 465,
        secure : true,
        requireTLS : true,
        auth : {
            user:'swathinktk10@gmail.com',
            pass:'qkxm daqx mbkn czzx'
        }
    });

    const mailOptions = {
        from : 'swathinktk10@gmail.com',
        to : email,
        subject : 'For Verification OTP',
        html : '<p> Welcome '+name+' .<br> veficatiion OTP : '+otp+' </p>'
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error.message);
        }else{
            console.log("Email is to be sented",info.response);
        }
    })


}


// PassWord Secure Using bcrypt Module 
async function securePassword(password){
    try{
        const secure = await bcrypt.hash(password,10);
        return secure;
    }catch(error){
        console.log(error.message)
    }
}

// Load User Login Page 
const loadUserLogin = (req,res) => {
    res.render('user/userAuthentication',{admin:false,title:'User'});
}

// Store Register Data to Session 
const storeSignupData = async(req,res) => {
    try{
        const password = req.body.password;
        if(Object.keys(req.body).length == 5){
            if(req.body.password === req.body.confirmPassword){
                const strongPassword = await securePassword(password);
                const user = userData({
                    username : req.body.username,
                    email : req.body.email,
                    phonenumber : req.body.phonenumber,
                    password : strongPassword,
                    joined_date : new Date()
                })
                req.session.userData = user;
                if(req.session.userData){
                    const otp = await generateRandomOtp(6);
                    console.log(otp);
                    sendEmail(user.username,user.email,otp)
                    res.redirect('/otpVerification');
                }else{
                    res.status(500).render('partials/error-500');
                }
                
            }else{
                res.status(400);
            }
        }
    }catch(error){
        console.log(error.message);
    }
}


// Load OTP Verification Page 
const loadOTPVerification = (req,res) =>{
    const data = req.session.userData;
    res.render('user/otpVerification',{admin:false,title:'User OTP',name:data.username});
}


// OTP Verification and Go For the Home Window 
const OTPCheck = (req,res) => {
    // console.log(req.body)
}


// Verify Login 
const verifyUser = (req,res) => {
    res.send('sucess');
}

// Load Home Page 
module.exports = {
    loadUserLogin,
    storeSignupData,
    loadOTPVerification,
    OTPCheck,
    verifyUser
}






