const addressData = require('../models/addressModel');
const {productInfo} = require('../models/productModel');
const {userData} = require('../models/userModal');
const orderData = require('../models/orderModel');
const cartData = require('../models/cartModel');
const couponData = require('../models/couponModel');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { chown } = require('fs');


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



const LoadCheckoutPage = async(req, res, next) => {

    try{

        const checkLogin = req.session.userId ? true : false;

        const userId = req.session.userId;
        const addressInfo = await addressData.find({userId:userId});
        const walletAmount = await userData.findOne({_id:userId},{_id:0,walletAmount:1});

        const coupons = await couponData.aggregate([
            {
                $match:{
                    startDate:{$lte: new Date()},
                    endDate:{$gte: new Date()},
                    is_Delete:false,
                    AppliedUsers:{
                        $not: {
                            $elemMatch: { $eq:new mongoose.Types.ObjectId(userId) }
                        }
                    }

                }
            }
        ]);


        if(req.query.single){

            const productId = req.query.id;

            const productData = await productInfo.findOne({_id:productId});
        
            res.render('user/checkout',{user:true, title:'CheckOut', login:checkLogin, address:addressInfo, product:productData ,single:true, couponData:coupons, wallet:walletAmount.walletAmount});

        }else{

            const cartProduct = await cartData.findOne({userId:userId}).populate('cartProducts.productId')
            const productData = cartProduct.cartProducts;
     
            res.render('user/checkout',{user:true, title:'CheckOut', login:checkLogin, address:addressInfo, cartProduct:productData ,single:false, couponData:coupons ,wallet:walletAmount.walletAmount});
        }

    }catch(error){
        next(error)
    }

}




