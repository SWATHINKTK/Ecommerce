const addressData = require('../models/addressModel');
const {productInfo} = require('../models/adminModel');

const LoadCheckoutPage = async(req,res) => {

    try{

        const checkLogin = req.session.userId ? true : false;
        const userId = req.session.userId;
        const productId = req.query.id;

        const addressInfo = await addressData.find({userId:userId});
        const productData = await productInfo.findOne({_id:productId});
        
        res.render('user/checkout',{user:true, title:'CheckOut', login:checkLogin, address:addressInfo, product:productData});

    }catch(error){
        console.log(error.message);
    }

}

module.exports = {
    LoadCheckoutPage
}