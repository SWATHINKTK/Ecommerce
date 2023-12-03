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

<<<<<<< HEAD
const addCategory = mongoose.Schema({
    categoryname : {
        type : String,
        require : true
    },
    description : {
        type : String,
        require : true
    },
    list : {
        type : Boolean,
        default : true
    },
    delete : {
        type : Boolean,
        default : false
    },
    listedDate : {
        type : Date
    }
})
=======


>>>>>>> master

const loginData = mongoose.model('adminlogin',adminLogin);

module.exports = {
    loginData
};