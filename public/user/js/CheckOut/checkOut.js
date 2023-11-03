
// ****** PROCEED TO PAYMENT - PAYMENT OPTION DIV VIEW *****
const proceedPaymentBtn = document.getElementById('proceed-payment-btn');
proceedPaymentBtn.addEventListener('click',()=>{

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
    console.log(hiddenInput)
    const oldProductQuantity = hiddenInput.value;
    const singlePrice = hiddenInput.getAttribute('name');

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

    placeOrder.addEventListener('click',(event)=>{

        const productId = event.target.getAttribute('data-product-id');

        const productQuantity = document.getElementById('checkout-product-quanitity');
        
        const deliveryAddress = document.querySelectorAll('input[name="CheckedAddress"]');
        
        let selectedAddress;
        deliveryAddress.forEach((address)=>{
            if(address.checked)
            {
                selectedAddress = address;
            }
        });

        const payment = document.querySelectorAll('input[name="Payment"]');

        let selectedPaymetOption;
        payment.forEach((paymentOption)=>{
            if(paymentOption.checked){
                selectedPaymetOption = paymentOption;
            }
        })

        console.log(productId,productQuantity,selectedAddress,selectedPaymetOption)
    })
}