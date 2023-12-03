const express = require('express');
const couponRouter = express();

const auth = require('../middleware/adminAuth');
const couponController = require('../controller/couponControl')


//*** Coupon Routing */
couponRouter.get('/couponlist', auth.isAdminLogin, couponController.loadCouponList);
couponRouter.get('/addcoupon', auth.isAdminLogin, couponController.loadAddCouponPage);
couponRouter.post('/addcoupon', auth.isAdminLogin, couponController.submitCouponData);
couponRouter.get('/editCoupon', auth.isAdminLogin, couponController.loadEditCouponPage);
couponRouter.put('/editCoupon', auth.isAdminLogin, couponController.editCouponDataSubmit);
couponRouter.delete('/deleteCoupon', auth.isAdminLogin, couponController.deleteCoupon);


module.exports = couponRouter;