const orderData = require('../models/orderModel');
const { productInfo } = require('../models/productModel');
const { userData } = require('../models/userModal');

const mongoose = require('mongoose');


// ****** Load All Orders in View Order Page ******
const loadOrderListViewUserSide = async (req, res, next) => {
    try {
        const checkLogin = req.session.userId ? true : false;

        // userId
        const id = req.session.userId;
       
        let page = 1;
        if(req.query.page){
            page = req.query.page;
        }

        const limit = 5;

        // Find the all order details and view on order page
        const order = await orderData.aggregate([
            {
                $match:{
                    userId:new mongoose.Types.ObjectId(id)
                }
            },
            {
                $unwind: "$productInforamtion"
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
                $sort: { _id: -1 }
            },
            {   $skip: (page - 1) * limit },
            {   $limit: limit * 1 }
          
        ]);


        let totalCount = await orderData.aggregate([
            {
                $match:{
                    userId:new mongoose.Types.ObjectId(id)
                }
            },
            {
                $unwind: "$productInforamtion"
            },
            {
                $group:{
                    _id:null,
                    totalCount:{$sum:1}
                }
            }
        ]);

        
        totalCount = Math.ceil(totalCount[0].totalCount / limit)

        if (orderData) {
            res.render('user/orderDetails', { title: 'View Order', login: checkLogin, user: true, orderData: order , totalCount:totalCount ,page:page});
        } else {
            throw new Error('Data Not Found');
        }
    } catch (error) {
        next(error);
    }
}



// ***** Load ordered Product More Details ****
const loadOrderProgressInUserSide = async (req, res, next) => {
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
                $unwind: "$productInforamtion"
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
                    'productInforamtion.productId': new mongoose.Types.ObjectId(productId)
                },
            }
        ]);

        const returnPolicy = new Date() ;
        returnPolicy.setDate((order[0].updatedAt).getDate() +7 )
        // console.log(returnPolicy)
        // console.log(order[0].updatedAt)
        if (orderData) {
            res.render('user/orderProgress', { title: 'View Order', login: checkLogin, user: true, orderData: order , returnPolicyDate:returnPolicy});
        } else {
            throw new Error('Data is Not Found');
        }
    } catch (error) {
        next(error);
    }
}



// **** CANCEL ORDER IN USER SIDE ****
const cancelOrder = async (req, res, next) => {

    try {

        const data = req.body;

        const order = await orderData.findById(data.orderId);

        if (order) {
            const productToUpdate = order.productInforamtion.find(orderProduct => orderProduct.productId.equals(data.productId));


            // *** ORDER CANCELED STATUS CHANGE ***
            productToUpdate.orderStatus = 'Canceled';
            const updateStock = await productInfo.updateOne({ _id: data.productId }, { $inc: { stock: data.qunatity } });


            // Check Cancel Order Product Inventory Managed Or Not
            if (updateStock) {

                // ORDER STATUS IS PAID THE RETURN THE AMOUNT TO WALLET
                let updateStatus;
                if (productToUpdate.paymentStatus == 'Paid') {

                    // Create Unique TransactionId
                    const nanoidModule = await import('nanoid');
                    nanoid = nanoidModule.nanoid;
                    const uniqueID = nanoid();

                    // Creating The Tranction History Store Object
                    const transaction = {
                        transactionId: uniqueID,
                        transactionType: 'Debit',
                        description: 'Product Cancel',
                        amount: productToUpdate.productTotalAmount,
                        orderId: order._id
                    }

                    // UPDATE USER WALLET DATA
                    const returnAmount = await userData.updateOne({ _id: order.userId }, { $inc: { walletAmount: productToUpdate.productTotalAmount } }, { upsert: true });
                    const updateWalletTransaction = await userData.updateOne({ _id: order.userId }, { $push: { walletTransaction: transaction } }, { upsert: true });

                    
                    // Checking Wallet Update Successfull
                    if (returnAmount && updateWalletTransaction) {

                        productToUpdate.paymentStatus = 'Refund'
                        updateStatus = await order.save();

                    } else {

                        return;
                    }

                } else {

                    updateStatus = await order.save();
                }


                if (updateStatus) {

                    res.json({ status: true });

                } else {
                    res.json({ status: false });
                }
            }
        } else {
            throw new Error('Data is Not Found');
        }
    } catch (error) {
        next(error);
    }
}




// *** ORDER MANAGEMENT ADMIN SIDE ***
const loadOrderListAdminSide = async (req, res, next) => {
    try {

        let page = 1;
        if(req.query.page){
            page = req.query.page;
        }

        const limit = 5;

        const order = await orderData.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'productInforamtion.productId',
                    foreignField: '_id',
                    as: 'productData'
                }

            },
            {
                $sort: { _id: -1 }
            },
            {
                $skip:(page - 1) * limit
            },
            {
                $limit: limit * 1
            }
        ]);

        const totalOrders = await orderData.countDocuments({});

        if (order) {
            res.render('admin/viewOrders', { admin: true, title: 'Order', orderData: order ,totalPages:Math.ceil(totalOrders/limit),page:page});
        } else {
            throw new Error('Data is Not Found');
        }
    } catch (error) {
        next(error);
    }
}




// **** LOAD ORDER MANAGEMENT PAGE VIEW ADMIN SIDE *****
const loadOrderManagePageAdminSide = async (req, res, next) => {

    try {
        const id = req.params.id;

        const order = await orderData.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                },
            },
            {
                $unwind: "$productInforamtion"
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

        if (orderData) {
            res.render('admin/manageOrder', { admin: true, title: 'Order', orderData: order });
        } else {
            throw new Error('Data is Not Found');
        }

    } catch (error) {
        next(error);
    }
}



