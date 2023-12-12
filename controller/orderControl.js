const orderData = require('../models/orderModel');
const { productInfo } = require('../models/productModel');
const { userData } = require('../models/userModal');
const crypto = require('crypto');
const fs = require('fs');


const mongoose = require('mongoose');

// Generating Random Ids
async function generateId(length) {

    if (length % 2 != 0) {
        throw new Error('Length must be even For OTP Generation.');
    }

    const randomBytes = crypto.randomBytes(length / 2);
    const Id = randomBytes.toString('hex')
    return Id;
}



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


        let totalCount = 0;
        if(order.length > 0){
            totalCount = await orderData.aggregate([
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
        }


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
        const userId = req.session.userId;

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



        const ratingData = order[0].productData[0]?.review?.find(review => review.userId?.toString() == userId.toString());

        const returnPolicy = new Date() ;
        returnPolicy.setDate((order[0].updatedAt).getDate() +7 )
  
        if (orderData) {
            res.render('user/orderProgress', { 
                title: 'View Order', 
                login: checkLogin, 
                user: true, 
                orderData: order, 
                returnPolicyDate:returnPolicy,
                ratingData:ratingData
            });

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
                    // const nanoidModule = await import('nanoid');
                    // nanoid = nanoidModule.nanoid;
                    // const uniqueID = nanoid();
                    const uniqueID = String(await generateId(8));
                 

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



// ORDER INVOICE DOWNLOAD
const orderInvoiceDownload = async(req, res, next) => {

    try {

        // CHECKING THE ORDERID . ORDERID NOT PRESENT THROE AN ERROR
        if(!req.query.orderId){
            throw new Error('Id Not Found')
        }


        // CHECKING THE ORDER PROGUESS TO SEND THE THAT PRODUCT ONLY INVOICE CHEKING THE PRODUCTID PRESENT OR NOT
        let productId = {$ne:''};
        if(req.query.productId){
            productId = new mongoose.Types.ObjectId(req.query.productId);
        }

    
        // AGGREGATE TO FETCH THAT ORDER DETAILS
        const orderDetails = await orderData.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(req.query.orderId)
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
                $match:{'productInforamtion.productId':productId}
            }
        
      ]);


    // CALCULATING THE TOTAL AMOUT OF THAT ORDER
    const totalAmount = orderDetails.reduce((sum,value) => { return sum + value.productInforamtion.productTotalAmount },0);

    // CREATING THAT INVOICE VIEW DATA
      const divContent = `
      <html>

        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
            <script src="https://rawgit.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js"></script>
        </head>

        <body class="p-4">
            <div class="col-12" style=" height:1054px; border:1px solid #000;">
                <div class="card" style="border:none">
                    <h2 class="card-title text-center font-weight-blod mt-5">INVOICE</h2>
                    <div class="card-body mt-5">
                        <div class="pl-4 pt-4 pr-4 pb-1">
                            <div class="table-responsive">
                                <table style="text-align: left;">
                                    <tr>
                                        <th>Order Id</th>
                                        <td>&nbsp;&nbsp;:&nbsp;&nbsp;${orderDetails[0].order_id}</td>
                                    </tr>
                                    <tr>
                                        <th>Placed On</th>
                                        <td>&nbsp;&nbsp;:&nbsp;&nbsp;${(orderDetails[0].createdAt).toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <th>Payment Method</th>
                                        <td>&nbsp;&nbsp;:&nbsp;&nbsp;${orderDetails[0].paymentMethod}</td>
                                    </tr>
                                    <tr>
                                        <th>Price</th>
                                        <td>&nbsp;&nbsp;:&nbsp;&nbsp;${orderDetails[0].totalAmount}</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="table-responsive">
                                <table style="margin-top: 50px;text-align: left;">
                                    <tr>
                                        <th>Billing Address</th>
                                        <th style="padding-left:40px">Shipping Address</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h5> &nbsp;${orderDetails[0].addressInformation.username}
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                ${orderDetails[0].addressInformation.phonenumber}</h5>
                                            <p class="ml-1">${orderDetails[0].addressInformation.address} ,
                                                ${orderDetails[0].addressInformation.locality} ,
                                                ${orderDetails[0].addressInformation.city} ,
                                                ${orderDetails[0].addressInformation.district}<br>
                                                ${orderDetails[0].addressInformation.pincode}</p>
                                        </td>
                                        <td style="padding-left:40px">
                                            <h5> &nbsp;${orderDetails[0].addressInformation.username}
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                ${orderDetails[0].addressInformation.phonenumber}</h5>
                                            <p class="ml-1">${orderDetails[0].addressInformation.address} ,
                                                ${orderDetails[0].addressInformation.locality} ,
                                                ${orderDetails[0].addressInformation.city} ,
                                                ${orderDetails[0].addressInformation.district}<br>
                                                ${orderDetails[0].addressInformation.pincode}</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Product Name</th>
                                        <th>Qty</th>
                                        <th>Product Price</th>
                                        <th>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${orderDetails.map((data, index) =>

                                    `<tr>
                                        <th>${index + 1}</th>
                                        <td>${data.productData[0].productName}<br>(size : ${data.productData[0].size} )</td>
                                        <td>${data.productInforamtion.productquantity}</td>
                                        <td>${data.productInforamtion.productPrice}</td>
                                        <td>${data.productInforamtion.productTotalAmount}</td>
                                    </tr>`
                                    ).join('')}
                                    <tr>
                                        <td colspan="2"><span class="font-weight-blod">Total Qunatity :
                                            </span>${orderDetails.length}</td>
                                        <th colspan="2"><span class="font-weight-blod">Total Price : </span></th>
                                        <th>${totalAmount}</th>
                                    </tr>

                                </tbody>
                            </table>
                            <div style=" text-align: right;">
                                <img src="http://localhost:5000/public/user/img/logo.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>

        <script>
            window.onload = function () {

                const element = document.body; // You can specify any HTML element here

                html2pdf(element);

                setTimeout(function () {
                    window.history.back();
                }, 1600);
            };
        </script>
        </html>`;
        

        res.send(divContent);
    

      } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Internal Server Error');
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

        let totalOrders = await orderData.countDocuments({});

        totalOrders = order.length > 0 ? Math.ceil(totalOrders/limit) : 0;


        if (order) {
            res.render('admin/viewOrders', { admin: true, title: 'Order', orderData: order ,totalPages:totalOrders ,page:page});
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

                        // const nanoidModule = await import('nanoid');
                        // nanoid = nanoidModule.nanoid;

                        // const uniqueID = nanoid();

                        const uniqueID = String(await generateId(8));

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

            if (data.orderStatus === 'Order_Pickup') {

                productToUpdate.orderStatus = data.orderStatus;

                const updateStatus = await order.save();

                if (updateStatus) {

                    res.json({ status: true , value:'Return_Canceled'});

                } else {
                    res.json({ status: false });
                }
            }

            if (data.orderStatus === 'Return_Canceled') {

                productToUpdate.orderStatus = data.orderStatus;

                const updateStatus = await order.save();

                if (updateStatus) {

                    res.json({ status: true });

                } else {
                    res.json({ status: false });
                }
            }

            if(data.orderStatus == 'Return'){
                           
                // *** ORDER RETURN STATUS CHANGE ***
                productToUpdate.orderStatus = 'Return';
                productToUpdate.paymentStatus = 'Refund';
                const updateStock = await productInfo.updateOne({ _id: data.productId }, { $inc: { stock: productToUpdate.productquantity } });

                // Check Return Order Product Inventory Managed Or Not
                if (updateStock) {

                    // Create Unique TransactionId
                    // const nanoidModule = await import('nanoid');
                    // nanoid = nanoidModule.nanoid;
                    // const uniqueID = nanoid();

                    const uniqueID = String(await generateId(8));

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
            }


        } else {
            throw new Error('This Order Data is Not Found');
        }

    } catch (error) {
        next(error)
    }
}


