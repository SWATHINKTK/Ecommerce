const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { userData } = require('../models/userModal');
const { productInfo } = require('../models/productModel');
const { brandInfo } = require('../models/brandModel');
const { category } = require('../models/categoryModel');
const cartData = require('../models/cartModel');
const orderData = require('../models/orderModel');
const wishlistData = require('../models/wishlistModel');
const addressInfo = require('../models/addressModel');
const bannerData = require('../models/bannerModel');
const Razorpay = require('razorpay');
const mongoose = require('mongoose');



// PAYMENT INTEGRATION KEY SETUP
var instance = new Razorpay({
    key_id: process.env.PAYMENT_INTEGRATION_KEY_ID,
    key_secret: process.env.PAYMENT_INTEGRATION_KEY_SECRET,
  });


// Generating Random Ids
async function generateId(length) {

    if (length % 2 != 0) {
        throw new Error('Length must be even For OTP Generation.');
    }

    const randomBytes = crypto.randomBytes(length / 2);
    const Id = randomBytes.toString('hex')
    return Id;
}




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
async function sendEmail( email, html , fromMail = 'swathinktk10@gmail.com', subject = 'For Verification OTP') {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
            user: 'swathinktk10@gmail.com',
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: fromMail,
        to: email,
        subject: subject,
        // html : '<h2> Welcome <span style="color:blue">'+name+'<span> .</h2>'+'<h4>Your OTP :<b>'+otp+'</b></h4>'+'<h3>Thank You For Joinig...</h3>'
        html: html
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            throw new Error('Mail Sending Failed')
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
        throw new Error('Encryption Error');
    }
}








/* ################################################ ROUTER HANDLING FUNCTIONS ################################################# */




/* ======================= USER LOGIN AND REGISTER ===================== */


// ***** USER LOGIN PAGE VIEW *****
const loadUserLogin = (req, res, next) => {
    try {
        res.render('userLogin',{ admin: false, title: 'User' }); 
    } catch (error) {
        error.statusCode = 404;
        next(error);
    } 
}



