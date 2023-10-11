const moongose = require('mongoose');

const userRegistration = moongose.Schema({
    username : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true
    },
    phonenumber : {
        type : Number,
        require : true
    },
    password : {
        type : String,
        require : true
    },
    _isVerified : {
        type : Boolean,
        default : false
    },
    joined_date : {
        type : Date, 
    }
})

const userData = moongose.model('users',userRegistration);

module.exports = {
    userData
}