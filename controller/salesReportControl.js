const orderData = require('../models/orderModel')
const loadSalesReportPage = async(req, res, next) => {

    try {

        const totalTrancations = await orderData.aggregate([
            {
                $match:{'productInforamtion.paymentStatus': { $ne: 'Pending' }}
            },
            {
                $unwind:"$productInforamtion"
            },
            {
                $lookup:{
                    from:'products',
                    localField:'productInforamtion.productId',
                    foreignField:'_id',
                    as:'productData'
                }
            },
            {
                $lookup:{
                    from:'users',
                    localField:'userId',
                    foreignField:'_id',
                    as:'userData'
                }
            },
            {
                $unwind:"$userData"
            },
            {
                $unwind:"$productData"
            },
            {
                $project:{
                    _id:1,
                    productInforamtion:1,
                    username:"$userData.username",
                    userId:1,
                    order_id:1,
                    productName:"$productData.productName",
                    paymentMethod:1,
                    paymentStatus:1,
                    createdAt:1,
                    updatedAt:1, 
                }
            }
        ])


        res.render('admin/viewSalesReport', { admin: true ,totalTrancations});
    } catch (error) {
        next(error)
    }
}


module.exports = {
    loadSalesReportPage
}