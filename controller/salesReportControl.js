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
        let startDate,endDate;

        if(req.query.startDate){

            startDate = new Date(req.query.startDate); 
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(req.query.endDate);
            endDate.setHours(23, 59, 59, 999);

        }else if(period == 'week'){

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

        // DATE IS CONVERTED TO YYYY-MM-DD FORMAT
        let date;
        if(req.query.startDate){

            date = {
                startDate:dateFormat(startDate),
                endDate:dateFormat(endDate),
            }
            
        }
        
        res.render('admin/viewSalesReport', { admin: true ,totalTrancations:transactions, date});


    } catch (error) {
        next(error);
    }
}

function dateFormat(date){
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return formattedDate = year + '-' + month + '-' + day;
}


module.exports = {
    loadSalesReportPage,
    salesReportFilter
}