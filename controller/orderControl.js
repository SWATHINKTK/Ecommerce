const orderData = require('../models/orderModel');
const {productInfo} = require('../models/productModel');

const mongoose = require('mongoose');


// ****** Load All Orders in View Order Page ******
const loadOrderListViewUserSide = async(req, res, next)=>{
    try {
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

            },
            {
                $sort:{_id:-1}
            }
        ]);
        
        if(orderData){
            res.render('user/orderDetails',{ title:'View Order' ,login:checkLogin ,user: true, orderData:order});
        }else{
            throw new Error('Data Not Found');
        }  
    } catch (error) {
        next(error);
    }
}



// ***** Load ordered Product More Details ****
const loadOrderProgressInUserSide = async(req, res, next) => {
    try {
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
        if(orderData){
            res.render('user/orderProgress',{ title:'View Order' ,login:checkLogin ,user: true, orderData:order});
        }else{
            throw new Error('Data is Not Found');
        }
    } catch (error) {
        next(error);
    }
}



// **** CANCEL ORDER IN ADMIN SIDE ****
const cancelOrder = async(req, res, next) => {
    
    try {
        const data = req.body;

        const order = await orderData.findById(data.orderId);

        if(order){
            const productToUpdate = order.productInforamtion.find(orderProduct => orderProduct.productId.equals(data.productId));
            console.log(productToUpdate)
            
            // *** ORDER CANCELED STATUS CHANGE ***

            productToUpdate.orderStatus = 'Canceled';
            const updateStock = await productInfo.updateOne({_id:data.productId},{$inc:{stock:data.qunatity}});
            
            if(updateStock){
                const updateStatus = await order.save();

                if(updateStatus){

                    res.json({status:true});

                }else{
                    res.json({status:false});
                }
            }
        }else{
            throw new Error('Data is Not Found');
        }
    } catch (error) {
        next(error);
    }
}




// *** ORDER MANAGEMENT ADMIN SIDE ***
const loadOrderListAdminSide = async(req, res, next) => {
    try {
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
    
            },
            {
                $sort:{_id:-1}
            }
        ]);
        
        if(order){
            res.render('admin/viewOrders', { admin: true, title:'Order',  orderData:order});
        }else{
            throw new Error('Data is Not Found');
        }
    } catch (error) {
        next(error);
    }
}




// **** LOAD ORDER MANAGEMENT PAGE VIEW ADMIN SIDE *****
const loadOrderManagePageAdminSide = async(req, res, next)=>{

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

        if(orderData){
            res.render('admin/manageOrder', { admin: true, title:'Order', orderData:order});
        }else{
            throw new Error('Data is Not Found');
        }

    } catch (error) {
        next(error);
    }
}



// UPDATE STATUS OF THE ORDERED PRODUCT ******
const updateOrderStatus = async(req, res, next) => {
    try {
        const data = req.body;

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


        }else{
            throw new Error('This Order Data is Not Found');
        }
        
    } catch (error) {
        next(error)
    }
}





module.exports = {
    loadOrderListViewUserSide,
    loadOrderProgressInUserSide,
    cancelOrder,
    loadOrderListAdminSide,
    loadOrderManagePageAdminSide,
    updateOrderStatus
}