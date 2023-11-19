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


const salesReportFilter = async(req, res, next)=>{
    try {

        const period = req.query.period;
        console.log(period)
        let startDate,endDate;

        if(period == 'week'){

            endDate = new Date();
            endDate.setDate(endDate.getDate() - endDate.getDay());
            startDate = new Date();
            startDate.setDate(startDate.getDate() - startDate.getDay() - 7);
           

        }else if(period == 'month'){

            startDate = new Date();
            startDate.setDate(1);
            endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);
            endDate.setDate(0);

        }else{
            startDate = new Date(0); 
            endDate = new Date();
        }

       

        const transactions = await orderData.aggregate([
            {
                $match:{
                    updatedAt:{
                        $gte: startDate,
                        $lte: endDate
                    },
                    'productInforamtion.paymentStatus': { $ne: 'Pending' }
                }
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
        
        res.render('admin/viewSalesReport', { admin: true ,totalTrancations:transactions});


    } catch (error) {
        next(error);
    }
}


module.exports = {
    loadSalesReportPage,
    salesReportFilter
}