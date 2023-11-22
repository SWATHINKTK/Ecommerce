const orderData = require('../models/orderModel');
const { productInfo } = require('../models/productModel');
const { userData } = require('../models/userModal');
const puppeteer = require('puppeteer');


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


const orderInvoiceDownload = async(req, res, next) => {
    try {
        // Generate PDF using Puppeteer
        const browser = await puppeteer.launch({ headless: 'new' });
        // const browser = await puppeteer.launch();
        const page = await browser.newPage();

        if(!req.query.orderId){
            throw new Error('Id Not Found')
        }

    
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
  
          }
        
      ]);

      console.log(orderDetails)

    //   console.log(orderDetails[0].productData)
    
      const divContent = `
        <div class="col-12" >
          <div class="card border" style="height:96vh;">
          <h2 class="card-title text-center font-weight-blod mt-5">INVOICE</h2>
            <div class="card-body mt-5">
            <div class="pl-4 pt-4 pr-4 pb-1">
          <ul type="none">
              <div class="d-flex mt-4">
                  <li class="order-manage-li">Order Id &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</li><span class=" ml-5">:&nbsp;&nbsp;${orderDetails[0].order_id}</span>
              </div>
              <div class="d-flex mt-1">
                  <li class="order-manage-li">Placed On &nbsp;&nbsp;&nbsp;</li><span class=" ml-5">: &nbsp;${(orderDetails[0].createdAt).toLocaleDateString()} &nbsp; ${(orderDetails[0].createdAt).toLocaleTimeString()}</span>
              </div>
              <div class="d-flex mt-2 ">
                  <li class="order-manage-li mt-1">Shipping Address &nbsp; : </li>&nbsp; 
                  <div class="mt-2">
                      <h5>  &nbsp;${orderDetails[0].addressInformation.username} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${orderDetails[0].addressInformation.phonenumber}</h5>
                      <p class="ml-1">${orderDetails[0].addressInformation.address} , ${orderDetails[0].addressInformation.locality} , ${orderDetails[0].addressInformation.city} , ${orderDetails[0].addressInformation.district}<br>
                      ${orderDetails[0].addressInformation.pincode}</p>
                  </div>
              </div>
              <div class="d-flex mt-1">
                  <li class="order-manage-li">Payment Method &nbsp;&nbsp;&nbsp;</li><span class=""> : &nbsp;&nbsp; ${orderDetails[0].paymentMethod}</span>
              </div>
              <div class="d-flex mt-2">
                  <li class="order-manage-li">Price  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</li><span class=" ml-5"> : &nbsp;<i class="bi bi-currency-rupee"></i> ${orderDetails[0].totalAmount}</span>
              </div>
          </ul>
      </div>
      <hr style="border: none; border-top: 2px solid #F5F5F9; width:86%; margin-top:19px; margin-bottom:15px;">
              <div class="d-flex ml-3 mt-3 mb-3" style="margin-left:25px; padding-bottom:15px; padding-top:25px;">
                <div class="ml-5">
                  <h5 class="font-weight-blod">Billing Address</h5>
                  <div class="mt-2 ml-3">
                      <h5>  &nbsp;${orderDetails[0].addressInformation.username} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${orderDetails[0].addressInformation.phonenumber}</h5>
                      <p class="ml-1">${orderDetails[0].addressInformation.address} , ${orderDetails[0].addressInformation.locality} , ${orderDetails[0].addressInformation.city} , ${orderDetails[0].addressInformation.district}<br>
                      ${orderDetails[0].addressInformation.pincode}</p>
                  </div>
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
                        <td>${data.productData[0].productName}</td>
                        <td>${data.productInforamtion.productquantity}</td>
                        <td>${data.productInforamtion.productPrice}</td>
                        <td>${data.productInforamtion.productTotalAmount}</td>
                    </tr>`
                ).join('')}
                    <tr>
                        <td colspan="2"><span class="font-weight-blod">Total Qunatity : </span>${orderDetails.length}</td>
                        <th colspan="2"><span class="font-weight-blod">Total Price : </span></th>
                        <th>${orderDetails[0].totalAmount}</th>
                    </tr>

                  </tbody>
                </table>
                <div class="d-flex justify-content-end">
                    <img src="http://localhost:5000/public/admin/assets/images/logoMaleFashion.png" style="width: 200px; height: 200px;" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    
        // Set the HTML content of the page
        await page.setContent(divContent);
    
        // Add Bootstrap CDN link dynamically
        await page.addStyleTag({ url: 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css' });
    
        // Print PDF of the div with margins and border
        const pdfBuffer = await page.pdf({
          path: 'invoice_from_div_with_border.pdf',
          printBackground: true,
          margin: {
            top: '60px',
            right: '10px',
            bottom: '10px',
            left: '10px',
          },
        });
    
        // Close the browser
        await browser.close();
    
        // Set up the response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
        res.send(pdfBuffer);

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
    orderInvoiceDownload,
    loadOrderListAdminSide,
    loadOrderManagePageAdminSide,
    searchOrderAdminSide,
    searchOrderIdAdminSide,
    updateOrderStatus
}