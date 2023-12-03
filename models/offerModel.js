const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
   offerName:{
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
    AppliedProducts : {
        type : [mongoose.Schema.Types.ObjectId],
        require : true
    },
    AppliedCategorys : {
        type : [mongoose.Schema.Types.ObjectId],
        require : true
    },
    status:{
        type : Boolean,
        default : false
    }
},{timestamps: true});

module.exports = mongoose.model('offer', offerSchema);