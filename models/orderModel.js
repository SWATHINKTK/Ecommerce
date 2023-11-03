const moongose = require('mongoose');

const orderModel = moongose.Schema({
    addressInformation : {
        username:{
            type:String,
            require:true
        },
        phonenumber:{
            type:Number,
            require:true
        },
        pincode:{
            type:Number,
            require:true
        },
        locality:{
            type:String,
            require:true
        },
        address:{
            type:String,
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
    },
    productInforamtion : [{
        productId:{
            type:moongose.Schema.Types.ObjectId,
            require:true
        },
        productPrice:{
            type:Number,
            require:true
        },
        productquantity:{
            type:Number,
            require:true
        }
    }],
    userId:{
        type:moongose.Schema.Types.ObjectId,
        require:true
    },
    paymentMethod:{
        type:String,
        require:true
    },
    paymentStatus:{
        type:String,
        require:true
    },
    orderStatus:{
        type:String,
        default:'Pending',
        require:true
    },
},{timestamp:true});


module.exports = moongose.model('orderData',orderModel);