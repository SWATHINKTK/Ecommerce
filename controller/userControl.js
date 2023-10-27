const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { userData } = require('../models/userModal');
const { productInfo, category } = require('../models/adminModel');
const { chownSync } = require('fs');
const { error } = require('console');


/*--------------------------Router Access Functions in User Side --------------------------------- */

// Random Bytes for OTP Create Using Crypto Module 
async function generateRandomOtp(length) {

    if (length % 2 != 0) {
        throw new Error('Length must be even For OTP Generation.');
    }

    const randomBytes = crypto.randomBytes(length / 2);
    const otp = randomBytes.toString('hex')
    return otp;
}


// Email Sending Using NodeMailer 
async function sendEmail(name, email, otp, html) {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
            user: 'swathinktk10@gmail.com',
            pass: 'qkxm daqx mbkn czzx'
        }
    });

    const mailOptions = {
        from: 'swathinktk10@gmail.com',
        to: email,
        subject: 'For Verification OTP',
        // html : '<h2> Welcome <span style="color:blue">'+name+'<span> .</h2>'+'<h4>Your OTP :<b>'+otp+'</b></h4>'+'<h3>Thank You For Joinig...</h3>'
        html: html
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message);
        } else {
            console.log("Email is to be sented", info.response);
        }
    })
}


// PassWord Secure Using bcrypt Module 
async function securePassword(password) {

    try {
        const secure = await bcrypt.hash(password, 10);
        return secure;
    } catch (error) {
        console.log(error.message)
    }
}


/*------------------------------------------------------------Router Handling Functions -------------------------------------------*/




/*-------------------------------------- User Login & Register-------------------------------------------------- */
// View User Login Page 
const loadUserLogin = (req, res) => {
    res.render('user/userAuthentication', { admin: false, title: 'User' });
}

// User Logged 
const userLogout = (req,res) => {
    req.session.destroy((error)=>{
        if(error){
            console.log(error.message);
        }else{
            res.redirect('/login?login=false');
        }
    })
}



// Storing User Register Data to Session 
const storeSignupData = async (req, res) => {

    try {
        const password = req.body.password;
        const email = req.body.email

        const data = req.body;

        const emailExist = await userData.findOne({ email: email });
        console.log(emailExist)

        if (emailExist) {
            res.render('user/userAuthentication', { admin: false,title:'Sign Up', data: ' &#10060; User email is already exist' });

        } else {

            // Checking Register All field Data Present
            if (data.username != '' && data.email != '' && data.phonenumber != '' && data.password != '') {

                // Check Two Password Column Data Same
                if (req.body.password === req.body.confirmPassword) {

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
                    if (req.session.userData) {

                        //generate otp and send mail
                        const otp = await generateRandomOtp(6);
                        req.session.otp = otp;
                        const html = `<div style="width: 100%;background: #F5FEFD;text-align:center"><h2>${user.username} Welcome Our Shopping Website</h2><h6>Verification OTP</h6><h3 style="color: red;">${otp}</h3><h2>Thank You For Joining...</h2></div>`
                        await sendEmail(user.username, user.email, otp, html);
                        req.session.startTime = Date.now();
                        res.redirect('/otpVerification');

                    } else {
                        res.render('partials/error-500');
                    }

                } else {
                    res.render('user/userAuthentication', { admin: false,title:'Sign Up', data: 'Must Enter Two Password Same' })
                }
            } else {

                res.render('user/userAuthentication', { admin: false,title:'Sign Up', data: 'Enter All Fields and Again You can register' });

            }
        }
    } catch (error) {
        console.log(error.message);
    }
}


// View OTP Verification Page 
const loadOTPVerification = (req, res) => {
    const userdata = req.session.userData;
    const time = req.session.startTime
    res.render('user/otpVerification', { admin: false, title: 'User OTP', email: userdata.email, timer: time });
}

// Resend OTP In Verification Page
const resendOTP = async (req, res) => {
    const user = req.session.userData;
    const otp = await generateRandomOtp(6);
    req.session.otp = otp;
    await sendEmail(user.username, user.email, otp)
    req.session.startTime = Date.now();
    res.redirect('/otpVerification');
}


// OTP Verificatied and Go For the Home Window 
const OTPCheck = async (req, res) => {

    const endTime = Date.now();
    const startTime = req.session.startTime;
    const sessionOTP = req.session.otp;
    const data = req.session.userData;
    console.log(data,sessionOTP)

    const emailExist = await userData.findOne({email:data.email});
    console.log(data.email)

    if(!emailExist)
    {

        const user = userData({
            username: data.username,
            email: data.email,
            phonenumber: data.phonenumber,
            password: data.password,
            _isVerified: true,
            joined_date: new Date()
        })

        const takenTime = (endTime / 1000) - (startTime / 1000);

        // Checking OTP Expired OR Not
        if (takenTime < 120) {

            // Checking OTP
            if (sessionOTP == req.body.otp) {
                const sendData = await user.save();
                console.log('sss')
                if(sendData){

                    req.session.userId = userData._id;
                    res.json({'status':true})
                    console.log('sucess')
                }

                delete req.session.startTime;
                delete req.session.otp;
                delete req.session.userData;

            } else {
                res.status(400).json({'status':false, 'message': 'Invalid OTP &#10071' });
            }

        } else {

            delete req.session.otp;
            res.status(200).json({'status':false, 'message': 'OTP Expired &#10060' });
        }
    }else{
        res.status(200).json({'status':false, 'message': 'OTP Verified.You can go Home to Login' });
    }
}


