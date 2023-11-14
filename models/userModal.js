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
    cartProducts : {
        type : moongose.Schema.Types.ObjectId
    },
    walletAmount : {
        type : Number,
        default : 0,
        require : true
    },
    walletTransaction : [{

        transactionId : {
            type : String,
            require : true
        },
        transactionType: { 
            type: String, 
            enum: ['Deposit', 'Withdrawal', 'Purchase', 'Refund'], 
            required: true 
        },
        amount: { 
            type: Number, 
            required: true 
        },
        Date : {
            type : Date,
            default: Date.now 
        },
        description : {
            type : String
        },
        orderId : {
            type : String,
        },
    }],
    _isVerified : {
        type : Boolean,
        require : true
    },
    block : {
        type: Boolean,
        default : false
    },
    block_date : {
        type : Date
    },
    joined_date : {
        type : Date,
        require : true 
    }
})

const userData = moongose.model('users',userRegistration);

module.exports = {
    userData
};