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
        html : '<h2> Welcome <span style="color:blue">'+name+'<span> .</h2>'+'<h4>Your OTP :<b>'+otp+'</b></h4>'+'<h3>Thank You For Joinig...</h3>'
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
                const user = {
                    username: req.body.username,
                    email: req.body.email,
                    phonenumber: req.body.phonenumber,
                    password: strongPassword,
                }
                // user data added to session 
                req.session.userData = user;
                console.log(req.session.userData)
                if(req.session.userData){
                    //generate otp and send mail
                    const otp = await generateRandomOtp(6);
                    req.session.otp = otp;
                    await sendEmail(user.username,user.email,otp);
                    req.session.startTime = Date.now();
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
    const userdata = req.session.userData;
    res.render('user/otpVerification',{admin:false,title:'User OTP',data:userdata});
}

// Resend OTP 
const resendOTP = async(req,res) => {
    const user = req.session.userData;
    const otp = await generateRandomOtp(6);
    req.session.otp = otp;
    await sendEmail(user.username,user.email,otp)
    req.session.startTime = Date.now();
    res.redirect('/otpVerification');
}


// OTP Verification and Go For the Home Window 
const OTPCheck = async(req,res) => {
    const endTime = Date.now();
    const startTime = req.session.startTime;
    const sessionOTP = req.session.otp;
    const data = req.session.userData;
    console.log(data)
    const user = userData({
        username: data.username,
        email: data.email,
        phonenumber: data.phonenumber,
        password: data.password,
        _isVerified: true,
        joined_date: new Date()
    })
    const takenTime = (endTime - startTime)/1000;
    if(takenTime < 120){
        if(sessionOTP == req.body.otp)
        {
            const sendData = await user.save();
            if(sendData){
                res.status(200).json({message:'success'});
            }else{
                res.status(500).json({message:'error'});
            }
            delete req.session.startTime;
            delete req.session.otp;
            delete req.session.userData;

        }else{
            res.status(400).json({message:'Invalid OTP &#10071'});
        }
    }else{
        delete req.session.otp;
        res.status(200).json({message:'OTP Expired &#10060'});
    }
}


// Verify Login 
const verifyUser = (req,res) => {
    // console.log("working")
    // res.status(200);
}


// Load Home Page
const loadHomePage = (req,res) => {
    res.send("HOME");
}


// ERROR Page Loading 
const load500ErrorPage = (req,res) =>{
    res.render('partials/error-500',{link:'/user'})
}

const load404ErrorPage = (req,res) =>{
    res.render('partials/error-404',{link:'/user'})
}
module.exports = {
    loadUserLogin,
    storeSignupData,
    loadOTPVerification,
    resendOTP,
    OTPCheck,
    verifyUser,
    loadHomePage,
    load500ErrorPage,
    load404ErrorPage
}






