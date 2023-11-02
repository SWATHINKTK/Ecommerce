const express = require('express');
const auth = require('../middleware/userAuth');
const checkOutRouter = express();


const checkOutController = require('../controller/checkoutControl');


checkOutRouter.get('/checkout',auth.isUserLogin,checkOutController.LoadCheckoutPage)


module.exports = checkOutRouter;