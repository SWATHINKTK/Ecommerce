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
            ref : 'products',
            require:true
        },
        productPrice:{
            type:Number,
            require:true
        },
        productTotalAmount:{
            type:Number,
            require:true
        },
        productquantity:{
            type:Number,
            require:true
        },
        orderStatus:{
            type:String,
            default:'Placed',
            require:true
        },
        paymentStatus:{
            type:String,
            default:'Pending',
            require:true
        },
        MRP:{
            type:Number,
            require:true
        },
        discountAmount:{
            type:Number,
            default:0
        },
        reason:{
            type:String
        }
    }],
    userId:{
        type:moongose.Schema.Types.ObjectId,
        ref : 'users',
        require:true
    },
    order_id:{
        type : String,
        require : true
    },
    totalAmount:{
        type:Number,
        require:true
    },
    paymentMethod:{
        type:String,
        require:true
    },
    paymentStatus:{
        type:String,
        default:'Pending',
        require:true
    },
    couponId:{
        type:moongose.Schema.Types.ObjectId,
    },
    couponOfferPercentage:{
        type:Number
    }
},{timestamps: true});


module.exports = moongose.model('orderData',orderModel);