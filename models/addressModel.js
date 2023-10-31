const mongoose = require('mongoose');

const userAddress = mongoose.Schema({
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        require:true
    },
    username:{
        type : String,
        require:true
    },
    phoneNumber:{
        type : Number,
        require:true
    },
    pincode:{
        type : Number,
        require:true
    },
    locality:{
        type : String,
        require:true
    },
    address:{
        type : String,
        require:true
    },
    city:{
        type : String,
        require:true
    },
    district:{
        type : String,
        require:true
    },
    landmark:{
        type : String
    },
    alternateNumber:{
        type : String
    }
    
});


module.exports = mongoose.model('address',userAddress);