const express = require('express');
const orderRouter = express();
const orderController = require('../controller/orderControl');
const userAuth = require('../middleware/userAuth');
const adminAuth = require('../middleware/adminAuth');


orderRouter.get('/viewOrder', userAuth.isUserLogin, orderController.loadOrderListViewUserSide);
orderRouter.get('/orderDetails', userAuth.isUserLogin, orderController.loadOrderProgressInUserSide);
orderRouter.get('/invoiceDownload', userAuth.isUserLogin, orderController.orderInvoiceDownload);
orderRouter.delete('/cancelOrder', userAuth.isUserLogin, orderController.cancelOrder);
orderRouter.patch('/returnOrder', userAuth.isUserLogin, orderController.orderReturn);


//*** Order Routing Admin Side ***
orderRouter.get('/orderlist', adminAuth.isAdminLogin, orderController.loadOrderListAdminSide);
orderRouter.get('/orderManage:id', adminAuth.isAdminLogin, orderController.loadOrderManagePageAdminSide);
orderRouter.get('/searchOrderId', adminAuth.isAdminLogin, orderController.searchOrderIdAdminSide);
orderRouter.get('/searchOrderManagement', adminAuth.isAdminLogin, orderController.searchOrderAdminSide);
orderRouter.patch('/updateStatus', adminAuth.isAdminLogin, orderController.updateOrderStatus);


// REVIEW OF THE PRODUCT 
orderRouter.get('/review',userAuth.isUserLogin,orderController.loadReviewPage);
orderRouter.post('/review',userAuth.isUserLogin,orderController.submitReviewData);

module.exports = orderRouter;