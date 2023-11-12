const mongoose = require('mongoose');

const adminLogin = mongoose.Schema({
    username : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true
    },
    adminname : {
        type : String,
        require : true
    }

});




const loginData = mongoose.model('adminlogin',adminLogin);

module.exports = {
    loginData
};