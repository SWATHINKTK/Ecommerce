const orderData = require('../models/orderModel');
const {userData} = require('../models/userModal');
const {productInfo} =  require('../models/productModel');
const { format } = require('date-fns');

module.exports = {
    paidiagram: async()=>{

        // TOTAL SALES REPORT FETCHING ONLY DELIVERED PRODUCT
        const sales = await orderData.aggregate([
            {
                $unwind:'$productInforamtion'
            },
            {
                $match:{
                    "productInforamtion.paymentStatus":'Paid',
                    "productInforamtion.orderStatus":'Delivered'
                }
            },
            {
                $group:{
                    _id:"$paymentMethod",
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: '$productInforamtion.productTotalAmount' }
                }
            },
            {
                $sort: {
                    _id:1
                  }
            }
        ])

        // PENDING ORDERS TOTAL AMOOUNT AND TOTAL ORDER CALCULATION
        const pendingOrders = await orderData.aggregate([
            {
                $unwind:'$productInforamtion'
            },
            {
                $match:{
                    $or:[
                        {'productInforamtion.orderStatus':'Placed'},
                        {'productInforamtion.orderStatus':'Shipped'}
                    ]
                }
            },
            {
                $group:{
                    _id:null,
                    totalCount:{$sum:1},
                    totalAmount:{$sum:'$productInforamtion.productTotalAmount'}
                }
            }
        ])


        const timestamp = Date.now();
        const formattedDate = format(new Date(timestamp), 'dd MMM yyyy, hh:mma');


        const totalOrders = sales.reduce((sum, data) => sum + data.totalOrders, 0);
        const totalAmount = sales.reduce((sum, data) => sum + data.totalAmount, 0);

        const percentageData = sales.map((data) => ({
            paymentMethod: data._id,
            methodTotalAmount: data.totalAmount,
            methodTotalOrder: data.totalOrders,
            percentageOrders: (data.totalOrders / totalOrders) * 100,
            percentageAmount: ((data.totalAmount / totalAmount) * 100).toFixed(3),
          }));

          percentageData[3] = {
            totalOrders:totalOrders,
            totalAmount:totalAmount
          };

          percentageData[4] = {
            date:formattedDate
          };

          percentageData[5] = pendingOrders[0]


        return percentageData
    },

    reportOnTimePeriod: async(today , yesterday)=>{

        // const today = new Date();
        // today.setHours(0,0,0,0);

        // const yesterday = new Date();
        // yesterday.setDate(yesterday.getDate() - 1);
        // yesterday.setHours(0,0,0,0);
        // console.log(today.toLocaleString(),yesterday.toLocaleString())
        
        
        const yesterdayTotal = await orderData.aggregate([
            {
                $match:{
                    updatedAt: { $gte: yesterday, $lt: today },
                    'productInforamtion.paymentStatus':'Paid',
                    "productInforamtion.orderStatus":'Delivered'
                }
            },
            {
                $unwind:'$productInforamtion'
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    yesterdayRevenue: { $sum: '$productInforamtion.productTotalAmount' },
                },
            }
        ])



        const todayTotal = await orderData.aggregate([
            {
                $match:{
                    updatedAt: { $gte:today },
                    'productInforamtion.paymentStatus':'Paid',
                    "productInforamtion.orderStatus":'Delivered'
                }
            },
            {
                $unwind:'$productInforamtion'
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    yesterdayRevenue: { $sum: '$productInforamtion.productTotalAmount' },
                },
            }
        ])
       

        const growth = ((todayTotal[0].yesterdayRevenue - yesterdayTotal[0].yesterdayRevenue )/ yesterdayTotal[0].yesterdayRevenue)*100
        // console.log(growth)
    },

    leastSellingProduct:async()=>{
        const leastSelling = await orderData.aggregate([
            {
                $unwind:"$productInforamtion"
            },
            {
                $group:{
                    _id:"$productInforamtion.productId",
                    totalQuantitySold:{$sum:"$productInforamtion.productquantity"}
                }
            },
            {
                $sort:{totalQuantitySold:-1}
            },
            {
                $limit:3
            },
            {
                $lookup:{
                    from:'products',
                    localField:'_id',
                    foreignField:'_id',
                    as:'productData'
                }
            }
        ])
        return leastSelling;
    },

    pendingProduct:async()=>{
        const pendingOrders = await orderData.aggregate([
            {
                $match:{$or:[
                    {'productInforamtion.orderStatus':'Placed'},
                    {'productInforamtion.orderStatus':'Shipped'}
                ]}
            },
            {
                $unwind:'$productInforamtion'
            },
            {
                $lookup:{
                    from:'products',
                    localField:'productInforamtion.productId',
                    foreignField:'_id',
                    as:'productData'
                }
            }
        ])

        return pendingOrders;
    },

    totalDataFirstSection:async()=>{
        const totalUsers = await userData.aggregate([
            {
                $group:{
                    _id:null,
                    totalUsers:{$sum:1}
                }
            }
        ])
        const totalOrders = await orderData.aggregate([
            {
                $group:{
                    _id:null,
                    totalOrders:{$sum:1}
                }
            }
        ])

        const totalProducts = await productInfo.aggregate([
            {
                $group:{
                    _id:null,
                    totalProducts:{$sum:1}
                }
            }
        ])
        

        const totalData = {
            totalUsers : totalUsers[0].totalUsers,
            totalProducts : totalProducts[0].totalProducts,
            totalOrders : totalOrders[0].totalOrders,
        }

        return totalData;
    },
    salesChart:async()=>{
        // const { interval } = req.query;

        
        let groupBy;
    
        // switch (interval) {
        //     case 'week':
        //     groupBy = { $week: '$updatedAt' };
        //     break;
        //     case 'month':
        //     groupBy = { $month: '$updatedAt' };
        //     break;
        //     case 'year':
        //     groupBy = { $year: '$updatedAt' };
        //     break;
        //     default:
                // groupBy = { $month: '$updatedAt' };
                groupBy = { $dayOfYear: '$updatedAt' }; 
        // }
    
        try {
            const salesData = await orderData.aggregate([
            {
                $unwind: '$productInforamtion' // Unwind the productInformation array
            },
            {
                $match: {
                'productInforamtion.paymentStatus': 'Paid'
                }
            },
            {
                $group: {
                _id: groupBy,
                totalSales: { $sum: '$productInforamtion.productTotalAmount' } // Update with the actual property of your sales data
                }
            },
            {
                $sort:{_id:1}
            }
            ]);
            
    
            const totalAmount = salesData.reduce((total,val) => {
                return total+val.totalSales
            },0)
    
    
            const percentageAmount = salesData.forEach(amount => {
                amount.totalPercentage = (amount.totalSales/totalAmount)*100;
            });
    
          return salesData;
        }catch(error){
            console.log(error.message);
        }
    }
}