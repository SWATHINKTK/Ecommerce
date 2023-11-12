const addressData = require('../models/addressModel');
const {productInfo} = require('../models/adminModel');
const {userData} = require('../models/userModal');
const orderData = require('../models/orderModel');
const cartData = require('../models/cartModel');


const LoadCheckoutPage = async(req, res, next) => {

    try{

        const checkLogin = req.session.userId ? true : false;

        const userId = req.session.userId;
        const addressInfo = await addressData.find({userId:userId});

        if(req.query.single){

            const productId = req.query.id;

            const productData = await productInfo.findOne({_id:productId});
            // console.log(productData,productData.length)
        
            res.render('user/checkout',{user:true, title:'CheckOut', login:checkLogin, address:addressInfo, product:productData ,single:true});

        }else{

            const cartProduct = await cartData.findOne({userId:userId}).populate('cartProducts.productId')
            const productData = cartProduct.cartProducts;
            // console.log(productData,productData.length)
            res.render('user/checkout',{user:true, title:'CheckOut', login:checkLogin, address:addressInfo, cartProduct:productData ,single:false});
        }

    }catch(error){
        next(error)
    }

}


const PlaceOrder = async(req, res, next)=>{

    try {

        const userId = req.session.userId;
        
        const data = req.body;
    
        const addressInfo = await addressData.findOne({_id:data.Address});

        let productData;
        if(data.SingleProduct){
            productData = await productInfo.findOne({_id:data.ProductId});
        }


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

        let paymentStatus;
        if(data.PaymentMethod == 'COD'){
            paymentStatus = 'Pending';
        }else{
            paymentStatus = 'Processing';
        }
        
        let products;
        let totalPrice = 0;
        if(data.SingleProduct){

            products = {
                productId:data.ProductId,
                productPrice:data.ProductPrice,
                productTotalAmount:(data.productQuantity * data.ProductPrice),
                productquantity:data.productQuantity
            }
            totalPrice = data.productQuantity * data.ProductPrice;

        }else{

            const cartInfo = await cartData.findOne({userId:userId},{cartProducts:1});
            products = cartInfo.cartProducts.map(item => ({
                productId: item.productId,
                productPrice:item.price,
                productTotalAmount: (item.price * item.quantity),
                productquantity:item.quantity
            }));
            products.map((val) => {
                totalPrice += val.productTotalAmount
            })         
        }


        const orderSucess = orderData({
            addressInformation:address,
            productInforamtion:products,
            userId:userId,
            totalAmount:totalPrice,
            paymentMethod:data.PaymentMethod,
            paymentStatus:paymentStatus
        })

        const orderStore = await orderSucess.save();

        if(orderStore && data.SingleProduct){
            const stockUpdate = await productInfo.updateOne({_id:data.ProductId},{$inc:{stock:-data.productQuantity}});
         
            if(stockUpdate){

                res.json({status:true,orderId:orderSucess._id});
            }else{
                res.json({status:false});
            }
        }else{

            let stockUpdate;
            for(let item of products){
                const filter = {_id:item.productId}
                const update = {$inc:{stock:-item.productquantity}};

                stockUpdate = await productInfo.updateOne(filter,update);
            }

            const deleteCart = await cartData.deleteOne({userId:userId});
            const userCartId = await userData.updateOne({_id:userId},{ $unset: { cartProducts: 1 } });
            
            if(stockUpdate && deleteCart && userCartId){

                res.json({status:true,orderId:orderSucess._id});
            }else{
                res.json({status:false});
            }
        }


    } catch (error) {
        next(error);
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



module.exports = {
    LoadCheckoutPage,
    PlaceOrder,
    loadOrderSucess
}