// **** LOGIN USER DATA VERIFY AND PROVIDE THE HOME PAGE ****
const verifyUser = async(req, res, next) => {
    try{

        const username = req.body.username;
        const password = req.body.password;
        
        const usernameExist = await userData.findOne({email:username});
        
        if(!usernameExist){

            res.json({'status':false,'message':'&#10060; check your email address' });

        }else if(usernameExist.block){

            res.json({'status':false,'message':'&#10060; your account is blocked'});

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
        next(error);
    }
    
}



// ****** USER LOGOUT THEN GOTO GUSET PAGE
const userLogout = (req, res, next) => {
    req.session.destroy((error)=>{
        if(error){
            next(error);
        }else{
            res.redirect('/?login=false');
        }
    })
};


// GOOGLE AUTHENTICATION SUCESS
const googleAuthenticationSucess = (req, res, next) => {
    try {

        if(req.user._id){

            req.session.userId = req.user._id;
            res.redirect('/home');
        }

    } catch (error) {
        next(error)
    }
}



// GOOGLE AUTHENTICATION FAILED
const googleAuthenticationFailed = (req, res, next) => {
    try {
        res.render('userLogin',{ admin: false, title: 'User' ,verification:'Google Authentication Some Issues.Try Again'}); 
    } catch (error) {
        next(error);
    }
}



const resetTokens = {};

// FORGOTT PASSWORD EMAIL SENDING
const LoadforgotPasswordPage = async(req, res, next) => {
    try {

        res.render('forgotPassword',{ admin: false, title: 'ForgotPassWord' });

    } catch (error) {
        next(error)
    }
}


const submitForgotPasswordEmail = async(req, res, next) => {
    try {
        const forgotEmail = req.body.email;
        
        const userExist = await userData.findOne({email:forgotEmail});

        if(userExist){

            const token = await generateRandomOtp(10);
            resetTokens[token] = { forgotEmail, timestamp: Date.now() };
            
            const html = `<div style="width: 100%;background: #F5F5F5;text-align:center; height:60vh; padding-top:50px" ><h2>Click The ForgotPassword Link & Change Password</h2><h4><a href="https://mensfocus.shop/resetPassword?id=${token}">ResetLink</a></h4></div>`
            const sendMail = await sendEmail( forgotEmail, html,null, 'Reset Password' );

            if(!sendMail){
                res.json({success:true,message:`Reset Password Link Send To Your Email.<br>${forgotEmail}`});
            }else{
                res.json({success:false,message:'Email Sending Failed'});
            }

        }else{

            res.json({success:false,message:'This User Is Not Exist.First Create An Account.'})
        }

    } catch (error) {
        next(error);
    }
} 

const loadResetPasswordPage = (req, res, next) => {
    try {
        const token = req.query.id;

        if (resetTokens[token]) {
            const tokenData = resetTokens[token];
            const expirationTime = tokenData.timestamp + 15 *  60 * 1000; // 15 minutes

            if (Date.now() <= expirationTime) {
                res.render('changePassword',{ admin: false, title: 'ResetPassword',token:token });
            } else {
                const error = new Error('Password reset link has expired.');
                error.statusCode = 404;
                next(error);
            }
        }else{
            const error = new Error('Password reset link has expired.');
            error.statusCode = 404;
            next(error);
        }
    } catch (error) {
        next(error);
    }
}


// PASSWORD CHANGE SUCCESS
const passwordChange = async(req, res, next) => {
    try {
        const data = req.body;
        const token = req.query.id;

        if (resetTokens[token]) {
            const tokenData = resetTokens[token];
            const expirationTime = tokenData.timestamp + 15 * 60 * 1000; // 15 minutes
            if (Date.now() <= expirationTime) {

                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

                const condition = passwordRegex.test(data.confirmPassword) & data.confirmPassword == data.newPassword;

                if(condition){

                    const userEmail = resetTokens[token].forgotEmail;

                    const strongPassword = await securePassword(data.confirmPassword);
                    const updateUserPassword = await userData.updateOne({email:userEmail},{$set:{password:strongPassword}});
                    if(updateUserPassword){
                        res.json({success:true,message:`Password Changed Succesfully`});
                        delete resetTokens[token];
                    }else{
                        res.json({success:false,message:`Password Changed Failed.Try Again.`});
                    }
                }else{
                    res.json({success:false,message:`Password Changed Failed.Try Again.`});
                }

            } else {
                const error = new Error('Password reset link has expired.');
                error.statusCode = 404;
                next(error);
            }
        } else {
            const error = new Error('Password reset link has expired.');
            error.statusCode = 404;
            next(error);
        }

    } catch (error) {
        
    }
}




// LOADING NEW USER REGISTER PAGE
const LoadUserRegistrationPage = (req, res, next) => {
    try {
        if(req.query.refer){
            res.render('userRegistration',{ admin: false, title: 'User' , referalId:req.query.refer });
        }else{
            res.render('userRegistration',{ admin: false, title: 'User' }); 
        }
    } catch (error) {
        error.statusCode = 404;
        next(error);
    }
}


//****** STORING USER REGISTER TIME DATA TO SESSION AND SEND A OTP MAIL ******
const storeSignupData = async (req, res, next) => {

    try {
        const password = req.body.password;
        const email = req.body.email

        const data = req.body;

        const refer = data.refer;
        if(refer.trim() != ''){
            const referExist = await userData.findOne({_id:refer});
            if(referExist){
                req.session.referId = refer;
            }
        }

        const emailExist = await userData.findOne({ email: email });
       

        if (emailExist) {
            res.render('userRegistration', { admin: false,title:'Sign Up', data: 'User email is already exist' });

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
                        await sendEmail(user.email, html);

                        req.session.startTime = Date.now();
                        res.redirect('/otpVerification');

                    } else {
                        res.render('partials/error-500');
                    }

                } else {
                    res.render('userRegistration', { admin: false,title:'Sign Up', data: 'Must Enter Two Password Same' })
                }
            } else {

                res.render('userRegistration', { admin: false,title:'Sign Up', data: 'Enter All Fields and Again You can register' });

            }
        }
    } catch (error) {
        next(error);
    }
}




