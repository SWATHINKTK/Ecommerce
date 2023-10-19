const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {userData} = require('../models/userModal');
const {productInfo} = require('../models/adminModel')


/*--------------------------Router Access Functions in User Side --------------------------------- */

// Random Bytes for OTP Create Using Crypto Module 
async function generateRandomOtp(length){

    if(length % 2 != 0){
        throw new Error('Length must be even For OTP Generation.');
    }

    const randomBytes = crypto.randomBytes(length/2);
    const otp = randomBytes.toString('hex')
    return otp;
}


// Email Sending Using NodeMailer 
async function sendEmail(name,email,otp,html){

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
        // html : '<h2> Welcome <span style="color:blue">'+name+'<span> .</h2>'+'<h4>Your OTP :<b>'+otp+'</b></h4>'+'<h3>Thank You For Joinig...</h3>'
        html : html
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


/*------------------------------------------------------------Router Handling Functions -------------------------------------------*/




/*-------------------------------------- User Login & Register-------------------------------------------------- */
// View User Login Page 
const loadUserLogin = (req,res) => {
    res.render('user/userAuthentication',{admin:false,title:'User'});
}

// Storing User Register Data to Session 
const storeSignupData = async(req,res) => {

    try{
        const password = req.body.password;

        // Checking Register All field Data Present
        if(Object.keys(req.body).length == 5){

            // Check Two Password Column Data Same
            if(req.body.password === req.body.confirmPassword){

                const strongPassword = await securePassword(password);
                const user = {
                    username: req.body.username,
                    email: req.body.email,
                    phonenumber: req.body.phonenumber,
                    password: strongPassword
                }

                // user data added to session 
                req.session.userData = user;

                //Check the Session And generate OTP
                if(req.session.userData){

                    //generate otp and send mail
                    const otp = await generateRandomOtp(6);
                    req.session.otp = otp;
                    const html = `<div style="width: 100%;background: #F5FEFD;text-align:center"><h2>${user.username} Welcome Our Shopping Website</h2><h6>Verification OTP</h6><h3 style="color: red;">${otp}</h3><h2>Thank You For Joining...</h2></div>`
                    await sendEmail(user.username,user.email,otp,html);
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


// View OTP Verification Page 
const loadOTPVerification = (req,res) =>{
    const userdata = req.session.userData;
    res.render('user/otpVerification',{admin:false,title:'User OTP',data:userdata});
}

// Resend OTP In Verification Page
const resendOTP = async(req,res) => {
    const user = req.session.userData;
    const otp = await generateRandomOtp(6);
    req.session.otp = otp;
    await sendEmail(user.username,user.email,otp)
    req.session.startTime = Date.now();
    res.redirect('/otpVerification');
}


// OTP Verificatied and Go For the Home Window 
const OTPCheck = async(req,res) => {

    const endTime = Date.now();
    const startTime = req.session.startTime;
    const sessionOTP = req.session.otp;
    const data = req.session.userData;
    console.log(data,sessionOTP)
    const user = userData({
        username: data.username,
        email: data.email,
        phonenumber: data.phonenumber,
        password: data.password,
        _isVerified: true,
        joined_date: new Date()
    })

    const takenTime = (endTime - startTime)/1000;

    // Checking OTP Expired OR Not
    if(takenTime < 120){

        // Checking OTP
        if(sessionOTP == req.body.otp)
        {
            const sendData = await user.save();
            // Sucess Result
            if(sendData){
                res.redirect('/home');
            }else{
                res.status(500).redirect('/error500');
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


// View Home Page
const loadHomePage = (req,res) => {
    res.send("HOME");
}


/*------------------------------------------------Product Details Handling ------------------------------------------------------*/
const guestPage = async(req,res) => {

    try{
        const productData = await productInfo.find({});
        // console.log(productData)
        res.render('user/index',{user:true,data:productData})
    }catch(error){
        console.log(error.message)
    }
}

const loadProductDetailPage = (req,res) => {
    const id = req.query.id;
    console.log(id);
}




/*--------------------------------------------Error Handling Pages---------------------------------------------------------------- */

// ERROR Page Loading 
const load500ErrorPage = (req,res) =>{
    res.render('partials/error-500',{admin:true})
}

const load404ErrorPage = (req,res) =>{
    res.render('partials/error-404')
}

/*--------------------------------------------Module Exports ----------------------------------------------------------------------*/ 
module.exports = {
    guestPage,
    loadUserLogin,
    storeSignupData,
    loadOTPVerification,
    resendOTP,
    OTPCheck,
    verifyUser,
    loadHomePage,
    loadProductDetailPage,
    load500ErrorPage,
    load404ErrorPage
}