// Verify Login 
const verifyUser = async(req, res) => {
    try{

        const username = req.body.username;
        const password = req.body.password;
        
        const usernameExist = await userData.findOne({email:username});

        if(!usernameExist){

            res.json({'status':false,'message':'&#10060; check your email address' });

        }else{

            const check = await bcrypt.compare(password,usernameExist.password);

            if(check){

                req.session.userId = usernameExist._id;
                res.json({'status':true});

            }else{

                res.json({'status':false,'message':' &#10060; user email & password was inccorect' })

            }

        }
    }catch(error){
        console.log(error.message);
        res.redirect('/error500');
    }
    
}


// View Home Page
const loadHomePage = async (req, res) => {

    try {

        const checkLogin = req.session.userId ? true : false;
       
        // console.log(req.session.userId);

        const categoryData = await category.find({}).sort({ _id: -1 });

        const productData = await productInfo.aggregate([
            {
                $unwind: "$categoryIds"
            },
            {
                $lookup: {
                    from: 'categorys',
                    localField: 'categoryIds',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            }]);


        res.render('user/index', { user: true,login:checkLogin,  title: 'Brand Unlimited', dataCategory: categoryData, dataProduct: productData });

    } catch (error) {

        console.log(error.message);

    }

}


/*------------------------------------------------Product Details Handling ------------------------------------------------------*/
const guestPage = async (req, res) => {

    try {

        const categoryData = await category.find({}).sort({ _id: -1 });

        const productData = await productInfo.aggregate([
            {
                $unwind: "$categoryIds" // Unwind the array to create a separate document for each category ID
            },
            {
                $lookup: {
                    from: 'categorys', // The name of the collection to join with
                    localField: 'categoryIds', // The field from the input collection
                    foreignField: '_id', // The field from the "from" collection
                    as: 'categoryData'         // The alias for the new field
                }
            },
            {$sort:{_id:-1}}
        ]);

        // const productsWithCategory = productData.filter(product =>
        //     product.categoryData.some(category => category.categoryname === 'T-Shirts')

        // );
        // console.log(productData)


        res.render('user/index', { user: true,login:false, title: 'Brand Unlimited', dataCategory: categoryData, dataProduct: productData })
    } catch (error) {
        console.log(error.message)
    }
}

const loadProductDetailPage = async (req, res) => {
    try {

        const checkLogin = req.session.userId ? true : false;
        const id = req.query.id;

        const productData = await productInfo.findOne({ _id: id });
        const categoryData = await category.find({})
        // console.log(productData)
        console.log(productData.categoryIds);
       
        res.render('user/productDetails', { user: true,login:checkLogin,title: 'Products', product:productData ,category:categoryData})


    } catch (error) {
        res.status(500).redirect('/error500')
    }

}


const loadAllProductViewPage = async(req,res) =>{
    
    try {

        const checkLogin = req.session.userId ? true : false;

        const productData = await productInfo.find({}).sort({_id:-1});

        res.render('user/allProductView',{ user: true,login:checkLogin, title: 'Products',product:productData});

    } catch (error) {
        console.log(error.message)
    }
}

const loadSpecificCategoryProducts = async(req,res) => {
    const checkLogin = req.session.userId ? true : false;

    const id = req.query.id;
    const productData = await productInfo.find({ categoryIds:id }).sort({_id:-1});
    console.log(productData)
    res.render('user/allProductView',{ user: true,login:checkLogin, title: 'Products',product:productData});
}

/*--------------------------------------------Error Handling Pages---------------------------------------------------------------- */

// ERROR Page Loading 
const load500ErrorPage = (req, res) => {
    res.render('partials/error-500', { admin: true })
}

const load404ErrorPage = (req, res) => {
    res.render('partials/error-404')
}

/*--------------------------------------------Module Exports ----------------------------------------------------------------------*/
module.exports = {
    guestPage,
    userLogout,
    loadUserLogin,
    storeSignupData,
    loadOTPVerification,
    resendOTP,
    OTPCheck,
    verifyUser,
    loadHomePage,
    loadAllProductViewPage,
    loadSpecificCategoryProducts,
    loadProductDetailPage,
    load500ErrorPage,
    load404ErrorPage
}