// ***** VIEW THE OTP VERIFICATION PAGE *****
const loadOTPVerification = (req, res, next) => {
    try {
        const userdata = req.session.userData;
        const time = req.session.startTime;
        res.render('otpVerification', { admin: false, title: 'OTP Verification', email: userdata.email, timer: time });
    } catch (error) {
        next(error);
    }
    
}





// **** RESEND OTP WHEN OTP WAS EXPIRED ****
const resendOTP = async (req, res, next) => {
    try {
        const user = req.session.userData;
        const otp = await generateRandomOtp(6);
        req.session.otp = otp;
        const html = `<div style="width: 100%;background: #F5FEFD;text-align:center"><h2>${user.username} Welcome Our Shopping Website</h2><h6>Verification OTP</h6><h3 style="color: red;">${otp}</h3><h2>Thank You For Joining...</h2></div>`;
        await sendEmail( user.email, html)
        req.session.startTime = Date.now();
        res.redirect('/otpVerification');
    } catch (error) {
        next(error);
    }
   
}




// **** OTP VERIFICATON CHECKING FUNCTION AND THEN GO FOR USER HOME ****
const OTPCheck = async (req, res, next) => {

    try {
        const endTime = Date.now();
        const startTime = req.session.startTime;
        const sessionOTP = req.session.otp;
        const data = req.session.userData;
        const refer = req.session.referId;

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

                        if(refer){

                            // const nanoidModule = await import('nanoid');
                            // nanoid = nanoidModule.nanoid;
    
                            // const uniqueID = nanoid();

                            const uniqueID = String(await generateId(8));
    
                            const transaction = {
                                transactionId: uniqueID,
                                transactionType: 'Debit',
                                description: 'Referal Amount',
                                amount: 100
                            }
                        
    
                            const refferingAmount = await userData.updateOne({ _id: refer }, { $inc: { walletAmount: 100 } }, { upsert: true });
                            const updateWalletTransaction = await userData.updateOne({ _id: refer }, { $push: { walletTransaction: transaction } }, { upsert: true });
                            
                            const newUseUniqueId = String(await generateId(8));
    
                            const newUserTransaction = {
                                transactionId: newUseUniqueId,
                                transactionType: 'Debit',
                                description: 'Referal Amount',
                                amount: 50
                            }
                        
    
                            const referAmountForNewUser = await userData.updateOne({ _id: user._id }, { $inc: { walletAmount: 50 } }, { upsert: true });
                            const updateNewUserWalletTransaction = await userData.updateOne({ _id: user._id }, { $push: { walletTransaction: newUserTransaction } }, { upsert: true }); 
                            delete req.session.refer;
                        }

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
    } catch (error) {
        next(error)
    }
    
}







// *** VIEW THE USER HOME PAGE *****
const loadHomePage = async (req, res, next) => {

    try {
        const checkLogin = req.session.userId ? true : false;
        const id = req.session.userId;

        // Use Promise.all to run multiple queries in parallel
        const [banner, categoryData, productData, cart, wishlist] = await Promise.all([
            bannerData.aggregate([
                {
                    $match: {
                        is_Listed: true,
                    },
                },
            ]),
            category.find({}).sort({_id:-1}),
            productInfo.aggregate([
                { $unwind: "$categoryIds" },
                {
                    $lookup: {
                        from: 'categorys',
                        localField: 'categoryIds',
                        foreignField: '_id',
                        as: 'categoryData',
                    },
                },
                { 
                    $sort: { _id: -1 } 
                }
            ]),
            cartData.findOne({ userId: id }),
            wishlistData.findOne({ userId: id }),
        ]);




        res.render('index', {
            user: true,
            login: checkLogin,
            title: 'Mens Focus',
            dataCategory: categoryData,
            dataProduct: productData,
            dataCart: cart,
            wishlistData: wishlist,
            bannerData: banner,
        });

    } catch (error) {
        next(error);
    }

}