// ORDER SEARCH IN ADMIN SIDE 
const searchOrderAdminSide = async(req, res, next) => {

    try {

        let startDate = '';
        let endDate = '';
        if(req.query.startDate){
            startDate = new Date(req.query.startDate); 
            startDate.setHours(0, 0, 0, 0);
        }

        if(req.query.endDate){
            endDate = new Date(req.query.endDate);
            endDate.setHours(23, 59, 59, 999);
        }


        let page = 1;
        if(req.query.page){
            page = req.query.page;
        }

        const limit = 5;

        const order = await orderData.aggregate([
            {
                $match:{
                     createdAt: {
                            $gte: startDate,
                            $lte: endDate
                          }
                }
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
            {
                $skip:(page - 1) * limit
            },
            {
                $limit: limit * 1
            }
        ]);

        let totalOrdersCount = await orderData.aggregate([
            {
                $match:{
                        createdAt: {
                            $gte: startDate,
                            $lte: endDate
                          }
                }
            },
            {
                $group:{
                    _id:null,
                    totalCount:{$sum:1}
                }
            }
        ]);
        
        if(order.length > 0){
            startDate = dateFormat(startDate);
            endDate = dateFormat(endDate);
        }
        
    
            
        totalOrdersCount = order.length > 0 ? Math.ceil(totalOrdersCount[0].totalCount / limit) : 0;


        if (order) {
            res.render('admin/viewOrders', { admin: true, title: 'Order', orderData: order , totalPages:totalOrdersCount, page:page, startDate, endDate});
        } else {
            throw new Error('Data is Not Found');
        }

    } catch (error) {
        next(error)
    }
}



function dateFormat(date){
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return formattedDate = year + '-' + month + '-' + day;
}



// ORDER SEARCH BASED ON ORDER ID IN ADMIN SIDE 
const searchOrderIdAdminSide = async(req, res, next) => {

    try {
   
        let regexPattern = '';
        if(req.query.value){
            regexPattern = { $regex: new RegExp(`.*${req.query.value}.*`, 'i') }; 
        }

        let page = 1;
        if(req.query.page){
            page = req.query.page;
        }

        const limit = 5;

        const order = await orderData.aggregate([
            {
                $match:{ order_id: regexPattern}
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
            {
                $skip:(page - 1) * limit
            },
            {
                $limit: limit * 1
            }
        ]);

        let totalOrdersCount = await orderData.aggregate([
            {
                $match:{ order_id: regexPattern}
            },
            {
                $group:{
                    _id:null,
                    totalCount:{$sum:1}
                }
            }
        ]);
        
        totalOrdersCount = order.length > 0 ? Math.ceil(totalOrdersCount[0].totalCount / limit) : 0;


        if (order) {
            res.render('admin/viewOrders', { admin: true, title: 'Order', orderData: order , totalPages:totalOrdersCount, page:page, search:req.query.value});
        } else {
            throw new Error('Data is Not Found');
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

        const currentDate = new Date(order.updatedAt);
        currentDate.setDate(currentDate.getDate() + 7);
        
        if (order) {

            // FINDING THE PRODUCT IN THAT ORDER
            const productToUpdate = order.productInforamtion.find(orderProduct => orderProduct.productId.equals(data.productId));

            // CHECK CONDITION FOR PRODUCT IS DELIVERECD OR NOT.DELIVERED PROUDUCT ONLY REFUND OPTION
            if(productToUpdate.orderStatus == 'Delivered' && order.updatedAt <= currentDate){
           
                // *** ORDER RETURN STATUS CHANGE ***
                productToUpdate.orderStatus = 'Return_Placed';
                productToUpdate.reason = data.reason;

                const updateStatus = await order.save();

                if (updateStatus) {

                    res.json({ status:true });

                } else {
                    res.json({ status:false });
                }

            }else{
                throw new Error('Deliverd Order is not Exist');
            }
        } else {
            throw new Error('Data is Not Found');
        }
    } catch (error) {
        next(error)
    }
}



// LOAD PRODUCT REVIEW PAGE
const loadReviewPage = async(req, res, next) => {
    try {
        const checkLogin = req.session.userId ? true : false;

        const orderId = req.query.orderId;
        const productId = req.query.productId;
        const userId = req.session.userId;

        const order = await ratingProductData(orderId, productId, userId);

        const ratingData = order[0].productData?.review?.find(review => review.userId?.toString() == userId.toString());
  

        if(order.length > 0){

            res.render('user/rating', { title: 'Rating', login: checkLogin, user: true, orderData:order, ratingData:ratingData} );

        }else{

            const error = new Error('Invalid Request.');
            error.statusCode = 404;
            next(error);
        }
        
        
    } catch (error) {
        next(error);
    }
}


// SUBMIT THE PRODUCT REVIEW DATA
const submitReviewData = async(req, res, next) => {
    try {
        const data = req.body;
        const userId = req.session.userId;

        const order = await ratingProductData(data.orderId, data.productId, userId);

        const userReview = {
            userId: userId,
            rating: data.starRadio,
            feedback: data.feedback
        }

        const existingReviewIndex = order[0].productData?.review?.findIndex((review) =>
            review.userId?.equals(new mongoose.Types.ObjectId(userId))
        );


        if(existingReviewIndex ==  -1 || !existingReviewIndex){
 
            const addReview = await productInfo.updateOne({
                    _id:data.productId
                },
                {
                    $push:{
                        review:userReview
                    }
                });

            if(addReview){
                res.json({success:true});
            }else{
                res.json({success:false}); 
            }

        }else{
     
            const editReview = await productInfo.updateOne(
                { _id: data.productId, 'review.userId': userReview.userId },
                {
                  $set: {
                    'review.$.feedback': userReview.feedback,
                    'review.$.rating': userReview.rating,
                    'review.$.feedbackDate' : new Date()
                  }
                }
            );

            if(editReview){
                res.json({success:true});
            }else{
                res.json({success:false}); 
            }
  
        }
        

    } catch (error) {
        next(error);
    }
}



async function ratingProductData(orderId, productId, userId){
    const order = await orderData.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(orderId),
                userId:new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $unwind:"$productInforamtion"
        },
        {
            $match:{
                'productInforamtion.productId':new mongoose.Types.ObjectId(productId)
            }
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
            $unwind:'$productData'
        }
    ]);

    if(order.length <= 0){
        const error = new Error('Invalid Request.');
        error.statusCode = 404;
        next(error);
        return;
    }
    return order;
}



module.exports = {
    loadOrderListViewUserSide,
    loadOrderProgressInUserSide,
    cancelOrder,
    orderReturn,
    orderInvoiceDownload,
    loadOrderListAdminSide,
    loadOrderManagePageAdminSide,
    searchOrderAdminSide,
    searchOrderIdAdminSide,
    updateOrderStatus,
    loadReviewPage,
    submitReviewData
}








