const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { userData } = require('../models/userModal');
const { productInfo } = require('../models/productModel');
const { brandInfo } = require('../models/brandModel');
const { category } = require('../models/categoryModel');
const cartData = require('../models/cartModel');
const wishlistData = require('../models/wishlistModel');
const addressInfo = require('../models/addressModel');
const { userInfo } = require('os');
const { error } = require('console');
const { chownSync } = require('fs');
const { threadId } = require('worker_threads');





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
        console.log(error.message);
    }
}








/* ################################################ ROUTER HANDLING FUNCTIONS ################################################# */




/* ======================= USER LOGIN AND REGISTER ===================== */


// ***** USER LOGIN PAGE VIEW *****
const loadUserLogin = (req, res, next) => {
    try {
        res.render('user/userAuthentication', { admin: false, title: 'User' }); 
    } catch (error) {
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
}



//****** STORING USER REGISTER TIME DATA TO SESSION AND SEND A OTP MAIL ******
const storeSignupData = async (req, res, next) => {

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
        next(error);
    }
}




// ***** VIEW THE OTP VERIFICATION PAGE *****
const loadOTPVerification = (req, res, next) => {
    try {
        const userdata = req.session.userData;
        const time = req.session.startTime;
        res.render('user/otpVerification', { admin: false, title: 'User OTP', email: userdata.email, timer: time });
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
        await sendEmail(user.username, user.email, otp,html)
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
    } catch (error) {
        next(error)
    }
    
}





// **** LOGIN USER DATA VERIFY AND PROVIDE THE HOME PAGE ****
const verifyUser = async(req, res, next) => {
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
        next(error);
    }
    
}



// *** VIEW THE USER HOME PAGE *****
const loadHomePage = async (req, res, next) => {

    try {

        const checkLogin = req.session.userId ? true : false;

        // UserId Taken From The Session
        const id = req.session.userId;
       

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

        const cart = await cartData.findOne({userId:id});

        const wishlist = await wishlistData.findOne({userId:id});
    

        res.render('user/index', { user: true,login:checkLogin,  title: 'Brand Unlimited', dataCategory: categoryData, dataProduct: productData ,dataCart:cart, wishlistData:wishlist});

    } catch (error) {
        next(error);
    }

}





// =====================================   PRODUCT PAGES AND GUEST PAGE HANDLING   ==========================================


// **** GUEST PAGE LOADING FOR EVERY USERS ****
const guestPage = async (req, res, next) => {
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
        next(error);
    }
}



// **** EACH PRODUT DETAIL VIEW DISPLAY PAGE LOADING *****
const loadProductDetailPage = async (req, res, next) => {
    try {

        const checkLogin = req.session.userId ? true : false;
        const id = req.query.id;

        let brandData = await brandInfo.find({},{brand_name:1});
        console.log(id,brandData)

        const productData = await productInfo.findOne({ _id: id });
        const categoryData = await category.find({});
        console.log('product',productData);
        console.log('category',categoryData)

        const cart = await cartData.findOne({cartProducts:{$elemMatch:{productId:id}}});
        console.log('cart',cart)

        const wishlist = await wishlistData.findOne({userId:req.session.userId});
        console.log('wishlist',wishlist);



        for(let brand of brandData){
            if(brand._id.equals(productData.brandname))
                brandData = brand.brand_name
        }
       
        res.render('user/productDetails', { user: true,login:checkLogin,title: 'Products', product:productData ,category:categoryData, dataBrand:brandData ,dataCart:cart, wishlistData:wishlist})


    } catch (error) {
        next(error);
    }

}



// ***** LOAD ALL PRODUCT DATA VIEW PAGE ******
const loadAllProductViewPage = async(req, res, next) =>{
    
    try {

        const checkLogin = req.session.userId ? true : false;

        const userId = req.session.userId;

        const categoryInfo = await category.find({},{categoryname:1});

        const brand = await brandInfo.find({},{brand_name:1});

        const productData = await productInfo.find({}).sort({_id:-1});

        if(checkLogin){
        
            const cart = await cartData.find({userId:userId});
            const wishlist = await wishlistData.find({userId:userId});
            console.log(cart,wishlist)

            res.render('user/allProductView',{ user: true,login:checkLogin, title: 'Products', product:productData, wishlistData:wishlist, dataCart:cart , categoryData:categoryInfo, brandData:brand});
            return;

        }

        res.render('user/allProductView',{ user: true,login:checkLogin, title: 'Products',product:productData, categoryData:categoryInfo, brandData:brand});

    } catch (error) {

        next(error);
    }
}



// ******* LOADING SPECIFIC CATEGORY PRODUCT DATA VIEW ******
const loadSpecificCategoryProducts = async(req, res, next) => {
    try {
        const checkLogin = req.session.userId ? true : false;

        const id = req.query.id;
        const productData = await productInfo.find({ categoryIds:id}).sort({_id:-1});
    
        res.render('user/allProductView',{ user: true,login:checkLogin, title: 'Products',product:productData});
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
            res.render('user/userProfile',{user:true, login:checkLogin, userInfo:data, title:'User Profile'});
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
            res.render('user/addressInformation',{title:'Address', login:checkLogin, user: true, login:checkLogin, address:addressData});
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
        res.render('user/addressForm',{ title:'Add New Address' ,login:checkLogin ,user: true,login:checkLogin});
        
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
                res.render('user/checkoutEditAddress',{ title:'Update Address' ,login:checkLogin , user: true, login:checkLogin, address:addressData});
                return;
            }

            res.render('user/editAddress',{ title:'Update Address' ,login:checkLogin , user: true, login:checkLogin, address:addressData});
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
    loadAddressInformation,
    loadUserProfile,
    editPassword,
    storeAddressFormData,
    updateAddressData,
    deleteAddress,
    loadEditAddressForm,
    loadAllProductViewPage,
    loadSpecificCategoryProducts,
    loadProductDetailPage,
    editUserInformations,
    loadUserProfile,
    loadAddressForm,
    load500ErrorPage,
    load404ErrorPage
}