// =====================================   PRODUCT PAGES AND GUEST PAGE HANDLING   ==========================================


// **** GUEST PAGE LOADING FOR EVERY USERS ****
const guestPage = async (req, res, next) => {
    try {

        // Use Promise.all to run database queries in parallel
        const [categoryData, banner, productData] = await Promise.all([
            category.find({}).sort({_id:-1}),
            bannerData.aggregate([{ $match: { is_Listed: true } }]),
            productInfo.aggregate([
                { $match: { status: true } },
                { $unwind: "$categoryIds" },
                {
                    $lookup: {
                        from: 'categorys',
                        localField: 'categoryIds',
                        foreignField: '_id',
                        as: 'categoryData'
                    }
                },
                { 
                    $sort: { _id: -1 } 
                }
            ])
        ]);


        res.render('index', {
            user: true,
            login: false,
            title: 'Mens Focus',
            dataCategory: categoryData,
            dataProduct: productData,
            bannerData: banner
        });
    } catch (error) {
        next(error);
    }
}



// **** EACH PRODUT DETAIL VIEW DISPLAY PAGE LOADING *****
const loadProductDetailPage = async (req, res, next) => {
    try {

        const checkLogin = req.session.userId ? true : false;
        const id = req.query.id;

        let brandData = await brandInfo.find({},{brand_name:1});

        const productData = await productInfo.findOne({ _id: id });
        const categoryData = await category.find({});


        const cart = await cartData.findOne({cartProducts:{$elemMatch:{productId:id}}});


        const wishlist = await wishlistData.findOne({userId:req.session.userId});

        const review = await productInfo.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(id)
                }
            },
            {
                $unwind:"$review"
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'review.userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind:"$userData"
            },
            {
                $project:{
                    review:1,
                    'userData.username':1
                }
            }
        ])




        for(let brand of brandData){
            if(brand._id.equals(productData.brandname))
                brandData = brand.brand_name
        }
       
        res.render('productDetails', { 
            user: true,
            login:checkLogin,title: 'Products', 
            product:productData ,
            category:categoryData, 
            dataBrand:brandData ,
            dataCart:cart, 
            wishlistData:wishlist,
            reviewData:review
        });


    } catch (error) {
        next(error);
    }

}



// ***** LOAD ALL PRODUCT DATA VIEW PAGE ******
const loadAllProductViewPage = async(req, res, next) =>{
    
    try {

        let page = 1;
        if(req.query.page){
            page = req.query.page;
        }

        const limit = 8;


        const checkLogin = req.session.userId ? true : false;

        const userId = req.session.userId;

        const categoryInfo = await category.find({},{categoryname:1});

        const brand = await brandInfo.find({},{brand_name:1});

        // const productData = await productInfo.find({}).sort({_id:-1});
        const productData = await productInfo.aggregate([
            {
                $sort: { _id: -1 }
            },
            {   $skip: (page - 1) * limit },
            {   $limit: limit * 1 }
        ]);

        let totalCount = 0
        if(productData.length > 0){
            totalCount = await productInfo.aggregate([
                {
                    $group:{
                        _id:null,
                        totalCount:{$sum:1}
                    }
                }
            ]);
    
            totalCount = Math.ceil(totalCount[0].totalCount / limit)
        }


        if(checkLogin){
        
            const cart = await cartData.find({userId:userId});
            const wishlist = await wishlistData.find({userId:userId});

            res.render('allProductView',{ user: true,
                login:checkLogin, 
                title: 'Products',
                toalProduct:true ,
                product:productData, 
                wishlistData:wishlist, 
                dataCart:cart , 
                categoryData:categoryInfo, 
                brandData:brand , 
                totalPages:totalCount, 
                pageNo:page
            });
            return;

        }

        res.render('allProductView',{ 
            user: true,
            login:checkLogin, 
            title: 'Products',
            product:productData,
            toalProduct:true ,
            categoryData:categoryInfo, 
            brandData:brand, 
            totalPages:totalCount, 
            pageNo:page
        });

    } catch (error) {

        next(error);
    }
}


