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




// *** ORDER MANAGEMENT ADMIN SIDE ***
const loadOrderListAdminSide = async(req, res) => {

    const order = await orderData.aggregate([
        // {
        //     $unwind:"$productInforamtion"
        // },
        {
            $lookup: {
                from: 'products', 
                localField: 'productInforamtion.productId', 
                foreignField: '_id', 
                as: 'productData' 
            }

        }
    ]);
    // const order = await orderData.find({});
    // console.log(order)

    res.render('admin/viewOrders', { admin: true, title:'Order',  orderData:order})
}



// **** LOAD ORDER MANAGEMENT PAGE VIEW ADMIN SIDE *****
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

        res.render('admin/manageOrder', { admin: true, title:'Order', orderData:order})

        // console.log(id,order);
    } catch (error) {
        console.log(error.message)
    }
}



// UPDATE STATUS OF THE ORDERED PRODUCT ******
const updateOrderStatus = async(req,res) => {
    try {

        const data = req.body;
        // console.log(data)

        const order = await orderData.findById(data.orderId);

        if(order){
            const productToUpdate = order.productInforamtion.find(orderProduct => orderProduct.productId.equals(data.productId))
            
            // *** ORDER CANCELED STATUS CHANGE ***
            if(data.orderStatus === 'Canceled'){

                productToUpdate.orderStatus = data.orderStatus;
                const updateStock = await productInfo.updateOne({_id:data.productId},{$inc:{stock:data.productQty}});
                
                if(updateStock){
                    const updateStatus = await order.save();

                    if(updateStatus){

                        res.json({status:true});

                    }else{
                        res.json({status:false});
                    }
                }
            }


            // **** ORDER SHIPPED STATUS CHANGE ****
            if(data.orderStatus === 'Shipped'){

                productToUpdate.orderStatus = data.orderStatus;

                const updateStatus = await order.save();

                    if(updateStatus){

                        res.json({status:true});

                    }else{
                        res.json({status:false});
                    }
            }


            // **** ORDER DELIVERED STATUS CHANGE ****
            if(data.orderStatus === 'Delivered'){

                productToUpdate.orderStatus = data.orderStatus;

                const updateStatus = await order.save();

                    if(updateStatus){

                        res.json({status:true});

                    }else{
                        res.json({status:false});
                    }
            }


            // **** ORDER PLACED STATUS CHANGE ****
            if(data.orderStatus === 'Placed'){

                productToUpdate.orderStatus = data.orderStatus;

                const updateStatus = await order.save();

                    if(updateStatus){

                        res.json({status:true});

                    }else{
                        res.json({status:false});
                    }
            }


        }
        
    } catch (error) {

        console.log(error.message);

    }
}


module.exports = {
    loadOrderListViewUserSide,
    loadOrderProgressInUserSide,
    loadOrderListAdminSide,
    loadOrderManagePageAdminSide,
    updateOrderStatus
}