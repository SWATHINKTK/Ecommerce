const express = require('express');
const orderRouter = express();
const orderController = require('../controller/orderControl');
const auth = require('../middleware/userAuth');

orderRouter.get('/viewOrder',auth.isUserLogin,orderController.loadOrderListViewUserSide);
orderRouter.get('/orderDetails',auth.isUserLogin,orderController.loadOrderProgressInUserSide);
orderRouter.delete('/cancelOrder',auth.isUserLogin,orderController.cancelOrder)


//*** Order Routing Admin Side ***
orderRouter.get('/orderlist',orderController.loadOrderListAdminSide);
orderRouter.get('/orderManage:id',orderController.loadOrderManagePageAdminSide);
orderRouter.patch('/updateStatus',orderController.updateOrderStatus);

module.exports = orderRouter;