const orderData = require('../models/orderModel');
module.exports = {
    paidiagram: async()=>{
        const sales = await orderData.aggregate([
            {
                $match:{
                    paymentStatus:'Paid',
                    "productInforamtion.orderStatus":'Delivered'
                }
            },
            {
                $unwind:'$productInforamtion'
            },
            {
                $group:{
                    _id:"$paymentMethod",
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: '$productInforamtion.productTotalAmount' }
                }
            }
        ])
        return sales
    }
}