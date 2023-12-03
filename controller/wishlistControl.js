const { default: mongoose } = require('mongoose');
const wishlistData = require('../models/wishlistModel');


// **** ADDPRODUCT TO WISHLIST ****
const addProductToWishlist = async(req, res, next) => {

    try {
        const productId = req.body.productId;

        const userId = req.session.userId;

        // Wishlist Exist and Wishlist Array Product Existence Checking
        const wishlistExist = await wishlistData.findOne({userId:userId});

        
        // Wishlist Existence Checking
        if(wishlistExist){


            const productExistWishlist = wishlistExist.wishlistProducts.includes(productId);

            // This Product is Existing That wishlist Checking Condition
            if(productExistWishlist){
            
                const removeWishlist = await wishlistData.updateOne({userId:userId},{$pull:{wishlistProducts:productId}});
                
                if(removeWishlist){
                    res.json({status:true,removed:true});
                }else{
                    throw new Error('Data is Not Found');
                }
                return;

            }else{

                const addToWishlist = await wishlistData.updateOne({userId:userId},{$push:{wishlistProducts:productId}});

                if(addToWishlist){
                    res.json({status:true})
                }else{
                    res.json({status:false});
                }
            }

        }else{
                       
            const newList = wishlistData({
                userId:userId,
                wishlistProducts:productId
            });

            const createNewWishlist = await newList.save();

            if(createNewWishlist){
                res.json({status:true})
            }else{
                res.json({status:false})
            }
        }

    } catch (error) {
        next(error);
    }
};




// **** VIEW WISHLIST PRODUCT ****
const viewWishlistProduct = async(req, res, next) => {
    try {

        const checkLogin = req.session.userId ? true : false;
        
        const userId = req.session.userId;

        const wishList = await wishlistData.aggregate([
            {
                $match:{
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $unwind:'$wishlistProducts'
            },
            {
                $lookup:{
                    from:'products',
                    localField:'wishlistProducts',
                    foreignField:'_id',
                    as:'productData'
                }
            },
            {
                $unwind:'$productData'
            }
        ]);

        
        if(wishList){
            res.render('user/viewWishlistProduct',{user:true, title:'Wishlist', login:checkLogin ,wishlistData:wishList});
        }else{
            throw new Error('Data is Not Found');
        }
        
    } catch (error) {
        next(error);
    }
}





// *** REMOVE PRODUCT IN WISHLIST ****
const removeWishlistProduct = async(req,res)=>{

    try {

        const userId = req.session.userId;
        const data = req.body;

        const removeWishlist = await wishlistData.updateOne({userId:userId},{$pull:{wishlistProducts:data.productId}});

        if(removeWishlist){
            res.json({status:true});
        }else{
            res.json({staus:false})
        }

    } catch (error) {
        next(error);
    }
}



module.exports = {
    addProductToWishlist,
    viewWishlistProduct,
    removeWishlistProduct
};