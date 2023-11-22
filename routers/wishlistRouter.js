const express = require('express');
const wishlistRouter = express();

const wishlistController = require('../controller/wishlistControl');
const auth = require('../middleware/userAuth');

wishlistRouter.use(express.urlencoded({extended:true}));
wishlistRouter.use(express.json());

wishlistRouter.post('/addWishlist', auth.isUserLogin, wishlistController.addProductToWishlist);
wishlistRouter.get('/viewWishlist', auth.isUserLogin, wishlistController.viewWishlistProduct);

wishlistRouter.delete('/removeWishlistProduct',auth.isUserLogin, wishlistController.removeWishlistProduct);


// const puppeteer = require('puppeteer');
// const orderData = require('../models/orderModel');
// const mongoose = require('mongoose');
// wishlistRouter.get('/pdfdownload', async (req, res) => {
//     try {
//       // Generate PDF using Puppeteer
//       const browser = await puppeteer.launch();
//       const page = await browser.newPage();
  
//       const orderDetails = await orderData.aggregate([
//         {
//             $match:{
//                 _id:new mongoose.Types.ObjectId('655508f644854a980ac3cb6e')
//             }
//         },
//         {
//             $unwind: "$productInforamtion"
//         },
//         {
//             $lookup: {
//                 from: 'products',
//                 localField: 'productInforamtion.productId',
//                 foreignField: '_id',
//                 as: 'productData'
//             }

//         }
      
//     ]);
  
    //   const divContent = `
    //     <div class="col-12" >
    //       <div class="card border" style="height:96vh;">
    //       <h2 class="card-title text-center font-weight-blod mt-5">INVOICE</h2>
    //         <div class="card-body mt-5">
    //         <div class="pl-4 pt-4 pr-4 pb-1">
    //       <ul type="none">
    //           <div class="d-flex mt-4">
    //               <li class="order-manage-li">Order Id &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</li><span class=" ml-5">:&nbsp;&nbsp;${orderDetails[0].order_id}</span>
    //           </div>
    //           <div class="d-flex mt-1">
    //               <li class="order-manage-li">Placed On &nbsp;&nbsp;&nbsp;</li><span class=" ml-5">: &nbsp;${orderDetails[0].createdAt}</span>
    //           </div>
    //           <div class="d-flex mt-2 ">
    //               <li class="order-manage-li mt-1">Shipping Address &nbsp; : </li>&nbsp; 
    //               <div class="mt-2">
    //                   <h5>  &nbsp;${orderDetails[0].addressInformation.username} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${orderDetails[0].addressInformation.phonenumber}</h5>
    //                   <p class="ml-1">${orderDetails[0].addressInformation.address} , ${orderDetails[0].addressInformation.locality} , ${orderDetails[0].addressInformation.city} , ${orderDetails[0].addressInformation.district}<br>
    //                   ${orderDetails[0].addressInformation.pincode}</p>
    //               </div>
    //           </div>
    //           <div class="d-flex mt-1">
    //               <li class="order-manage-li">Payment Method &nbsp;&nbsp;&nbsp;</li><span class=""> : &nbsp;&nbsp; ${orderDetails[0].paymentMethod}</span>
    //           </div>
    //           <div class="d-flex mt-2">
    //               <li class="order-manage-li">Price  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</li><span class=" ml-5"> : &nbsp;<i class="bi bi-currency-rupee"></i> ${orderDetails[0].totalAmount}</span>
    //           </div>
    //       </ul>
    //   </div>
    //   <hr style="border: none; border-top: 2px solid #F5F5F9; width:86%; margin-top:19px; margin-bottom:15px;">
    //           <div class="d-flex ml-3 mt-3 mb-3" style="margin-left:25px; padding-bottom:15px; padding-top:25px;">
    //             <div class="ml-5">
    //               <h5 class="font-weight-blod">Billing Address</h5>
    //               <div class="mt-2 ml-3">
    //                   <h5>  &nbsp;${orderDetails[0].addressInformation.username} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${orderDetails[0].addressInformation.phonenumber}</h5>
    //                   <p class="ml-1">${orderDetails[0].addressInformation.address} , ${orderDetails[0].addressInformation.locality} , ${orderDetails[0].addressInformation.city} , ${orderDetails[0].addressInformation.district}<br>
    //                   ${orderDetails[0].addressInformation.pincode}</p>
    //               </div>
    //             </div>
    //           </div>
    //           <div class="table-responsive">
    //             <table class="table table-bordered">
    //               <thead>
    //                 <tr>
    //                   <th>#</th>
    //                   <th>Product Name</th>
    //                   <th>Qty</th>
    //                   <th>Product Price</th>
    //                   <th>Total Amount</th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //               ${orderDetails[0].productData.map((data, index) =>
    //                 `<tr>
    //                     <th>${index + 1}</th>
    //                     <td>${data.productName}</td>
    //                     <td>${orderDetails[0].productInforamtion.productquantity}</td>
    //                     <td>${orderDetails[0].productInforamtion.productPrice}</td>
    //                     <td>${orderDetails[0].productInforamtion.productTotalAmount}</td>
    //                 </tr>`
    //             ).join('')}
                
                  

    //               </tbody>
    //             </table>
    //             <div class="d-flex justify-content-end">
    //                 <img src="http://localhost:5000/public/admin/assets/images/logoMaleFashion.png" style="width: 200px; height: 200px;" alt="">
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   `;
  
//       // Set the HTML content of the page
//       await page.setContent(divContent);
  
//       // Add Bootstrap CDN link dynamically
//       await page.addStyleTag({ url: 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css' });
  
//       // Print PDF of the div with margins and border
//       const pdfBuffer = await page.pdf({
//         path: 'invoice_from_div_with_border.pdf',
//         printBackground: true,
//         margin: {
//           top: '60px',
//           right: '10px',
//           bottom: '10px',
//           left: '10px',
//         },
//       });
  
//       // Close the browser
//       await browser.close();
  
//       // Set up the response headers for PDF download
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
//       res.send(pdfBuffer);
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   });
module.exports = wishlistRouter;