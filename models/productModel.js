const mongoose = require('mongoose');

const productData = mongoose.Schema({
    productName : {
        type : String,
        require : true
    },
    categoryIds : {
        type : [mongoose.Schema.Types.ObjectId],
        require : true
    },
    description : {
        type : String,
        require : true
    },
    brandname : {
        type : mongoose.Schema.Types.ObjectId,
        require : true
    },
    stock : {
        type : Number,
        require : true
    },
    price : {
        type : Number,
        require : true
    },
    MRP : {
        type : Number,
        require : true
    },
    offerPercentage : {
        type : Number,
    },
    offerId : {
        type : mongoose.Schema.Types.ObjectId,
    },
    size : {
        type : String,
        require : true
    },
    material : {
        type : String,
        require : true
    },
    color : {
        type : String,
        require : true
    },
    productImages : {
        type : [String],
        require : true
    },
    specifications : {
        type : [String],
        require : true
    },
    status : {
        type : Boolean,
        default : true
    },
    review :[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            require:true
        },
        rating:{
            type:Number,
            require:true
        },
        feedback:{
            type:String,
            require:true
        },
        feedbackDate : {
            type : Date,
            default:new Date()
        }
       
    }],
    addDate : {
        type : Date,
        require : true
    },
    listDate : {
        type : Date,
    },
    updateDate : {
        type : Date,
    }
});

const productInfo = mongoose.model('products',productData);

module.exports = {
    productInfo
};