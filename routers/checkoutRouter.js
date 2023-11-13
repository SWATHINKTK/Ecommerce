const express = require('express');
const auth = require('../middleware/userAuth');
const checkOutRouter = express();


const checkOutController = require('../controller/checkoutControl');


checkOutRouter.get('/checkout',auth.isUserLogin,checkOutController.LoadCheckoutPage);
checkOutRouter.post('/placeOrder',auth.isUserLogin,checkOutController.PlaceOrder);
checkOutRouter.get('/orderSucesss',auth.isUserLogin,checkOutController.loadOrderSucess);
checkOutRouter.post('/verifyPayment',checkOutController.paymentVerification);



module.exports = checkOutRouter;