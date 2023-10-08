// Npm and core Module import 
const express = require('express');
const mongoose = require('mongoose');
const adminRouter = express();


//Local Module Import 
const adminController = require('../controller/adminControl');


// Application Middlewares
adminRouter.use(express.urlencoded({extended:true}))



adminRouter.get('/',adminController.loadAdminLogin);
adminRouter.post('/',adminController.verifyLogin)
adminRouter.get('/home',adminController.loadAdminHomepage);




module.exports = adminRouter;