const orderData = require('../models/orderModel');
const {productInfo} = require('../models/adminModel');

const mongoose = require('mongoose');

// ****** Load All Orders in View Order Page ******
const loadOrderListViewUserSide = async(req,res)=>{
    
    const checkLogin = req.session.userId ? true : false;

    // userId
    const id = req.session.id;

    // Find the all order details and view on order page
    const order = await orderData.aggregate([
        {
            $unwind:"$productInforamtion"
        },
        {
            $lookup: {
                from: 'products', 
                localField: 'productInforamtion.productId', 
                foreignField: '_id', 
                as: 'productData' 
            }

        }
    ]);
    
    res.render('user/orderDetails',{ title:'View Order' ,login:checkLogin ,user: true, orderData:order});
}



// ***** Load ordered Product More Details ****
const loadOrderProgressInUserSide = async(req,res) => {

    const checkLogin = req.session.userId ? true : false;

    const orderId = req.query.id;
    const productId = req.query.productId;

    // Aggregate to retrieve the details of that order 
    const order = await orderData.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(orderId),
              },
        },
        {
            $unwind:"$productInforamtion"
        },  
        {
            $lookup: {
                from: 'products', 
                localField: 'productInforamtion.productId', 
                foreignField: '_id', 
                as: 'productData' 
            }

        },
        {
            $match: {
                'productInforamtion.productId':new mongoose.Types.ObjectId(productId)
              },
        }
    ]);

    res.render('user/orderProgress',{ title:'View Order' ,login:checkLogin ,user: true, orderData:order});
    
    // const order = await orderData.findOne({_id:orderId});
    // const product = await productInfo.findOne({_id:productId});
    console.log(order)
}




// ORDER MANAGEMENT ADMIN SIDE
const loadOrderListAdminSide = async(req, res) => {

    const order = await orderData.aggregate([
        {
            $unwind:"$productInforamtion"
        },
        {
            $lookup: {
                from: 'products', 
                localField: 'productInforamtion.productId', 
                foreignField: '_id', 
                as: 'productData' 
            }

        }
    ]);

    res.render('admin/viewOrders', { admin: true, title:'Order',  orderData:order})
}


const loadOrderManagePageAdminSide = async(req,res)=>{

    try {
        const id = req.params.id;
        
        const order = await orderData.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id) 
                  },
            },  
            {
                $unwind:"$productInforamtion"
            },
            {
                $lookup: {
                    from: 'products', 
                    localField: 'productInforamtion.productId', 
                    foreignField: '_id', 
                    as: 'productData' 
                }
    
            }
        ]);

        res.render('admin/manageOrder', { admin: true, title:'Order'})

        console.log(id,order);
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadOrderListViewUserSide,
    loadOrderProgressInUserSide,
    loadOrderListAdminSide,
    loadOrderManagePageAdminSide
}