const express = require('express');
const multer = require('multer');
const path = require('path');
const bannerRouter = express();

const auth = require('../middleware/adminAuth');
const bannerController = require('../controller/bannerControl');


// multer is used to upload file 
const uploadBannerImg = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,path.join(__dirname,'../public/admin/assets/images/bannerImages'));
    },
    filename:(req,file,cb) => {
        const name = Date.now()+'-'+file.originalname;
        cb(null,name)
    }
});

const bannerImage = multer({storage:uploadBannerImg});

bannerRouter.get('/viewbanner', auth.isAdminLogin,  bannerController.loadBannerPage);
bannerRouter.get('/addBanner', auth.isAdminLogin,  bannerController.loadAddBannerPage);
bannerRouter.post('/addBanner', bannerImage.single('bannerBackground') , auth.isAdminLogin , bannerController.addNewBanner)
bannerRouter.patch('/statusChange', auth.isAdminLogin,  bannerController.bannerStatusChange);
bannerRouter.get('/editBanner:id', auth.isAdminLogin,  bannerController.loadEditBannerPage);
bannerRouter.post('/editBanner', bannerImage.single('bannerBackground') , auth.isAdminLogin,  bannerController.editBannerData);


module.exports = bannerRouter;