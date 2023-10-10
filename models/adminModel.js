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
    deletedate : {
        type : Date
    }
})

const loginData = mongoose.model('adminlogin',adminLogin);
const category = mongoose.model('categorys',addCategory)

module.exports = {
    loginData,
    category
};