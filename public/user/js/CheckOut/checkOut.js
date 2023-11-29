

// ****** PROCEED TO PAYMENT - PAYMENT OPTION DIV VIEW *****
const proceedPaymentBtn = document.getElementById('proceed-payment-btn');
proceedPaymentBtn.addEventListener('click',(event)=>{
    event.preventDefault();

    const addressCard = document.querySelectorAll("div[name='address-card']");
    const deliveryAddress = document.querySelectorAll('input[name="CheckedAddress"]');
    console.log(deliveryAddress)
    let addressExist = false;
    deliveryAddress.forEach((address,i)=>{
        if(!address.checked)
        {
            addressCard[i].style.display = 'none';
        }else{
            addressExist = true;
        }
    });

    if(!addressExist){ 
        Swal.fire({
            position:'bottom',
            html: `Please Select an Address`,
            showConfirmButton: false, 
            timer: 1500,
        });
        return;
    }



    const paymentOptionDiv = document.getElementById('payment-options');
    paymentOptionDiv.style.display = 'block';

    const addressDiv = document.getElementById('checkout-addAddressForm');
    addressDiv.style.display = 'none';

    const editAddressDiv = document.getElementById('checkout-editAddressForm');
    editAddressDiv.style.display = 'none';

    const addAddressButton = document.getElementById('addingNewAddressButton');
    addAddressButton.style.display = 'none';

    
    const changeAddress = document.getElementById('change-address');
    changeAddress.style.display = 'block';


});


const changeAddress = document.getElementById('change-address');
if(changeAddress){
    changeAddress.addEventListener('click',(event)=>{
        event.preventDefault();

        const addressCard = document.querySelectorAll("div[name='address-card']");
        const deliveryAddress = document.querySelectorAll('input[name="CheckedAddress"]');
        deliveryAddress.forEach((address,i)=>{
            if(!address.checked)
            {
                addressCard[i].style.display = 'block';
            }
        });

        const addAddressButton = document.getElementById('addingNewAddressButton');
        addAddressButton.style.display = 'block';

        document.getElementById('change-address').style.display = 'none';

    })
}



// ****** QUANTITY UPDATE TIME UPDATE PRODUCT PRICE IN PRICE VIEW RIGHT SECTION ****
const priceUpdate = document.getElementById('checkout-product-quanitity');
priceUpdate.addEventListener('change',(event)=>{

    const newProductQuantity = parseInt(event.target.value);
    const hiddenInput = document.getElementById('checkout-hidden-data');

    const oldProductQuantity = hiddenInput.value;
    const singlePrice = hiddenInput.getAttribute('name');

    const stock = parseInt(hiddenInput.getAttribute('data-product-stock'));

    if(stock < newProductQuantity && newProductQuantity < 10){
        Swal.fire({
            text: `Only ${stock} products is left`,
            icon: 'warning',
            showConfirmButton: false, 
            timer: 2500,
            customClass: {
                icon: 'my-custom-icon-class', 
                content: 'my-custom-content-class', 
              }, 
          });
          event.target.value = stock;
          return;
    }

    const checkoutPriceUpdate = document.querySelectorAll('span[name="checkout-price"]');

    

    if(newProductQuantity > 10){
        Swal.fire({
            text: 'Sorry ! Only 10 unit(s) allowed in a single order  If you have a higher requirement, please create a new order.',
            icon: 'warning',
            showConfirmButton: false, 
            timer: 3000,
            customClass: {
                icon: 'my-custom-icon-class', 
                content: 'my-custom-content-class', 
                }, 
            });
            event.target.value = 10;
            let toalPrice = 10 * singlePrice;

            checkoutPriceUpdate[0].innerHTML = toalPrice;
            checkoutPriceUpdate[1].innerHTML = newProductQuantity;
            checkoutPriceUpdate[3].innerHTML = toalPrice;
            return;
    }else if(newProductQuantity <= 0 || newProductQuantity == 'e'){
        event.target.value = 1;
        let toalPrice = 1 * singlePrice;

            checkoutPriceUpdate[0].innerHTML = toalPrice;
            checkoutPriceUpdate[1].innerHTML = newProductQuantity;
            checkoutPriceUpdate[3].innerHTML = toalPrice;
        return;
    }



    let toalPrice = newProductQuantity * singlePrice;

    checkoutPriceUpdate[0].innerHTML = toalPrice;
    checkoutPriceUpdate[1].innerHTML = newProductQuantity;
    checkoutPriceUpdate[3].innerHTML = toalPrice;
    
    
    
})





