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
    rating : {
        type : String,
        default : 5
    },
    feedback : {
        type : String,
        default :'Good'
    },
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