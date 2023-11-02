const {userData} = require('../models/userModal');
const cartData = require('../models/cartModel');


// **** VIEW PRODUCT INSIDE THE CART ******
const loadCartPage = async(req,res)=>{

    try{

        const checkLogin = req.session.userId ? true : false;

        const id = req.session.userId;

        if(id){

            const cartProduct = await cartData.findOne({userId:id}).populate('cartProducts.productId')
            const data = cartProduct.cartProducts;
           
            res.render('user/viewCart',{user:true, title:'Cart', login:checkLogin, cartData : data });
        }


    }catch(error){

        console.log(error.message);
        res.redirect('/error500');

    }

}


// ***** PRODUCTS ADD TO THE CART DOCUMENT *****
const productAddToCart = async(req,res)=>{
    try{

        const userId = req.session.userId;
        const productId = req.body.id;
        const productQuantity = req.body.quantity;
        const productPrice = req.body.price;
        

        const user = await userData.findOne({_id:userId});

        const cartProductData ={
            quantity:productQuantity,
            price:productPrice,
            productId:productId,
        }

        if(user.cartProducts){
            console.log('cart update')
            
            const addMoreProduct = await cartData.updateOne({userId:userId},{$push:{cartProducts:cartProductData}});

            if(addMoreProduct){

                res.json({status:true});

            }else{

                res.json({status:false});

            }

        }else{

            console.log('new data')
            
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

        console.log(error.message);
        res.redirect('/error500');

    }
}



const cartQuantityUpdate = async (req,res) => {

    const id = req.session.userId;

    const data = req.body;

    const updateProduct = await cartData.updateOne({userId:id,'cartProducts.productId':data.id},{$set:{'cartProducts.$.quantity':data.quantity}});
    
    if(updateProduct.acknowledged){
        res.json({status:true});
    }else{
        res.json({status:false});
    }
}


const removeProductFromCart = async (req,res) => {
    
    const userId = req.session.userId
    const productId = req.params.id;

    const deleteProduct = await cartData.updateOne({ userId: userId }, { $pull: { cartProducts: { productId: productId } } });
    
    if(deleteProduct.acknowledged){
        res.json({status:true});
    }else{
        res.json({status:false});
    }
}

module.exports = {
    loadCartPage,
    productAddToCart,
    cartQuantityUpdate,
    removeProductFromCart
}