const express = require('express');
const wishlistRouter = express();

const wishlistController = require('../controller/wishlistControl');
const auth = require('../middleware/userAuth');

wishlistRouter.use(express.urlencoded({extended:true}));
wishlistRouter.use(express.json());

wishlistRouter.get('/addWishlist:productId', auth.isUserLogin, wishlistController.addProductToWishlist)

module.exports = wishlistRouter;