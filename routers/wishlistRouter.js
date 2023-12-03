const express = require('express');
const wishlistRouter = express();

const wishlistController = require('../controller/wishlistControl');
const auth = require('../middleware/userAuth');

wishlistRouter.use(express.urlencoded({extended:true}));
wishlistRouter.use(express.json());

wishlistRouter.post('/addWishlist', auth.isUserLogin, wishlistController.addProductToWishlist);
wishlistRouter.get('/viewWishlist', auth.isUserLogin, wishlistController.viewWishlistProduct);

wishlistRouter.delete('/removeWishlistProduct',auth.isUserLogin, wishlistController.removeWishlistProduct);


module.exports = wishlistRouter;