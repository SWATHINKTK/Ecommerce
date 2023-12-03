const {userData} = require('../models/userModal');
const cartData = require('../models/cartModel');
const wishlistData = require('../models/wishlistModel')


// **** VIEW PRODUCT INSIDE THE CART ******
const loadCartPage = async(req, res, next)=>{

    try{

        const checkLogin = req.session.userId ? true : false;

        const id = req.session.userId;

        const cartProduct = await cartData.findOne({userId:id})

        if(cartProduct){

            const cartProduct = await cartData.findOne({userId:id}).populate('cartProducts.productId');
            const data = cartProduct.cartProducts;

            const wishlist = await wishlistData.findOne({userId:id});
           
            res.render('user/viewCart',{user:true, title:'Cart', login:checkLogin, cartData : data ,wishlistData:wishlist ,cartExist:true,});
            
        }else{

            res.render('user/viewCart',{user:true, title:'Cart', login:checkLogin ,cartExist:false});

        }


    }catch(error){
        next(error);
    }

}


// ***** PRODUCTS ADD TO THE CART DOCUMENT *****
const productAddToCart = async(req, res, next)=>{
    try{

        const userId = req.session.userId;
        const productId = req.body.id;
        const productQuantity = req.body.quantity;
        const productPrice = req.body.price; 

        const cartExist = await cartData.findOne({userId:userId});

        const cartProductData ={
            quantity:productQuantity,
            price:productPrice,
            productId:productId,
        }

        if(cartExist){
            
            const addMoreProduct = await cartData.updateOne({userId:userId},{$push:{cartProducts:cartProductData}});

            if(addMoreProduct){

                res.json({status:true});

            }else{

                res.json({status:false});

            }

        }else{

            const cartInfo = cartData({
                userId:userId,
                cartProducts:cartProductData
            });
        
            const userUpdate = await userData.updateOne({_id:userId},{$set:{cartProducts:cartInfo._id}},{upsert:true});
            
            if(userUpdate){

                const serverStore = cartInfo.save();

                if(serverStore){

                    res.json({status:true});

                }else{

                    res.json({status:false});

                }

            }else{

                res.json({status:false});

            }
        }

        

    }catch(error){
        next(error);
    }
}



const cartQuantityUpdate = async (req, res, next) => {
    try {
        const id = req.session.userId;

        const data = req.body;

        const updateProduct = await cartData.updateOne({userId:id,'cartProducts.productId':data.id},{$set:{'cartProducts.$.quantity':data.quantity}});
        
        if(updateProduct.acknowledged){
            res.json({status:true});
        }else{
            res.json({status:false});
        }
    } catch (error) {
        next(error);
    }
}



// **** REMOVE CART ****
const removeProductFromCart = async (req, res, next) => {
    try {
        const userId = req.session.userId
        const productId = req.body.productId;

        console.log('cartRemove')

        console.log(productId)

        const cartInfo = await cartData.findOne({userId:userId});

        console.log(cartInfo)

        if(cartInfo.cartProducts.length == 1){

            const deleteCart = await cartData.deleteOne({userId:userId});
            
            if(deleteCart){
                res.json({status:true});
            }else{
                res.json({status:false});
            }

        }else{

            const deleteProduct = await cartData.updateOne({ userId: userId }, { $pull: { cartProducts: { productId: productId } } });

            
            if(deleteProduct.acknowledged){
                res.json({status:true});
            }else{
                res.json({status:false});
            }

        }   
    } catch (error) {
        next(error)
    }
}

module.exports = {
    loadCartPage,
    productAddToCart,
    cartQuantityUpdate,
    removeProductFromCart
}