// SHOP PAGE PRODUCT FILTER
const productFilterData = async(req, res, next) => {
    try {
        const checkLogin = req.session.userId ? true : false;


        // RETRIEVE THE DATA FROM CLIENT 
        const filterCategorys = req.query.category;
        const filterBrands = req.query.brand;
        const filterPrice = req.query.price;
        const search = req.query.search;
        const page = req.query.page ? parseInt(req.query.page) : 1 ;
        const sort = req.query.sort;

        // RETRIEVE BRAND AND CATEGORY DATA FOR SEARCH REAULT PAGE SIDE SETTING THE DATA
        const categoryInfo = await category.find({},{categoryname:1});
        const brand = await brandInfo.find({},{brand_name:1});

        const limit = 8;

        // AGGREGATION PIPELINE CREATION FUNCTION FUNCTION PLACED BELOW
        let pipeline = filterPipLine(filterCategorys,filterBrands,filterPrice,categoryInfo,brand,page,search,sort);
    
        
        // RETRIEVE PRODUCT DATA
        const productData = await productInfo.aggregate(pipeline);


        // IF THE PRODUCT EXIST CALCULATE THE DOCUMENT COUNT
        let totalCount;
        if(productData){

            pipeline = pipeline.slice(0, pipeline.length - 2)

            pipeline = pipeline.concat([
                {
                    $group:{
                        _id:null,
                        totalCount:{$sum:1}
                    }
                }
            ]);

            totalCount = await productInfo.aggregate(pipeline);
        }

        // IF TOTAL COUNT EXIST IT WILL SEND THE RESPONSE WITH THIS DATA OTHER WISE ANOTHER RESPONSE
        if(totalCount.length != 0){

            totalCount = Math.ceil(totalCount[0].totalCount / limit);
            res.render('allProductView',{ 
                user: true,
                login:checkLogin, 
                title: 'Products' , 
                url:req.url, 
                product:productData, 
                categoryData:categoryInfo, 
                brandData:brand, 
                totalPages:totalCount, 
                pageNo:page, 
                searchCategorys:filterCategorys, 
                searchBrand:filterBrands, 
                searchPrice:filterPrice
            });

        }else{
            res.render('allProductView',{ 
                user: true,
                login:checkLogin, 
                title: 'Products', 
                url:req.url, 
                product:productData, 
                categoryData:categoryInfo, 
                brandData:brand,
                searchCategorys:filterCategorys, 
                searchBrand:filterBrands, 
                searchPrice:filterPrice
            });
        }

    } catch (error) {
        next(error)
    }
}


// FILTER AGGREGATION PIPLINE CREATION
function filterPipLine(filterCategorys,filterBrands,filterPrice,categoryInfo,brand,page,search,sort){

    let pipeline = [];

    let limit = 8;

    // QUERY TO GET FILTER DATA FOR CATEGORY IS DONE WITH THIS STATEMENT
    if (filterCategorys) {

        const categoryIdArray = filterCategorys ? filterCategorys.split(',').map(id => new mongoose.Types.ObjectId(id)) : [];

        pipeline.push({
          $match: {
            categoryIds : { $in: categoryIdArray }
          }
        });
    }

    // BRAND FILTERING AGGREAGATION PIPLINE CREATION
    if (filterBrands) {

        const brandIdArray = filterBrands ? filterBrands.split(',').map(id => new mongoose.Types.ObjectId(id)) : [];

        pipeline.push({
          $match: {
            brandname : { $in: brandIdArray }
          }
        });
    }


    // FILTER PROCE AGGREAGATION PIPLINE CREATION
    if (filterPrice) {
        const priceFilter = {};

        const priceData = filterPrice.split('-');
        minPrice = parseInt(priceData[0]);
        maxPrice = parseInt(priceData[1]);
      
        if (minPrice) {
          priceFilter.$gte = minPrice;
        }
      
        if (maxPrice) {
          priceFilter.$lte = maxPrice;
        }
      
        pipeline.push({
          $match: {
            price : priceFilter
          }
        });
    }


    // SEARCH DATA ADDED TO PIPELINE
    if(search){
        pipeline.push({
            $match: {
                productName : { $regex: search, $options: 'i' } 
            }
          });
    }


    // SORTING
    if(sort != 0){
        pipeline.push({
            $sort: {
                price: parseInt(sort)
            }
        });
    }else{
        pipeline.push({
            $sort: {
                _id: -1
            }
        });
    }

    
      // Add additional aggregations 
      pipeline = pipeline.concat([
        {   $skip: (page - 1) * limit },
        {   $limit: limit * 1 }
    ]);

    return pipeline;
      
}





