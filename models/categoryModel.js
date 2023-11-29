const mongoose = require('mongoose');

const addCategory = mongoose.Schema({
    categoryname : {
        type : String,
        require : true
    },
    description : {
        type : String,
        require : true
    },
    category_image : {
        type : String,
        require : true
    },
    offerApplied : {
        type : mongoose.Schema.Types.ObjectId
    },
    offerPercentage : {
        type : String
    }
    ,list : {
        type : Boolean,
        default : true
    },
    delete : {
        type : Boolean,
        default : false
    },
    deletedate : {
        type : Date
    }
});

const category = mongoose.model('categorys',addCategory);

module.exports = {
    category
};