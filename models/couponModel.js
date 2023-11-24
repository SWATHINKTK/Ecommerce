const moongose = require('mongoose');

const couponSchema = moongose.Schema({
    couponCode:{
        type : String,
        require : true
    },couponName:{
        type : String,
        require : true
    },
    minimumPurchase:{
        type : String,
        require : true
    },
    OfferPercentage:{
        type:String,
        require:true
    },
    startDate:{
        type : Date,
        require : true
    },
    endDate:{
        type : Date,
        require : true
    },
    is_Delete:{
        type : Boolean,
        default : false
    }
},{timestamps: true});

module.exports = moongose.model('coupon',couponSchema);