// ******* LOADING SPECIFIC CATEGORY PRODUCT DATA VIEW ******
const loadSpecificCategoryProducts = async(req, res, next) => {
    try {
        const checkLogin = req.session.userId ? true : false;

        const id = req.query.id;
        const productData = await productInfo.find({ categoryIds:id}).sort({_id:-1});

        const categoroys = await category.find({});
        const brands = await brandInfo.find({});
        
        res.render('allProductView',{ 
            user: true,
            login:checkLogin, 
            title: 'Products',
            product:productData ,
            categoryData:categoroys , 
            brandData:brands
        });

    } catch (error) {
        next(error);
    }

}



// ******** LOAD USER PROFILE PAGE *****
const loadUserProfile = async function(req, res, next){
    try {
        const checkLogin = req.session.userId ? true : false;

        const id = req.session.userId;
        const data = await userData.findOne({_id:id});
        if(data){
            res.render('userProfile',{
                user:true, 
                login:checkLogin, 
                userInfo:data, 
                title:'User Profile'
            });

        }else{
            throw new Error('Not Found error');
        }
    } catch (error) {
        next(error);
    }
        
    
}



// ****** EDIT USER INFORMATIONS ******
const editUserInformations = async(req, res, next) => {
    try {
        const checkLogin = req.session.userId ? true : false;

        const data = req.body;
        
        const conditions = {_id:data.id};
        const update = {$set:{username:data.name,phonenumber:data.number}};

        const updateData = await userData.findOneAndUpdate(conditions,update,{ new: true });
        if(updateData){
            res.json({updateData:updateData,status:true})
        }else{
            throw new Error('Not Found error')
        }

    } catch (error) {
        next(error)
    }
        
    
}



// ****** LOAD ADDRESS INFORMATION AND VIEW ADDRESS IN THAT USER *****
const loadAddressInformation = async(req, res, next)=>{
    try {
        const checkLogin = req.session.userId ? true : false;

        const id = req.session.userId;

        const addressData = await addressInfo.find({userId:id});

        if(addressData){
            res.render('addressInformation',{
                title:'Address', 
                login:checkLogin, 
                user: true, 
                login:checkLogin, 
                address:addressData
            });
        }else{
            throw new Error('Not Found Error');
        }      
    } catch (error) {
        next(error)
    }


}


// ***** VIEW ADD ADDRESS FORM PAGE ******
const loadAddressForm = async(req, res, next)=>{
    try {  

        const checkLogin = req.session.userId ? true : false;
        res.render('addressForm',{ 
            title:'Add New Address' ,
            login:checkLogin ,
            user: true,
            login:checkLogin
        });
        
    } catch (error) {
        next(error);
    }
}


// ***** ADDRESS FORM DATA STORE TO THE DATVBASE *****
const storeAddressFormData = async(req, res, next) => {
    try {
        const userId = req.session.userId;
        const formData = req.body;

        const conditions = formData.Name != '' && formData.MobileNumber != '' && formData.Pincode != '' && formData.Locality != '' && formData.Address != '' && formData.City != '' && formData.District != '' ;

        if(conditions){

            const addressData = addressInfo({
                userId:userId,
                username:formData.Name,
                phoneNumber:formData.MobileNumber,
                pincode:formData.Pincode,
                locality:formData.Locality,
                address:formData.Address,
                city:formData.City,
                district:formData.District,
                landmark:formData.Landmark,
                alternateNumber:formData.AlteranteNumber,
            })

            
            const store = await addressData.save();
            if(store){

                res.json({status:true, data:'Address Added Sucesfully'});

            }else{
                throw new Error('Failed to Add Data');
            }

        }else{
            res.json({status:false, data:'Address Adding is failed You can Enter All Field'});
        }

    } catch (error) {
        next(error);
    }
}




