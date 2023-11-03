const moongose = require('mongoose');

const cartModel = moongose.Schema({
    userId : {
        type : moongose.Schema.Types.ObjectId,
        require : true
    },
    cartProducts : [{
      quantity:{
        type : Number,
        default : 0,
        require : true
      },
      price : {
        type : Number,
        require : true
      },
      productId :{
        type : moongose.Schema.Types.ObjectId,
        ref : 'products',
        require : true
      }
    }]
})

module.exports = moongose.model('carts',cartModel);