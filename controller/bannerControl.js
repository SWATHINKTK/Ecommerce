const bannerData = require('../models/bannerModel');

// LOAD BANNER VIEW PAGE
const loadBannerPage = (req, res, next) => {
    try {
        res.render('admin/viewBanner', { admin: true });
    } catch (error) {
        
    }
}

// Load Add Banner page 
const loadAddBannerPage = (req, res, next) => {
    try {
        res.render('admin/addBanner', { admin: true });
    } catch (error) {
        next(error);
    }
}


// ADD NEW BANNER
const addNewBanner = async(req, res, next) => {
    try {
        const data = req.body;
        
        const condition = data.bannerOfferName.trim() != '' && data.bannerHeading.trim() != '' && data.linkPage.trim() != '' && data.bannerDescription.trim() != '' && req.file;
        if(condition){
            const banner = bannerData({
                offerName:data.bannerOfferName,
                offerHeading:data.bannerHeading,
                offerDescription:data.linkPage,
                pageLink:data.linkPage,
                backgroundImage:req.filename,
            });

            const submitBanner = await banner.save();
            if(submitBanner){
                res.json({success:true});
            }else{
                res.json({success:false});
            }

        }else{
            res.json({success:false});
        }

    } catch (error) {
        next(error);
    }
}


module.exports = {
    loadBannerPage,
    loadAddBannerPage,
    addNewBanner
}