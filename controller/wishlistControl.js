const wishlistData = require('../models/wishlistModel');



const addProductToWishlist = async(req,res) => {

    const productId = req.params.productId;

    console.log(productId)
    const userId = req.session.userId;

    // Wishlist Exist and Wishlist Array Product Existence Checking
    const wishlistExist = await wishlistData.findOne({userId:userId});
    const productExistWishlist = wishlistExist.wishlistProducts.includes(productId);

    // Product EXistence Checking
    if(productExistWishlist){
        
        const removeWishlist = await wishlistData.updateOne({userId:userId},{$pull:{wishlistProducts:productId}});
        
        if(removeWishlist){
            res.json({status:true,removed:true});
        }
        return;
    }

    
    // Wishlist Existence Check.Not Existing else Condition To Create.Other Wise Update The Array.
    if(wishlistExist){

        const addToWishlist = await wishlistData.updateOne({userId:userId},{$push:{wishlistProducts:productId}});

        if(addToWishlist){
            res.json({status:true})
        }else{
            res.json({status:false});
        }

    }else{
        
        const newList = wishlistData({
            userId:userId,
            wishlistProducts:productId
        });

        const createNewWishlist = await newList.save();

        console.log(newList,createNewWishlist)
        if(createNewWishlist){
            res.json({status:true})
        }else{
            res.json({status:false})
        }
    }
}

module.exports = {
    addProductToWishlist
};