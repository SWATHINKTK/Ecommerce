
// ****** PROCEED TO PAYMENT - PAYMENT OPTION DIV VIEW *****
const proceedPaymentBtn = document.getElementById('proceed-payment-btn');
proceedPaymentBtn.addEventListener('click',()=>{
    alert('d')
    const paymentOptionDiv = document.getElementById('payment-options');
    paymentOptionDiv.style.display = 'block';

    const addressDiv = document.getElementById('checkout-addAddressForm');
    addressDiv.style.display = 'none';

    const editAddressDiv = document.getElementById('checkout-editAddressForm');
    editAddressDiv.style.display = 'none';
});



// ****** QUANTITY UPDATE TIME UPDATE PRODUCT PRICE IN PRICE VIEW RIGHT SECTION ****
const priceUpdate = document.getElementById('checkout-product-quanitity');
priceUpdate.addEventListener('change',(event)=>{

    const newProductQuantity = event.target.value;
    const hiddenInput = document.getElementById('checkout-hidden-data');
    // console.log(hiddenInput)
    const oldProductQuantity = hiddenInput.value;
    const singlePrice = hiddenInput.getAttribute('name');

    const stock = hiddenInput.getAttribute('data-product-stock');

    if(stock < newProductQuantity ){
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
        }else{
            window.location.href = '/api/ordersucess?status=false'
        }
    })
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
            // alert('sucess')
        }else{
            window.location.href = '/api/ordersucess?status=false'
        }
    })
}