// ****** PLACE AN ORDER (SINGLE ORDER)*****
const placeOrder = document.getElementById('placeOrder');
if(placeOrder){

    placeOrder.addEventListener('click', async(event)=>{
        event.preventDefault();

        // RETRIEVE THE PRODUCT ID, PRODUCT QUNANTITY , DELIVERY ADDRESS , SINGLE PRICE
        const productId = event.target.getAttribute('data-product-id');
        const productQuantity = document.getElementById('checkout-product-quanitity').value;
        const deliveryAddress = document.querySelectorAll('input[name="CheckedAddress"]');
        const hiddenInput = document.getElementById('checkout-hidden-data');
        const singlePrice = hiddenInput.getAttribute('name');
        
        // RETRIEVING THE SELECTED ADDRESS
        let selectedAddress;
        deliveryAddress.forEach((address)=>{
            if(address.checked)
            {
                selectedAddress = address.getAttribute('data-addressId');
            }
        });

        // RETRIEVING THE PAYMENT METHOD
        const payment = document.querySelectorAll('input[name="Payment"]');
        let selectedPaymetOption;
        payment.forEach((paymentOption)=>{
            if(paymentOption.checked){
                selectedPaymetOption = paymentOption.value;
            }
        });



        // CREATING THE JSON DATA TO SEND THE SERVER
        const data ={
            ProductId:productId,
            productQuantity:productQuantity,
            ProductPrice:singlePrice,
            Address:selectedAddress,
            PaymentMethod:selectedPaymetOption,
            SingleProduct:true
        };

         // COUPON STATUS & COUPON ID
         const couponStatus = event.target.getAttribute('data-coupon');
         if(couponStatus == 'true'){
             couponId = event.target.getAttribute('data-couponId');
             data.couponStatus = true;
             data.couponId = `${couponId}`;
         }


        // FETCH TO SEND API REQUEST FOR PLACE ORDER
        const url = '/api/placeOrder';
        const requestOption = {
            method:'POST',
            body:JSON.stringify(data),
            headers:{'Content-Type':'application/json'}
        }

        const response = await fetch(url,requestOption) ;

        const responseData = await response.json();

            // AFTER RESPONSE CURESPONDING CONDITON VIEW TO THE USER
            if(responseData.CODSuccess){

                window.location.href = `/api/orderSucesss?orderId=${responseData.orderId}`;

            }else if(responseData.walletPayment){

                window.location.href = `/api/orderSucesss?orderId=${responseData.orderId}`;

            }else if(responseData.walletInsufficient){
                Swal.fire({
                    position:'bottom',
                    html: `Wallet Amount is Insufficient`,
                    showConfirmButton: false, 
                    timer: 1500,
                });

            }else if(responseData.OnlinePayment){

                razorpayPayment(responseData.order)
            
            }else if(!responseData.StockStatus && !responseData.singleStock){
                Swal.fire({
                    position:'bottom',
                    html: `${responseData.quantity} Product is Left`,
                    showConfirmButton: false, 
                    timer: 1500,
                })
            }else if(responseData.couponError){
                Swal.fire({
                    position:'bottom',
                    html: `&#10071; Coupon have an Error.<br>Check And Try Again`,
                    showConfirmButton: false, 
                    timer: 2000,
                });
            }else{
                window.location.href = '/api/ordersucess?status=false'
            }
    })
}



