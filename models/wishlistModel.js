const moongose = require('mongoose');

const wishlistModel = moongose.Schema({
    userId : {
        type : moongose.Schema.Types.ObjectId,
        ref : 'users',
        require : true
    },
    wishlistProducts : [{
        type : moongose.Schema.Types.ObjectId,
        ref : 'products',
        require : true
    }]
},{timestamps: true});

module.exports = moongose.model('wishlist',wishlistModel);