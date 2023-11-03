const addressData = require('../models/addressModel');
const {productInfo} = require('../models/adminModel');
const orderData = require('../models/orderModel')

const LoadCheckoutPage = async(req,res) => {

    try{

        const checkLogin = req.session.userId ? true : false;
        const userId = req.session.userId;
        const productId = req.query.id;

        const addressInfo = await addressData.find({userId:userId});
        const productData = await productInfo.findOne({_id:productId});
        
        res.render('user/checkout',{user:true, title:'CheckOut', login:checkLogin, address:addressInfo, product:productData});

    }catch(error){
        console.log(error.message);
    }

}


const PlaceOrder = async(req,res)=>{

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

        const products = {
            productId:data.ProductId,
            productPrice:data.ProductPrice,
            productquantity:data.productQuantity
        }


        let paymentStatus;
        if(data.PaymentMethod == 'COD'){
            paymentStatus = 'Pending';
        }else{
            paymentStatus = 'Processing';
        }


        const orderSucess = orderData({
            addressInformation:address,
            productInforamtion:products,
            userId:userId,
            paymentMethod:data.PaymentMethod,
            paymentStatus:paymentStatus
        })

        const orderStore = await orderSucess.save();

        if(orderStore){
            const stockUpdate = await productInfo.updateOne({_id:data.ProductId},{$inc:{stock:-data.productQuantity}});
         
            if(stockUpdate){
                res.json({status:true});
            }else{
                res.json({status:false});
            }
        }


    } catch (error) {
        console.log(error.message);
    }
}



const loadOrderSucess = async(req,res)=>{

    const checkLogin = req.session.userId ? true : false;
   
    res.render('user/orderPlacedSucess',{user:true, title:'CheckOut', login:checkLogin,});
}

module.exports = {
    LoadCheckoutPage,
    PlaceOrder,
    loadOrderSucess
}