// RazorPay Payment GateWay Page View
function razorpayPayment(order){
    var options = {
        "key": "rzp_test_ydy5yr6ieKyEj4", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Male Fashion",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){

            onlinePaymentSucess(response,order)

        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
//     rzp1.on('payment.failed', function (response){
//         alert(response.error.code);
//         alert(response.error.description);
//         alert(response.error.source);
//         alert(response.error.step);
//         alert(response.error.reason);
//         alert(response.error.metadata.order_id);
//         alert(response.error.metadata.payment_id);
// });
    rzp1.open();
}


async function onlinePaymentSucess(response,order){
   
    const url = '/api/verifyPayment';
    const requestOption = {
        method:'POST',
        body:JSON.stringify({
            orderReceipt:order,
            Payment:response
        }),
        headers:{'Content-Type':'application/json'}
    }

    const paymentResponse = await fetch(url,requestOption);

    const paymentResponseData = await paymentResponse.json();

    if(paymentResponseData.onlinePaymentStaus){
        window.location.href = `/api/orderSucesss?orderId=${paymentResponseData.orderId}`;
    }
}



// ***** CART DATA TO PLACE ORDER ******
const cartPlaceOrder = document.getElementById('cartPlaceOrder');
if(cartPlaceOrder){
    cartPlaceOrder.addEventListener('click',async(event)=>{
        event.preventDefault();

        const deliveryAddress = document.querySelectorAll('input[name="CheckedAddress"]');

        let selectedAddress;
        deliveryAddress.forEach((address)=>{
            if(address.checked)
            {
                selectedAddress = address.getAttribute('data-addressId');
            }
        });

        const payment = document.querySelectorAll('input[name="Payment"]');

        let selectedPaymetOption;
        payment.forEach((paymentOption)=>{
            if(paymentOption.checked){
                selectedPaymetOption = paymentOption.value;
            }
        })



        const data = {
            Address:selectedAddress,
            PaymentMethod:selectedPaymetOption,
            SingleProduct:false
        };

        // COUPON STATUS & COUPON ID
        const couponStatus = event.target.getAttribute('data-coupon');
        if(couponStatus == 'true'){
            couponId = event.target.getAttribute('data-couponId');
            data.couponStatus = true;
            data.couponId = `${couponId}`;
        }

        const url = '/api/placeOrder';

        const requestOption = {
            method:'POST',
            body:JSON.stringify(data),
            headers:{'Content-Type':'application/json'}
        }

        const response = await fetch(url,requestOption) ;

        const responseData = await response.json();

        if(responseData.CODSuccess){

            window.location.href = `/api/orderSucesss?orderId=${responseData.orderId}`;

        }else if(responseData.OnlinePayment){

            razorpayPayment(responseData.order)
           
        }else if(responseData.walletInsufficient){
            Swal.fire({
                position:'bottom',
                html: `Wallet Amount is Insufficient`,
                showConfirmButton: false, 
                timer: 1500,
            });
        }else if(responseData.walletPayment){

            window.location.href = `/api/orderSucesss?orderId=${responseData.orderId}`;

        }else if(!responseData.status && !responseData.stock){

            Swal.fire({
                position:'bottom',
                html: `Some Product In Cart Is Out Of Stock`,
                showConfirmButton: false, 
                timer: 1500,
            });

        }else{
            window.location.href = '/api/ordersucess?status=false'
        }
    })
}



// COUPON INSTRUCTION CLICK THE SWAL VIEW AND VIEW THE DETAILS OF COUPON
function instructionsOnhover(offer,amount,startDate,endDate){
    Swal.fire({
        title: 'Instruction!',
        html: `<ul>
                <h5>What Is the Offer?</h5>
                <li>${offer}% discount on your purchase. This special offer applies to transactions up to <i class="bi bi-currency-rupee"></i> ${amount} </li>
                <li>Maximum Discount <i class="bi bi-currency-rupee"></i>${(amount * offer) / 100}</li>
                <h5>What is the offer duration? </h5>
                <li>${new Date(startDate).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })} to ${new Date(endDate).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</li>
                <h5>What other conditions should apply to avail the offer? </h5>
                <li>If your order, with a discount coupon, includes multiple products, individual product cancellation may be limited. This applies only if the remaining products don't meet the minimum purchase amount for the coupon, and payment was made online or via wallet</li>
                <li>Repeated cancellations may affect your account. Please review your order carefully to avoid potential consequences.</li>
              </ul>`,
        showCloseButton: false,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'custom-ok-button',
        },
        width: '40vw',
        heightAuto: false, 
        height: 'auto',
        position: 'top'
      });
}


