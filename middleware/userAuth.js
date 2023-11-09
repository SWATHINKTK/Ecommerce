const cartData = require('../models/cartModel');

const isUserLogin = (req,res,next) =>{
    try{

        if(!(req.session.userId)){
            // console.log(req.url)
            res.redirect('/login')
        }
        res.locals.count = getCartCount();
        next();
    }catch(error){
        console.log(error.message);
    }
   
}


// *** 

module.exports = {isUserLogin};