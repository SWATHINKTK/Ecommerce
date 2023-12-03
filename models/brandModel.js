const mongoose = require('mongoose');

const brandData = mongoose.Schema({
    brand_name:{
        type : String,
        require : true
    },
    brand_logo:{
        type : String,
        require : true
    },
    status:{
        type:Boolean,
        default:true
    },
    brandDataUpdate_Date:{
        type : Date,
    },
    brand_addDate:{
        type : Date,
        require : true
    },
    brand_unlistDate:{
        type : Date,
    }
});

const brandInfo = mongoose.model('brands',brandData)

module.exports = {
    brandInfo
};