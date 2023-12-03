const offerData = require('../models/offerModel');
const { productInfo } = require('../models/productModel');
const { category } = require('../models/categoryModel');
const mongoose = require('mongoose')

// LOAD OFFER LIST PAGE
const loadOfferList = async(req, res, next) => {
    try {

        const offer = await offerData.aggregate([
            {
                $sort:{status:1,updatedAt:-1}
            }
        ])

        res.render('admin/viewOffer', { admin: true , offerData:offer});
    } catch (error) {
        next(error);
    }
}


// LOAD ADD OFFER PAGE 
const loadAddOfferPage = (req, res, next) => {
    try {
        res.render('admin/addOffer', { admin: true });
    } catch (error) {
        next(error);
    }
}




// STORE OFFER FORM DATA TO THE DATABASE
const submitOfferData = async(req, res, next) => {
    try {
        const data = req.body;

        const condition = data.offerName.trim() != '' &  data.OfferPercentage.trim() != '' & data.startDate.trim() != '' & data.endDate.trim() != '';
        if(condition){
            
            const offer = offerData({
                offerName: data.offerName,
                minimumPurchase: data.minimumPurchase,
                OfferPercentage: data.OfferPercentage,
                startDate: data.startDate,
                endDate: data.endDate
            });
            
            const offerSubmit = await offer.save();

            if(offerSubmit){
                res.json({success:true});
            }else{
                res.json({success:false});
            }

        }else{
            res.json({success:false});
        }
    } catch (error) {
        next(error);
    }
}



// LOAD EDIT OFFER PAGE 
const loadEditOfferPage = async(req, res, next) => {
    try {
        const editOffer = await offerData.find({_id:req.params.id});

        const startDate = dateFormat(editOffer[0].startDate);
        const endDate = dateFormat(editOffer[0].endDate);

        res.render('admin/editOffer', { admin: true , editOfferData:editOffer , startDate , endDate});

    } catch (error) {
        next(error);
    }
}

const editOfferData = async(req, res, next) => {
    try {
        
        const data = req.body;

        const editSubmit = await offerData.updateOne({_id:data.id},{$set:{
            offerName: data.offerName,
            minimumPurchase: data.minimumPurchase,
            OfferPercentage: data.OfferPercentage,
            startDate: data.startDate,
            endDate: data.endDate
        }});

        if(editSubmit){
            res.json({success:true});
        }else{
            res.json({success:false});
        }

    } catch (error) {
        next(error);
    }
}


// OFFER DELETE
const deleteOffer = async(req, res, next) => {
    try {
        const offerId = req.body.offerId;

        const deleteOffer = await offerData.updateOne({_id:offerId},{$set:{status:true}});

        if(deleteOffer){
            res.json({success:true});
        }else{
            res.json({success:false});
        }
    } catch (error) {
        next(error);
    }
}


// PRODUCT OFFER APPLYING CONTROLLER
const productOfferApply = async(req, res, next) => {
    try {
        const data = req.body;
        
        const product = await productInfo.findOne({_id:data.productId});
        
        const offer = await offerData.findOne({_id:data.offerId});

            const productPrice = parseFloat(product.MRP)
            let amount =  productPrice - (productPrice * offer.OfferPercentage / 100);
            amount = amount.toFixed(2);

            const offerApply = await offerUpdateCategory(product._id, offer, amount);

            const updateOfferData = await offerData.updateOne(
                {
                    _id:data.offerId,
                    AppliedProducts:{$ne:data.productId}
                },
                {
                    $push:{AppliedProducts:data.productId}
                });

            if(updateOfferData){
                res.json({offerApplied:true});
            }else{
                res.json({offerApplied:false});
            }


        console.log(offer)
    } catch (error) {
        next(error);
    }
}