const PlaceOrder = async(req, res, next)=>{

    try {

        const userId = req.session.userId;
        
        const data = req.body;


    
        // **** Address Information Setting in the Order ****
        const addressInfo = await addressData.findOne({_id:data.Address});
        const address = {
            username:addressInfo.username,
            phonenumber:addressInfo.phoneNumber,
            pincode:addressInfo.pincode,
            locality:addressInfo.locality,
            address:addressInfo.address,
            city:addressInfo.city,
            district:addressInfo.district,
            landmark:addressInfo.landmark,
            alternateNumber:addressInfo.alternateNumber,
        }

        // COUPON CHECKING ORDER HAS COUPON HAS APPIED OR NOT
        let couponStatus = false;
        let coupon;
        if(data.couponStatus){
            coupon = await couponData.aggregate([
                {
                    $match:{
                        _id:new mongoose.Types.ObjectId(data.couponId),
                        startDate:{$lte: new Date()},
                        endDate:{$gte: new Date()},
                        is_Delete:false
                    }
                }
            ]);

            if(coupon.length <= 0){
                res.json({couponError:true});
            }else{
                couponStatus = true;
            }
        }

        // **** Product Data Storing Section Else Part Cart Order**** 
        let productData;
        let products;
        let totalPrice = 0;
        const userWallet = await userData.findOne({_id:userId});

        if(data.SingleProduct){

            productData = await productInfo.findOne({_id:data.ProductId});


            // CHECKING STOCK IS AVAILABLE OR NOT
            if(productData.stock >= data.productQuantity ){

                // PRODUCT DATA STORING OBJECT CREATION
                products = {
                    productId:data.ProductId,
                    productPrice:data.ProductPrice,
                    productTotalAmount:(data.productQuantity * data.ProductPrice),
                    MRP:data.ProductPrice,
                    productquantity:data.productQuantity
                }

                // COUPON APPLY TIME PRODUCT AMOUNT DETAILS STROING
                let totalDiscountAmount;
                if(couponStatus){
                    totalDiscountAmount = parseInt( ( coupon[0].minimumPurchase * coupon[0].OfferPercentage ) / 100 );
                    const discountForTheProduct =  parseInt( ( data.ProductPrice * totalDiscountAmount ) / products.productTotalAmount );
                    products.productPrice = data.ProductPrice - discountForTheProduct;
                    products.productTotalAmount -= totalDiscountAmount; 
                    products.discountAmount = discountForTheProduct;
                    totalPrice = (data.productQuantity * data.ProductPrice) - totalDiscountAmount;
                }else{
                    totalPrice = (data.productQuantity * data.ProductPrice) ;
                }



                // Payment Status Setting In Wallet Payment
                if(data.PaymentMethod == 'Wallet'){
        
                    if(userWallet.walletAmount < products.productTotalAmount){
                        res.json({walletInsufficient:true});
                        return;
                    }else{
                        
                        products.paymentStatus = 'Paid';
                    }
                }

    
            }else{
                res.json({StockStatus:false, singleStock:false, quantity:productData.stock});
                return;
            }

        }else{

            // PRODUCT STOCKING CODE RETURN IN THE END OF THIS FILE 
            const stockChecking = await checkStock(userId);

            if(stockChecking){

                const cartInfo = await cartData.findOne({userId:userId},{cartProducts:1});

                // ORDER PRODUCT DATA STORING OBJECT CREATAION
                products = cartInfo.cartProducts.map(item => ({
                    productId: item.productId,
                    productPrice:item.price,
                    MRP:item.price,
                    productTotalAmount: (item.price * item.quantity),
                    productquantity:item.quantity
                }));

                products.map((val) => {
                    totalPrice += val.productTotalAmount
                });

                // ORDER HAVE EXISTING THE COUPON CALCULATE THE DISCOUNT OFFER FOR APPLY COUPO AND CALCULATING THE PRICE
                if(couponStatus){
                    const totalDiscountAmount = parseInt((coupon[0].minimumPurchase * coupon[0].OfferPercentage)/100);
                
                    let discountForThatProduct ;
                    products.map((value) => {
                        discountForThatProduct = parseInt( ( value.productPrice * totalDiscountAmount ) / totalPrice );
                        value.productPrice = value.productPrice - discountForThatProduct;
                        value.productTotalAmount = value.productquantity * value.productPrice; 
                        value.discountAmount = discountForThatProduct;
                        totalPrice -= (value.productquantity * value.discountAmount)
                    });
                }


                // Payment Wallet Payment Status Setting
                if(data.PaymentMethod == 'Wallet'){
        
                    if(userWallet.walletAmount < totalPrice){
                        res.json({walletInsufficient:true});
                        return;
                    }else{
                        products.map((val) => {
                            val.paymentStatus = 'Paid';
                        });
                    }
        
                }


            }else{
                res.json({status:false, stock:false});
                return; 
            }        
        }

        


        // const { customAlphabet } = await import('nanoid');

        // const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        // const idLength = 8;
        // const nanoid = customAlphabet(alphabet, idLength);

        const uniqueID = String(await generateId(8));


        // **** ORDER DATA STORING IN TO THE DB ****
        const orderSucess = orderData({
            addressInformation:address,
            productInforamtion:products,
            userId:userId,
            order_id:uniqueID,
            totalAmount:totalPrice,
            paymentMethod:data.PaymentMethod,
        });


        // COUPON EXIST DATA ADDED TO ORDER DOCUMENT
        if(couponStatus){
            orderSucess.couponId = coupon[0]._id;
            orderSucess.couponOfferPercentage = coupon[0].OfferPercentage;
        }

        const orderStore = await orderSucess.save();


        // **** STOCK MANAGEMENT IN EACH PRODUCT ON THE UPDATE IF TRUE SECTION HANDLE SINGLE PRODUCT ****
        if(orderStore && data.SingleProduct){
            console

            if(couponStatus){
                const couponUpdate = await couponData.updateOne({_id:orderSucess.couponId},{$set:{AppliedUsers:userId}},{upsert:true});
            }

            // STOCK UPDATE IN THAT PRODUCT
            const stockUpdate = await productInfo.updateOne({_id:data.ProductId},{$inc:{stock:-data.productQuantity}});
         
            if(stockUpdate){
                
                //ORDER SUCESS RESULT SENDING ORDER OF COD , ONLINE PAYMENT , WALLET
                if(orderSucess.paymentMethod == 'COD'){

                    res.json({CODSuccess:true,orderId:orderSucess._id});

                }
                else if(orderSucess.paymentMethod == 'OnlinePayment'){


                    // RAZORPAY INSTANCE CREATE AND RAZORPAY GENERATE3
                    var options = {
                        amount: orderSucess.totalAmount * 100 ,  // amount in the smallest currency unit
                        currency: "INR",
                        receipt: orderSucess._id
                      };
                      instance.orders.create(options, function(err, order) {
                            res.json({OnlinePayment:true,order:order})
                      });

                }else if(orderSucess.paymentMethod == 'Wallet'){
                    
                    // const nanoidModule = await import('nanoid');
                    // let nanoid = nanoidModule.nanoid;

                    const uniqueID = String(await generateId(8));

                    const transaction = {
                        transactionId:uniqueID,
                        transactionType:'Credit',
                        description:'Product Ordered',
                        amount:orderSucess.totalAmount,
                        orderId:orderSucess._id
                    }
                    
                    const creditAmount = await userData.updateOne({_id:userId},{ $inc: { walletAmount: -orderSucess.totalAmount } },{ upsert: true });
                    const updateWalletTransaction = await userData.updateOne({_id:userId},{ $push: { walletTransaction: transaction } },{ upsert: true });

                    // WALLET PAYMENT AND AMOUNT UPDATE SUCESSSFULL
                    if(creditAmount && updateWalletTransaction ){

                        res.json({walletPayment:true,orderId:orderSucess._id});

                    }else{

                        res.json({failed:true});

                    }

                }

            }else{
                res.json({failed:true});
            }

        }else{

            if(couponStatus){
                const couponUpdate = await couponData.updateOne({_id:orderSucess.couponId},{$set:{AppliedUsers:userId}},{upsert:true});
            }


            // STOCK MANAGEMENT IN CART PRODUCTS
            let stockUpdate;
            for(let item of products){
                const filter = {_id:item.productId}
                const update = {$inc:{stock:-item.productquantity}};

                stockUpdate = await productInfo.updateOne(filter,update);
            }

            // DELETE THE CART DATA
            const deleteCart = await cartData.deleteOne({userId:userId});
            const userCartId = await userData.updateOne({_id:userId},{ $unset: { cartProducts: 1 } });
            
            if(stockUpdate && deleteCart && userCartId){

                // ORDER SUCCESS MESSAGE SENDING
                if(orderSucess.paymentMethod == 'COD'){

                    res.json({CODSuccess:true,orderId:orderSucess._id});

                }
                else if(orderSucess.paymentMethod == 'OnlinePayment'){

                    var options = {
                        amount: orderSucess.totalAmount * 100 ,  // amount in the smallest currency unit
                        currency: "INR",
                        receipt: orderSucess._id
                      };
                      instance.orders.create(options, function(err, order) {
                            res.json({OnlinePayment:true,order:order})
                      });

                }else if(orderSucess.paymentMethod == 'Wallet'){
                    
                    // const nanoidModule = await import('nanoid');
                    // let nanoid = nanoidModule.nanoid;

                    const uniqueID =  String( await generateId(8));

                    const transaction = {
                        transactionId:uniqueID,
                        transactionType:'Credit',
                        description:'Product Ordered',
                        amount:orderSucess.totalAmount,
                        orderId:orderSucess._id
                    }

                    const returnAmount = await userData.updateOne({_id:userId},{ $inc: { walletAmount: -orderSucess.totalAmount } },{ upsert: true });
                    const updateWalletTransaction = await userData.updateOne({_id:userId},{ $push: { walletTransaction: transaction } },{ upsert: true });

                    if(returnAmount && updateWalletTransaction){
                        res.json({walletPayment:true,orderId:orderSucess._id});
                    }else{
                        res.json({failed:true});
                    }

                }

            }else{
                res.json({status:false});
            }
        }


    } catch (error) {
        next(error);
    }
}