// COUPON APPLY BUTTON CLICK AND WORKING APPLY THAT COUPON FOR THAT ORDER
const couponApplyBtn = document.querySelectorAll('a[name="couponApplyBtn"]');
const resetCoupon = document.querySelectorAll('div[name="couponReset"]');

if(couponApplyBtn){

    couponApplyBtn.forEach((button, i )=> {

        button.addEventListener('click', (event)=>{
            event.preventDefault();

            // TOTAL PRICE VIEW SECTION AMOUNT VIEW SPAN SELECTION
            const checkoutPriceUpdate = document.querySelectorAll('span[name="checkout-price"]');
            
            // RETRIEVE THE COUPON DATA 
            let coupon = event.target.getAttribute('data-coupon');
            coupon = JSON.parse(coupon);
            
            // CHECKING THE CONDITION FOR THE COUPON
            if(parseInt(checkoutPriceUpdate[3].innerHTML) >= parseInt(coupon.minimumPurchase)){

                // PRODUCT IS SINGLE QUANTITY INCREASING AFTER APPLY COUPON IS RESTRICTED
                if(event.target.getAttribute('data-single')){
                    const quantityUpdateField = document.getElementById('checkout-product-quanitity');
                    quantityUpdateField.readOnly = true;
                }

                // CALCULATING THE DISCOUNT AMOUNT AND SET TO THE AMOUNT VIEW SECTION
                const discountAmount = ( coupon.minimumPurchase * coupon.OfferPercentage )/100;
            
                checkoutPriceUpdate[2].innerHTML = discountAmount;
                checkoutPriceUpdate[3].innerHTML -= discountAmount;

                // COUPON DATA SET TO THE PLACE ORDER BUTTON
                const placeOrderBtn = document.querySelector("button[name='placeOrderBtn']");
                placeOrderBtn.setAttribute('data-coupon','true');
                placeOrderBtn.setAttribute('data-couponId',`${coupon._id}`);

                // OTHER COUPON APPLU BUTTON DISABLED
                couponApplyBtn.forEach(button => {
                        button.setAttribute("disabled", true);
                        button.style.pointerEvents = "none";
                        button.style.backgroundColor = 'grey';
                })

                // SETTING THE APPLIED BUTTON STATUS
                event.target.innerHTML = '<i class="fa-regular fa-circle-check fa-fade fa-2xl" style="color: #00ff4c;"></i>';
                event.target.style.backgroundColor = '#000';

                // VIEW IN COUPON RESET BUTTON
                resetCoupon[i].style.display = 'block';

            }else{
                Swal.fire({
                    position:'bottom',
                    html: `&#10071; Coupon is Not Applicable.<br>coupon Requirements is Not Satisfied`,
                    showConfirmButton: false, 
                    timer: 2000,
                });
            }
            
            

        })
        
    });
}


// COUPON APPLY TIME RESET THE SELECTING COUPON FUNCTIONALITY
function removeAppliedCoupon(){

    // DISABLED THE APPLY BUTTON SETTING THE ACTIVE FORM
    couponApplyBtn.forEach((button, i) => {
        button.removeAttribute("disabled");
        button.style.pointerEvents = "auto"; 
        button.style.backgroundColor = 'rgb(105, 137, 179)';
        button.innerHTML = 'APPLY';
        resetCoupon[i].style.display = 'none';
    });

    // PRODUCT IS SINGLE QUANTITY INCREASING AFTER APPLY COUPON IS RESTRICTED
    const quantityUpdateField = document.querySelector('#checkout-product-quanitity');
    if(quantityUpdateField.getAttribute('data-single') == 'true'){
        quantityUpdateField.removeAttribute("readonly");
    }


    // CALCULATING THE PRICE OF THE PREVIOUS AND APPLIED THAT TOTAL SECTION
    const checkoutPriceUpdate = document.querySelectorAll('span[name="checkout-price"]');

    checkoutPriceUpdate[3].innerHTML = parseInt(checkoutPriceUpdate[2].innerHTML) + parseInt(checkoutPriceUpdate[3].innerHTML);
    checkoutPriceUpdate[2].innerHTML = 0;

}