// REMOVE PRODUCT OFFER 
const productOfferRemove = async(req, res, next) => {
    try {
        const data = req.body;

        const product = await productInfo.findOne({_id:data.productId});

        const offerRemove = await offerData.updateOne({ _id:data.offerId },{ $pull: { AppliedProducts: data.productId } });


        const removeProductOffer = await productInfo.updateOne(
            {
                _id:data.productId
            },
            {
                $set:{price:product.MRP},
                $unset: {
                    offerId: 1,
                    offerPercentage: 1
                }
            });

        if(removeProductOffer){
            res.json({offerRemove:true});
        }else{
            res.json({offerRemove:false});
        }
   

    } catch (error) {
        
    }
}





// CATEGORY  OFFER APPLY
const categoryOfferApply = async(req, res, next) => {
    try {
        const data = req.body;

        const offer = await offerData.findOne({_id:data.offerId});

        const productData = await productInfo.aggregate([
            {
                $match: {
                    categoryIds: {
                    $elemMatch: {
                      $eq: new mongoose.Types.ObjectId(data.categoryId)
                    }
                  }
                }
            }
        ]);

        for (const product of productData) {

            try {

                const productPrice = parseFloat(product.MRP)
                let amount =  productPrice - (productPrice * offer.OfferPercentage / 100);
                amount = amount.toFixed(2);

              if(product.offerId && product.offerPercentage >= offer.OfferPercentage){
              }else{    
                    const offerApply = await offerUpdateCategory(product._id, offer, amount);
              }

            } catch (error) {
                next(error);
            }
        }

        const updateOfferData = await offerData.updateOne(
            {
                _id:data.offerId,
                AppliedCategorys:{$ne:data.categoryId}
            },
            {
                $push:{AppliedCategorys:data.categoryId}
            });

        const updateCategory = await category.updateOne({_id:data.categoryId},{$set:{offerApplied:offer._id,offerPercentage:offer.OfferPercentage}},{upsert:true});

        if(updateCategory){
            res.json({offerApplied:true, offerName:offer.offerName, offerPercentage:offer.OfferPercentage});
        }else{
            res.json({offerApplied:false});
        }

    } catch (error) {
        next(error);
    }
}


// CATEGORY OFFER REMOVE 
const categoryOfferRemove = async(req, res, next) => {
    try {
        const data = req.body;
        const productData = await productInfo.aggregate([
            {
                $match: {
                    categoryIds: {
                    $elemMatch: {
                      $eq: new mongoose.Types.ObjectId(data.categoryId)
                    }
                  }
                }
            }
        ]);
        for (const product of productData) {
            try {
                const productCategoryOffer = await productInfo.updateOne(
                    {
                        _id:product._id
                    },
                    {
                        $set:{price:product.MRP},
                        $unset: {
                            offerId: 1,
                            offerPercentage: 1
                        }
                    })
            } catch (error) {
                next(error);
            }
        }

        const offerUpdate = await offerData.updateOne({ _id:data.offerId },{ $pull: { AppliedCategorys: data.categoryId } });

        const updateCategory = await category.updateOne({_id:data.categoryId},{$unset:{offerApplied:1,offerName:1}});

        if(updateCategory){
            res.json({offerApplied:true});
        }else{
            res.json({offerApplied:false});
        }
        
    } catch (error) {
        next(error);
    }
}







// FUNCTION FOR CATEGORY OFFER APPLYING
async function offerUpdateCategory(productId, offer, amount){
    
    try {
        const productAddCategoryOffer = await productInfo.updateOne(
            {
                _id:productId
            },
            {
                $set:{
                    offerPercentage:offer.OfferPercentage,
                    offerId:offer._id,
                    price:amount
                }
            },
            {
                upsert:true
            },
        );
        return productAddCategoryOffer;
    } catch (error) {
        console.log(error.message);
    }
}


// DATE FORMAT FUNCTION
function dateFormat(date){
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return formattedDate = year + '-' + month + '-' + day;
}

module.exports = {
    loadOfferList,
    loadAddOfferPage,
    loadEditOfferPage,
    submitOfferData,
    editOfferData,
    deleteOffer,
    productOfferApply,
    productOfferRemove,
    categoryOfferApply,
    categoryOfferRemove
    
}