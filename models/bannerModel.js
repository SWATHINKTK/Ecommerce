const moongose = require('mongoose');

const bannerSchema = moongose.Schema({
    offerName:{
        type : String,
        require : true
    },
    offerHeading:{
        type : String,
        require : true
    },
    offerDescription:{
        type:String,
        require:true
    },
    pageLink:{
        type : String,
        require : true
    },
    backgroundImage:{
        type : String,
        require : true
    },
    is_Listed: {
        type : Boolean,
        default : true 
    },
    is_Delete: {
        type : Boolean,
        default : false 
    },
},{timestamps: true});

module.exports = moongose.model('banner',bannerSchema);