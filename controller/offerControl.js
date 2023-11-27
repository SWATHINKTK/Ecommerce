const offerData = require('../models/offerModel');

// LOAD OFFER LIST PAGE
const loadOfferList = async(req, res, next) => {
    try {

        const offer = await offerData.aggregate([
            {
                $sort:{status:1,updatedAt:-1}
            }
        ])

        res.render('admin/viewOffer', { admin: true , offerData:offer});
    } catch (error) {
        next(error);
    }
}


// LOAD ADD OFFER PAGE 
const loadAddOfferPage = (req, res, next) => {
    try {
        res.render('admin/addOffer', { admin: true });
    } catch (error) {
        next(error);
    }
}




// STORE OFFER FORM DATA TO THE DATABASE
const submitOfferData = async(req, res, next) => {
    try {
        const data = req.body;

        const condition = data.offerName.trim() != '' &  data.OfferPercentage.trim() != '' & data.startDate.trim() != '' & data.endDate.trim() != '';
        if(condition){
            
            const offer = offerData({
                offerName: data.offerName,
                minimumPurchase: data.minimumPurchase,
                OfferPercentage: data.OfferPercentage,
                startDate: data.startDate,
                endDate: data.endDate
            });
            
            const offerSubmit = await offer.save();

            if(offerSubmit){
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



// LOAD EDIT OFFER PAGE 
const loadEditOfferPage = async(req, res, next) => {
    try {
        const editOffer = await offerData.find({_id:req.params.id});

        const startDate = dateFormat(editOffer[0].startDate);
        const endDate = dateFormat(editOffer[0].endDate);

        res.render('admin/editOffer', { admin: true , editOfferData:editOffer , startDate , endDate});

    } catch (error) {
        next(error);
    }
}

const editOfferData = async(req, res, next) => {
    try {
        
        const data = req.body;

        const editSubmit = await offerData.updateOne({_id:data.id},{$set:{
            offerName: data.offerName,
            minimumPurchase: data.minimumPurchase,
            OfferPercentage: data.OfferPercentage,
            startDate: data.startDate,
            endDate: data.endDate
        }});

        if(editSubmit){
            res.json({success:true});
        }else{
            res.json({success:false});
        }

    } catch (error) {
        next(error);
    }
}


// OFFER DELETE
const deleteOffer = async(req, res, next) => {
    try {
        const offerId = req.body.offerId;

        const deleteOffer = await offerData.updateOne({_id:offerId},{$set:{status:true}});

        if(deleteOffer){
            res.json({success:true});
        }else{
            res.json({success:false});
        }
    } catch (error) {
        next(error);
    }
}


// PRODUCT OFFER APPLYING CONTROL
const productOfferApply = async(req, res, next) => {
    try {
        const data = req.body;
        console.log(data)
    } catch (error) {
        next(error);
    }
}

// CATEGORY  OFFER APPLY
const categoryOfferApply = async(req, res, next) => {
    try {
        const data = req.body;
        console.log(data)
    } catch (error) {
        next(error);
    }
}

// DATE FORMAT FUNCTION
function dateFormat(date){
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return formattedDate = year + '-' + month + '-' + day;
}

module.exports = {
    loadOfferList,
    loadAddOfferPage,
    loadEditOfferPage,
    submitOfferData,
    editOfferData,
    deleteOffer,
    productOfferApply,
    categoryOfferApply
    
}