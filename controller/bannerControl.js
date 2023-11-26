const bannerData = require('../models/bannerModel');

// LOAD BANNER VIEW PAGE
const loadBannerPage = async(req, res, next) => {
    try {

        const banners = await bannerData.find();
        console.log(banners)

        res.render('admin/viewBanner', { admin: true , title:'Banner' , bannerData:banners});
    } catch (error) {
        
    }
}

// Load Add Banner page 
const loadAddBannerPage = (req, res, next) => {
    try {
        res.render('admin/addBanner', { admin: true , title:'AddBanner'});
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
                offerDescription:data.bannerDescription,
                pageLink:data.linkPage,
                backgroundImage:req.file.filename,
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


const unlistBanner = async(req, res, next) => {
    try {
        const id = req.params.id;
        const banner = await bannerData.findOne({_id:id});

        let updateStatus;
        if(banner.is_Listed){
            updateStatus = await bannerData.updateOne({_id:id},{is_Listed:false});
        }else{
            updateStatus = await bannerData.updateOne({_id:id},{is_Listed:true});
        }

        if(updateStatus){
            res.redirect('/admin/viewbanner');
        }

    } catch (error) {
        next(error)
    }
}


module.exports = {
    loadBannerPage,
    loadAddBannerPage,
    addNewBanner,
    unlistBanner
}