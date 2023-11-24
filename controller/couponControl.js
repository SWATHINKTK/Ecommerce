const couponData = require('../models/couponModel');

// Load  Coupon List Window
const loadCouponList = async(req, res, next) => {
    try {

        const coupons = await couponData.aggregate([
            {
                $match:{is_Delete:false}
            }
        ])

        res.render('admin/viewCoupons', { admin: true ,couponData:coupons});
    } catch (error) {
        next(error);
    }
}

// Load Add Coupon page 
const loadAddCouponPage = async(req, res, next) => {
    try {
        res.render('admin/addCoupon', { admin: true });   
    } catch (error) {
        next(error);
    }
}


// SUBMIT COUPON DATA 
const submitCouponData = async(req, res, next) => {
    try {
        const data = req.body;

        const nanoidModule = await import('nanoid');
        let nanoid = nanoidModule.nanoid;
        const uniqueID = nanoid();

        const condition = data.couponName.trim() != '' & data.minimumPurchase.trim() != '' & data.OfferPercentage.trim() != '' & data.startDate.trim() != '' & data.endDate.trim() != '';
        if(condition){
            
            const coupon = couponData({
                couponCode: uniqueID,
                couponName: data.couponName,
                minimumPurchase: data.minimumPurchase,
                OfferPercentage: data.OfferPercentage,
                startDate: data.startDate,
                endDate: data.endDate
            });
            
            const couponSubmit = await coupon.save();

            if(couponSubmit){
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


// EDIT COUPON PAGE LOADING
const loadEditCouponPage = async(req, res, next) => {
    try {
        const couponId = req.query.couponId;

        const couponInfo = await couponData.find({_id:couponId});
        
        const startDate = dateFormat(couponInfo[0].startDate);
        const endDate = dateFormat(couponInfo[0].endDate);

        res.render('admin/editCoupon', { admin: true ,couponData:couponInfo[0] ,startDate, endDate}); 
    } catch (error) {
        
    }
}


const editCouponDataSubmit = async(req, res, next) => {
    try {
        const data = req.body;
        console.log(data)

        const condition = data.couponName.trim() != '' & data.minimumPurchase.trim() != '' & data.OfferPercentage.trim() != '' & data.startDate.trim() != '' & data.endDate.trim() != '';
        if(condition){

            const couponUpdate = await couponData.updateOne({_id:data.couponId},{
                couponName: data.couponName,
                minimumPurchase: data.minimumPurchase,
                OfferPercentage: data.OfferPercentage,
                startDate: data.startDate,
                endDate: data.endDate
            });


            if(couponUpdate){
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


// DELETE COUPON 
const deleteCoupon = async(req, res, next) => {
    try {
        const couponId = req.body.couponId;

        if(couponId){

            const couponUpdate = await couponData.updateOne({_id:couponId},{is_Delete:true});


            if(couponUpdate){
                res.json({success:true});
            }else{
                res.json({success:false});
            }

        }else{
            res.json({success:false});
        }

    } catch (error) {
        
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
    loadCouponList,
    loadAddCouponPage,
    submitCouponData,
    loadEditCouponPage,
    editCouponDataSubmit,
    deleteCoupon
}