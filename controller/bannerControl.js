const bannerData = require('../models/bannerModel');
const fs = require('fs');
const path = require('path');


// LOAD BANNER VIEW PAGE
const loadBannerPage = async(req, res, next) => {
    try {

        const banners = await bannerData.find();

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


const bannerStatusChange = async(req, res, next) => {
    try {

        const id = req.body.bannerId;
     
        const banner = await bannerData.findOne({_id:id});

        let updateStatus;
        if(banner.is_Listed){
            updateStatus = await bannerData.updateOne({_id:id},{is_Listed:false});
        }else{
            updateStatus = await bannerData.updateOne({_id:id},{is_Listed:true});
        }

        if(updateStatus){
            res.json({status:(!banner.is_Listed)})
        }

    } catch (error) {
        next(error)
    }
}


// LOAD EDIT BANNER PAGE 
const loadEditBannerPage = async(req, res, next) => {
    try {
        const id = req.params.id;
        const banner = await bannerData.find({_id:id});

        res.render('admin/editBanner', { admin: true , title:'AddBanner' , bannerData:banner[0]});
    } catch (error) {
        next(error);
    }
}



// EDIT BANNER DATA THE DATA SAVED TO DATABASE
const editBannerData = async(req, res, next) => {
    try {
        const data = req.body;

        // CHECKING THE FILE EXIST OR NOT FILE EXIST UPDATE WITH THAT FILE OTHER WISE PREVIOUSLY IMAG USED
        if(req.file){
            const publicFile = path.join(__dirname, '..', 'public', 'admin', 'assets','images','bannerImages',`${data.bannerPreviousBackground}`);
            fs.unlink(`${publicFile}`,(error) => {

                if(error){
                    console.error(error);
                }else{
                    console.log('Previous Image Delete Sucess');
                }
        
            });
            data.bannerPreviousBackground = req.file.filename;
        }
        
        const updateBanner = await bannerData.updateOne({_id:data.bannerId},{
            offerName:data.bannerOfferName,
            offerHeading:data.bannerHeading,
            offerDescription:data.bannerDescription,
            pageLink:data.linkPage,
            backgroundImage:data.bannerPreviousBackground
        });

        if(updateBanner){
            res.json({success:true});
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
    addNewBanner,
    bannerStatusChange,
    loadEditBannerPage,
    editBannerData
}