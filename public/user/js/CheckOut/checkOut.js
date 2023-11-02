
let address = true;
document.addEventListener('DOMContentLoaded',()=>{


    // ***** ADDING NEW ADDRESS FORM VIEW *****
    const addNewAddress = document.getElementById('checkout-AddNewAddress');
    addNewAddress.addEventListener('click',() => {

        const addressDiv = document.getElementById('checkout-addAddressForm');
        if(address){
            addressDiv.style.display = 'block';
            address = false;
        }else{
            addressDiv.style.display = 'none';
            address = true;
        }
    });


    // ***** EDIT THE EXISTNG ADDRESS IN CHECKOUT PAGE *****
    const editCheckoutAddress = document.getElementById('editCheckoutAddress');
    editCheckoutAddress.addEventListener('click',(event)=>{
        event.preventDefault();

        const addressDiv = document.getElementById('checkout-editAddressForm');
        addressDiv.style.display = 'block';
        addressDiv.innerHTML = "HELLO"

        const middlePosition = Math.ceil(document.body.scrollHeight / 2.6);
        window.scrollTo({
            top: middlePosition,
            behavior: 'smooth' // You can use 'auto' for instant scrolling
          });
    })





    // ****** PROCEED TO PAYMENT - PAYMENT OPTION DIV VIEW *****
    const proceedPaymentBtn = document.getElementById('proceed-payment-btn');
    proceedPaymentBtn.addEventListener('click',()=>{

        const paymentOptionDiv = document.getElementById('payment-options');
        paymentOptionDiv.style.display = 'block';
    })
})