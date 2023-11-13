
// ****** PROCEED TO PAYMENT - PAYMENT OPTION DIV VIEW *****
const proceedPaymentBtn = document.getElementById('proceed-payment-btn');
proceedPaymentBtn.addEventListener('click',()=>{

    const paymentOptionDiv = document.getElementById('payment-options');
    paymentOptionDiv.style.display = 'block';

    const addressDiv = document.getElementById('checkout-addAddressForm');
    addressDiv.style.display = 'none';

    const editAddressDiv = document.getElementById('checkout-editAddressForm');
    editAddressDiv.style.display = 'none';

    const addAddressButton = document.getElementById('addingNewAddressButton');
    addAddressButton.style.display = 'none';

    const addressCard = document.querySelectorAll("div[name='address-card']");
    const deliveryAddress = document.querySelectorAll('input[name="CheckedAddress"]');
    deliveryAddress.forEach((address,i)=>{
        if(!address.checked)
        {
            addressCard[i].style.display = 'none';
        }
    });

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
            checkoutPriceUpdate[2].innerHTML = toalPrice;
            return;
    }else if(newProductQuantity <= 0 || newProductQuantity == 'e'){
        event.target.value = 1;
        let toalPrice = 1 * singlePrice;

            checkoutPriceUpdate[0].innerHTML = toalPrice;
            checkoutPriceUpdate[1].innerHTML = newProductQuantity;
            checkoutPriceUpdate[2].innerHTML = toalPrice;
        return;
    }



    let toalPrice = newProductQuantity * singlePrice;

    checkoutPriceUpdate[0].innerHTML = toalPrice;
    checkoutPriceUpdate[1].innerHTML = newProductQuantity;
    checkoutPriceUpdate[2].innerHTML = toalPrice;
    
    
    
})





// ****** PLACE AN ORDER *****
const placeOrder = document.getElementById('placeOrder');
if(placeOrder){

    placeOrder.addEventListener('click', async(event)=>{
        event.preventDefault();

        const productId = event.target.getAttribute('data-product-id');

        const productQuantity = document.getElementById('checkout-product-quanitity').value;
        
        const deliveryAddress = document.querySelectorAll('input[name="CheckedAddress"]');

        const hiddenInput = document.getElementById('checkout-hidden-data');
        const singlePrice = hiddenInput.getAttribute('name');
        
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

        // console.log(productId,productQuantity,selectedAddress,selectedPaymetOption)

        const jsonData = JSON.stringify({
            ProductId:productId,
            productQuantity:productQuantity,
            ProductPrice:singlePrice,
            Address:selectedAddress,
            PaymentMethod:selectedPaymetOption,
            SingleProduct:true
        })

        const url = '/api/placeOrder';

        const requestOption = {
            method:'POST',
            body:jsonData,
            headers:{'Content-Type':'application/json'}
        }

        const response = await fetch(url,requestOption) ;

        const responseData = await response.json();

        if(responseData.status){
            window.location.href = `/api/orderSucesss?orderId=${responseData.orderId}`;
        }else if(responseData.sucess){

            // console.log(responseData.order)

            razorpayPayment(responseData.order)
           
        }else if(!responseData.status && !responseData.singleStock){
            Swal.fire({
                position:'bottom',
                html: `${responseData.quantity} Product is Left`,
                showConfirmButton: false, 
                timer: 1500,
            })
        }else{
            window.location.href = '/api/ordersucess?status=false'
        }
    })
}


function razorpayPayment(order){
    console.log(order.amount)
    const amount = parseInt(order.amount)*100;
    alert(amount)
    var options = {
        "key": "rzp_test_ydy5yr6ieKyEj4", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Male Fashion",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature)

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
    rzp1.open();
}


async function onlinePaymentSucess(response,order){
   
    const url = '/api/verifyPayment';
    const requestOption = {
        method:'POST',
        body:JSON.stringify({
            orderData:order,
            Payment:response
        }),
        headers:{'Content-Type':'application/json'}
    }

    const paymentResponse = await fetch(url,requestOption);
}



// ***** CART DATA TO PLACE ORDER ******
const cartPlaceOrder = document.getElementById('cartPlaceOrder');
if(cartPlaceOrder){
    cartPlaceOrder.addEventListener('click',async()=>{

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



        const jsonData = JSON.stringify({
            Address:selectedAddress,
            PaymentMethod:selectedPaymetOption,
            SingleProduct:false
        })

        const url = '/api/placeOrder';

        const requestOption = {
            method:'POST',
            body:jsonData,
            headers:{'Content-Type':'application/json'}
        }

        const response = await fetch(url,requestOption) ;

        const responseData = await response.json();

        if(responseData.status){

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