// ***** VIEW EDIT ADDRESS FORM PAGE *****
const loadEditAddressForm = async(req, res, next) =>  {
    try {
        const checkLogin = req.session.userId ? true : false;

        const addressId = req.params.id;

        const addressData = await addressInfo.findOne({_id:addressId});
        if(addressData){

            if(req.query.url){
                res.render('checkoutEditAddress',{ 
                    title:'Update Address' ,
                    login:checkLogin , 
                    user: true, 
                    login:checkLogin, 
                    address:addressData
                });
                return;
            }

            res.render('editAddress',{ 
                title:'Update Address' ,
                login:checkLogin , 
                user: true, 
                login:checkLogin, 
                address:addressData
            });
        }else{
            throw new Error('Data Is Not Found')
        }
    } catch (error) {
        next(error);
    }
}



// **** UPDATE ADDRESS DATA ****
const updateAddressData = async(req, res, next)=>{
    try {
        const data = req.body;

        if(data){

            const update = await addressInfo.updateOne({_id:data.addressId},{$set:{
                username:data.Name,
                phoneNumber:data.MobileNumber,
                pincode:data.Pincode,
                locality:data.Locality,
                address:data.Address,
                city:data.City,
                district:data.District,
                landmark:data.Landmark,
                alternateNumber:data.AlteranteNumber,
            }});

            if(update.acknowledged){
                res.json({status:true, data:'Address Updated Sucesfully'});
            }else{
                res.json({status:false, data:'Update Address is failed You can Enter All Field'});
            }

        }else{

            res.json({status:false, data:'Update Address is failed You can Enter All Field'});
        } 
    } catch (error) {
        next(error);
    }  
}




// ***** DELETE ADDRESS *****
const deleteAddress = async(req, res, next) =>{
    try {
        const id = req.params.id;

        const deleteAddress = await addressInfo.deleteOne({_id:id});

        if(deleteAddress){
            res.json({status:true});
        }else{
            throw new Error('Data Not Found');
        }
    } catch (error) {
        next(error);
    }
}

// **** Edit Password 
const editPassword = async(req, res, next)=>{
    
    try{

        const userId = req.session.userId;
        const data = req.body;

        const user = await userData.findOne({_id:userId});

        const check = await bcrypt.compare(data.currentPassword,user.password);
        
        if(!check){
            res.json({status:false});
        }else{
            
            const strongPassword = await securePassword(data.newPassword);

            const updatePassword = await userData.updateOne({_id:userId},{$set:{password:strongPassword}});

            if(updatePassword){
                res.json({status:true})
            }else{
                throw new Error('Data Not Found');
            }
        }

    }catch(error){
        next(error)
    }
    

}

const loadWalletPage = async(req, res, next) => {
    try {
        const checkLogin = req.session.userId ? true : false;

        const userId = req.session.userId;

        const walletData = await userData.aggregate([
            {
                $match: {_id:new mongoose.Types.ObjectId(userId)}
            },
            {
                $unwind:'$walletTransaction'
            },
            {
                $project:{
                    _id:0,
                    walletAmount:1,
                    walletTransaction:1
                }
            }
        ])

        if(walletData){

            res.render('wallet',{ title:'Wallet' ,login:checkLogin ,user: true, dataWallet:walletData});

        }else{
            throw new Error('server Error');
        }

    } catch (error) {
        next(error)
    }
}