// PAYMENT VERIFICATION IN RAZORPAY
const paymentVerification  = async(req,res) => {
    
    const payment = req.body.Payment;
    const orderInfo = req.body.orderReceipt;
  
    // CHECK ORDER SUCESS RESULT
    let hmac = crypto.createHmac('sha256', process.env.PAYMENT_INTEGRATION_KEY_SECRET);
    hmac.update(payment.razorpay_order_id+"|"+payment.razorpay_payment_id);
    hmac = hmac.digest('hex');
    if(hmac == payment.razorpay_signature){

        // UPDATING THE ORDER STATUS
        const order = await orderData.findById(orderInfo.receipt);
        const productPaymentUpdate = order.productInforamtion.forEach((product) => {
            product.paymentStatus = 'Paid';
        });

        const updateStatus = await order.save();
        
        if(updateStatus){
            res.json({onlinePaymentStaus:true,orderId:orderInfo.receipt});
        }

    }else{
        console.log('failed')
    }
}



const loadOrderSucess = async(req, res, next)=>{
    try {
        const checkLogin = req.session.userId ? true : false;

        const orderId = req.query.orderId;
        const orderDetails = await orderData.findOne({_id:orderId}).populate('productInforamtion.productId');

        if(orderDetails){
            res.render('user/orderPlacedSucess',{user:true, title:'CheckOut', login:checkLogin, order:orderDetails});
        }else{
            throw new Error('Data Not Found');
        }
    } catch (error) {
        next(error)
    }
}




/* ------------------------------------------------- FUNCTIONS ---------------------------------------- */

// ######### Function in Checkout Controller Stock Check ######
async function checkStock(userId){
    const cartItems = await cartData.aggregate([
        {
            $match:{
                userId: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $unwind:'$cartProducts'
        },
        {
            $lookup:{
                from:'products',
                localField:'cartProducts.productId',
                foreignField:'_id',
                as:'productData'
            }
        }
    ]);

    let checkStock = true;
    cartItems.forEach(products => {
        if(products.cartProducts.quantity > products.productData[0].stock){
            checkStock = false;
        }
    });

    return checkStock;
}



module.exports = {
    LoadCheckoutPage,
    PlaceOrder,
    paymentVerification,
    loadOrderSucess
}