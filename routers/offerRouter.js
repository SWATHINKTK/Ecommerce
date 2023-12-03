const express = require('express');
const offerRouter = express();

const auth = require('../middleware/adminAuth');
const offerControl = require('../controller/offerControl');


offerRouter.get('/viewOfferList', auth.isAdminLogin , offerControl.loadOfferList);
offerRouter.get('/addOffer', auth.isAdminLogin , offerControl.loadAddOfferPage);
offerRouter.post('/addOffer', auth.isAdminLogin , offerControl.submitOfferData);
offerRouter.get('/editOffer:id', auth.isAdminLogin , offerControl.loadEditOfferPage);
offerRouter.post('/editOffer', auth.isAdminLogin , offerControl.editOfferData);
offerRouter.delete('/deleteOffer', auth.isAdminLogin , offerControl.deleteOffer);
offerRouter.patch('/productOfferApply', auth.isAdminLogin , offerControl.productOfferApply);
offerRouter.patch('/categoryOfferApply', auth.isAdminLogin , offerControl.categoryOfferApply);
offerRouter.patch('/categoryOfferRemove', auth.isAdminLogin , offerControl.categoryOfferRemove);
offerRouter.patch('/removeProductOffer', auth.isAdminLogin , offerControl.productOfferRemove);


module.exports = offerRouter;