// UPDATE STATUS OF THE ORDERED PRODUCT ******
const updateOrderStatus = async (req, res, next) => {
    try {
        const data = req.body;

        const order = await orderData.findById(data.orderId);

        if (order) {
            const productToUpdate = order.productInforamtion.find(orderProduct => orderProduct.productId.equals(data.productId))

            // *** ORDER CANCELED STATUS CHANGE ***
            if (data.orderStatus === 'Canceled') {

                productToUpdate.orderStatus = data.orderStatus;
                const updateStock = await productInfo.updateOne({ _id: data.productId }, { $inc: { stock: data.productQty } });


                if (updateStock) {

                    let updateStatus;
                    if (productToUpdate.paymentStatus == 'Paid') {

                        const nanoidModule = await import('nanoid');
                        nanoid = nanoidModule.nanoid;

                        const uniqueID = nanoid();

                        const transaction = {
                            transactionId: uniqueID,
                            transactionType: 'Debit',
                            description: 'Product Cancel',
                            amount: productToUpdate.productTotalAmount,
                            orderId: order._id
                        }
                    

                        const returnAmount = await userData.updateOne({ _id: order.userId }, { $inc: { walletAmount: productToUpdate.productTotalAmount } }, { upsert: true });
                        const updateWalletTransaction = await userData.updateOne({ _id: order.userId }, { $push: { walletTransaction: transaction } }, { upsert: true });

                        if (returnAmount && updateWalletTransaction) {

                            productToUpdate.paymentStatus = 'Refund';
                            updateStatus = await order.save();
                        } else {
                            return;
                        }

                    } else {

                        updateStatus = await order.save();
                    }



                    if (updateStatus) {

                        res.json({ status: true });

                    } else {
                        res.json({ status: false });
                    }
                }
            }


            // **** ORDER SHIPPED STATUS CHANGE ****
            if (data.orderStatus === 'Shipped') {

                productToUpdate.orderStatus = data.orderStatus;

                const updateStatus = await order.save();

                if (updateStatus) {

                    res.json({ status: true });

                } else {
                    res.json({ status: false });
                }
            }


            // **** ORDER DELIVERED STATUS CHANGE ****
            if (data.orderStatus === 'Delivered') {

                productToUpdate.orderStatus = data.orderStatus;
                productToUpdate.paymentStatus = 'Paid';

                const updateStatus = await order.save();

                if (updateStatus) {

                    res.json({ status: true });

                } else {
                    res.json({ status: false });
                }
            }


            // **** ORDER PLACED STATUS CHANGE ****
            if (data.orderStatus === 'Placed') {

                productToUpdate.orderStatus = data.orderStatus;

                const updateStatus = await order.save();

                if (updateStatus) {

                    res.json({ status: true });

                } else {
                    res.json({ status: false });
                }
            }


        } else {
            throw new Error('This Order Data is Not Found');
        }

    } catch (error) {
        next(error)
    }
}



// ORDER RETURN WORKING CONTROLLER
const orderReturn = async(req, res, next) => {
    
    try {
        const data = req.body;


        const order = await orderData.findById(data.orderId);


        if (order) {

            // FINDING THE PRODUCT IN THAT ORDER
            const productToUpdate = order.productInforamtion.find(orderProduct => orderProduct.productId.equals(data.productId));

            // CHECK CONDITION FOR PRODUCT IS DELIVERECD OR NOT.DELIVERED PROUDUCT ONLY REFUND OPTION
            if(productToUpdate.orderStatus == 'Delivered'){
           
                // *** ORDER RETURN STATUS CHANGE ***
                productToUpdate.orderStatus = 'Return';
                productToUpdate.paymentStatus = 'Refund';
                productToUpdate.reason = data.reason;
                const updateStock = await productInfo.updateOne({ _id: data.productId }, { $inc: { stock: productToUpdate.productquantity } });

                // Check Return Order Product Inventory Managed Or Not
                if (updateStock) {

                    // Create Unique TransactionId
                    const nanoidModule = await import('nanoid');
                    nanoid = nanoidModule.nanoid;
                    const uniqueID = nanoid();

                    // Creating The Tranction History Store Object
                    const transaction = {
                        transactionId: uniqueID,
                        transactionType: 'Debit',
                        description: 'Product Return Refund',
                        amount: productToUpdate.productTotalAmount,
                        orderId: order._id
                    }

                    const returnAmount = await userData.updateOne({ _id: order.userId }, { $inc: { walletAmount: productToUpdate.productTotalAmount } }, { upsert: true });
                    const updateWalletTransaction = await userData.updateOne({ _id: order.userId }, { $push: { walletTransaction: transaction } }, { upsert: true });


                    // Checking Wallet Update Successfull
                    if (returnAmount && updateWalletTransaction) {

                        productToUpdate.paymentStatus = 'Refund';
                        const updateStatus = await order.save();

                        if (updateStatus) {

                            res.json({ status:true });
        
                        } else {
                            res.json({ status:false });
                        }

                    }else{
                        throw new Error('Updation Failed');
                    } 
                }else{
                    throw new Error('Product Must Be Delivered');
                }
    
            }else{
                throw new Error('Stock Manage Error');
            }
        } else {
            throw new Error('Data is Not Found');
        }
    } catch (error) {
        next(error)
    }
}





module.exports = {
    loadOrderListViewUserSide,
    loadOrderProgressInUserSide,
    cancelOrder,
    orderReturn,
    loadOrderListAdminSide,
    loadOrderManagePageAdminSide,
    updateOrderStatus
}