const addWalletAmount = async(req, res, next) => {
    try {
        const amount = req.body.amount;

        const customID = await generateRandomOtp(8);
  

        // Razor Pay Payment Instance Generation
            var options = {
                amount: parseInt(amount* 100) ,  // amount in the smallest currency unit
                currency: "INR",
                receipt: customID.toString('hex')
            };
            instance.orders.create(options, function(err, order) {
                    res.json({sucess:true,data:order});
            });

    } catch (error) {
        next(error);
    }
}


const walletPaymentVerification = async(req, res, next) => {

    const data = req.body;
    
    const userId = req.session.userId;

    const transaction = {
        transactionId:data.Payment.razorpay_payment_id,
        transactionType:'Debit',
        description:'Amount Added',
        amount:data.walletReceipt.amount/100,
    }

    const updateWalletAmount = await userData.updateOne({_id:userId},{ $inc: { walletAmount: data.walletReceipt.amount/100 } },{ upsert: true });

    const updateWalletTransaction = await userData.updateOne({_id:userId},{ $push: { walletTransaction: transaction } },{ upsert: true });
    
    if(updateWalletAmount && updateWalletTransaction){
        res.json({sucess:true})
    }else{
        res.json({sucess:false})
    }
}


const loadAboutPage = async(req , res , next) => {
    try {

        const categorys = await category.countDocuments({});
        const users = await userData.countDocuments({});
        const brands = await brandInfo.aggregate([
                {
                    $match: {
                        status: true
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalStatusTrue: { $sum: 1 },
                        brands: {
                        $push: {
                            brand_name: '$brand_name',
                            brand_logo: '$brand_logo'
                        }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalStatusTrue: 1,
                        brands: 1
                    }
                },
                {
                    $unwind:"$brands"
                }
        ]);

        const orderSucess = await orderData.aggregate([
            {
                $unwind: "$productInforamtion"
            },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalDeliveredProducts: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$productInforamtion.orderStatus", "Delivered"] },
                        then: "$productInforamtion.productquantity",
                        else: 0
                      }
                    }
                  }
              }
            }
        ]);

        let orderSucessRate = 0;
        if(orderSucess.length > 0){
            orderSucessRate = ( orderSucess[0].totalDeliveredProducts / orderSucess[0].totalOrders ) * 100;
        }


        res.render('about',{ 
            title:'About' ,
            user: true ,
            categoryCount:categorys,
            userCount:users,
            brandData:brands,
            orderSucessRate:orderSucessRate
        });
        
    } catch (error) {
        next(error)
    }
} 



// ABOUT PAGE LOADING
const loadContactPage = (req, res, next) => {
    try {
        res.render('contact',{ title:'Contact' ,user: true });
    } catch (error) {
        next(error);
    }
}


/* =============================================== ERROR HANDLING PAGES ==================================================== */


// ***** 500 - ERROR PAGE LOADING *****
const load500ErrorPage = (req, res) => {
    throw new Error('Server Error');
}


// ****  404 - ERROR PAGE LOADING  *****
const load404ErrorPage = (req, res) => {
    throw new Error('Server Error');
}





/* ####################################### MODUE EXPORTS FOR THE ROUTER ############################################ */

module.exports = {
    guestPage,
    googleAuthenticationSucess,
    googleAuthenticationFailed,
    LoadUserRegistrationPage,
    userLogout,
    loadUserLogin,
    LoadforgotPasswordPage,
    submitForgotPasswordEmail,
    loadResetPasswordPage,
    passwordChange,
    storeSignupData,
    loadOTPVerification,
    resendOTP,
    OTPCheck,
    verifyUser,
    loadHomePage,
    loadAddressInformation,
    loadUserProfile,
    editPassword,
    storeAddressFormData,
    updateAddressData,
    deleteAddress,
    loadEditAddressForm,
    loadAllProductViewPage,
    productFilterData,
    loadSpecificCategoryProducts,
    loadProductDetailPage,
    editUserInformations,
    loadWalletPage,
    addWalletAmount,
    walletPaymentVerification,
    loadUserProfile,
    loadAddressForm,
    load500ErrorPage,
    load404ErrorPage,
    loadAboutPage,
    loadContactPage
}






