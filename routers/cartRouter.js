const express = require('express');
const auth = require('../middleware/userAuth')
const cartRouter = express();


const cartController = require('../controller/cartControl')


cartRouter.get('/cart',auth.isUserLogin,cartController.loadCartPage);

cartRouter.post('/addToCart',auth.isUserLogin,cartController.productAddToCart);

cartRouter.patch('/cartQuantityUpdate',auth.isUserLogin,cartController.cartQuantityUpdate);

cartRouter.delete('/deleteCartProduct',auth.isUserLogin, cartController.removeProductFromCart)
module.exports = cartRouter;