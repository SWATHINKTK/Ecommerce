const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { userData } = require('../models/userModal');
const { productInfo, category ,brandInfo} = require('../models/adminModel');
const { connect } = require('http2');





/* #####################################  ADMIN ACCESS ROUTER FUNCTIONS  ############################################# */


// ***** OTP CREATE USING CRYPTO MODULE. IT CREATE RANDOM BYTES  *****
async function generateRandomOtp(length) {

    if (length % 2 != 0) {
        throw new Error('Length must be even For OTP Generation.');
    }

    const randomBytes = crypto.randomBytes(length / 2);
    const otp = randomBytes.toString('hex')
    return otp;
}



// ***** NODEMAILER TO SEND MAIL TO USERS *****
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



// ****** BCRYPT MODULE IS USED TO ENCRYPT THE PASSWORD DATA ***** 
async function securePassword(password) {

    try {
        const secure = await bcrypt.hash(password, 10);
        return secure;
    } catch (error) {
        console.log(error.message)
    }
}








/* ################################################ ROUTER HANDLING FUNCTIONS ################################################# */




/* ======================= USER LOGIN AND REGISTER ===================== */


// ***** USER LOGIN PAGE VIEW *****
const loadUserLogin = (req, res) => {
    res.render('user/userAuthentication', { admin: false, title: 'User' });
}



// ****** USER LOGOUT THEN GOTO GUSET PAGE
const userLogout = (req,res) => {
    req.session.destroy((error)=>{
        if(error){
            console.log(error.message);
        }else{
            res.redirect('/?login=false');
        }
    })
}



//****** STORING USER REGISTER TIME DATA TO SESSION AND SEND A OTP MAIL ******
const storeSignupData = async (req, res) => {

    try {
        const password = req.body.password;
        const email = req.body.email

        const data = req.body;

        const emailExist = await userData.findOne({ email: email });
       

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
                        
                        // Sending OTP to Thorough Email
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




// ***** VIEW THE OTP VERIFICATION PAGE *****
const loadOTPVerification = (req, res) => {
    const userdata = req.session.userData;
    const time = req.session.startTime
    res.render('user/otpVerification', { admin: false, title: 'User OTP', email: userdata.email, timer: time });
}





// **** RESEND OTP WHEN OTP WAS EXPIRED ****
const resendOTP = async (req, res) => {
    const user = req.session.userData;
    const otp = await generateRandomOtp(6);
    req.session.otp = otp;
    const html = `<div style="width: 100%;background: #F5FEFD;text-align:center"><h2>${user.username} Welcome Our Shopping Website</h2><h6>Verification OTP</h6><h3 style="color: red;">${otp}</h3><h2>Thank You For Joining...</h2></div>`;
    await sendEmail(user.username, user.email, otp,html)
    req.session.startTime = Date.now();
    res.redirect('/otpVerification');
}




// **** OTP VERIFICATON CHECKING FUNCTION AND THEN GO FOR USER HOME ****
const OTPCheck = async (req, res) => {

    const endTime = Date.now();
    const startTime = req.session.startTime;
    const sessionOTP = req.session.otp;
    const data = req.session.userData;
  

    const emailExist = await userData.findOne({email:data.email});


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
                
                if(sendData){

                    req.session.userId = userData._id;
                    res.status(200).json({'status':true, 'message': 'Your Verification Sucessfull. &#9989;<br> Username & Password to login.' });
    
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





// **** LOGIN USER DATA VERIFY AND PROVIDE THE HOME PAGE ****
const verifyUser = async(req, res) => {
    try{

        const username = req.body.username;
        const password = req.body.password;
        
        const usernameExist = await userData.findOne({email:username});

        if(usernameExist.block){

            res.json({'status':false,'message':'&#10060; your account is blocked'});

        }else if(!usernameExist){

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



// *** VIEW THE USER HOME PAGE *****
const loadHomePage = async (req, res) => {

    try {

        const checkLogin = req.session.userId ? true : false;
       

        const categoryData = await category.find({list:true}).sort({ _id: -1});

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





// =====================================   PRODUCT PAGES AND GUEST PAGE HANDLING   ==========================================


// **** GUEST PAGE LOADING FOR EVERY USERS ****
const guestPage = async (req, res) => {
    try {
        const categoryData = await category.find({list:true}).sort({ _id: -1 });

        const productData = await productInfo.aggregate([
            {
                $match:{
                    status:true
                }
            },
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



// **** EACH PRODUT DETAIL VIEW DISPLAY PAGE LOADING *****
const loadProductDetailPage = async (req, res) => {
    try {

        const checkLogin = req.session.userId ? true : false;
        const id = req.query.id;

        const brandData = await brandInfo.find({},{brand_name:1});

        const productData = await productInfo.findOne({ _id: id });
        const categoryData = await category.find({})
        // console.log(productData)
        console.log(productData.categoryIds);
       
        res.render('user/productDetails', { user: true,login:checkLogin,title: 'Products', product:productData ,category:categoryData, dataBrand:brandData})


    } catch (error) {
        res.status(500).redirect('/error500')
    }

}



// ***** LOAD ALL PRODUCT DATA VIEW PAGE ******
const loadAllProductViewPage = async(req,res) =>{
    
    try {

        const checkLogin = req.session.userId ? true : false;

        const productData = await productInfo.find({}).sort({_id:-1});

        res.render('user/allProductView',{ user: true,login:checkLogin, title: 'Products',product:productData});

    } catch (error) {
        console.log(error.message)
    }
}



// ******* LOADING SPECIFIC CATEGORY PRODUCT DATA VIEW ******
const loadSpecificCategoryProducts = async(req,res) => {
    const checkLogin = req.session.userId ? true : false;

    const id = req.query.id;
    const productData = await productInfo.find({ categoryIds:id}).sort({_id:-1});
   
    res.render('user/allProductView',{ user: true,login:checkLogin, title: 'Products',product:productData});
}



const loadUserProfile = async(req,res)=>{
    const id = req.session.userId;
    const data = await userData.findOne({_id:id});
    // console.log(data)
    res.render('user/userProfile',{user:true, dataUser:data});
}

/* =============================================== ERROR HANDLING PAGES ==================================================== */


// ***** 500 - ERROR PAGE LOADING *****
const load500ErrorPage = (req, res) => {
    res.render('partials/error-500', { admin: true })
}


// ****  404 - ERROR PAGE LOADING  *****
const load404ErrorPage = (req, res) => {
    res.render('partials/error-404')
}





/* ####################################### MODUE EXPORTS FOR THE ROUTER ############################################ */

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
    loadUserProfile,
    loadAllProductViewPage,
    loadSpecificCategoryProducts,
    loadProductDetailPage,
    load500ErrorPage,
    load404ErrorPage
}






