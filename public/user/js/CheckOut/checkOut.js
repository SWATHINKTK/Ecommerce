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


    // ****** PROCEED TO PAYMENT - PAYMENT OPTION DIV VIEW *****
    const proceedPaymentBtn = document.getElementById('proceed-payment-btn');
    proceedPaymentBtn.addEventListener('click',()=>{

        const paymentOptionDiv = document.getElementById('payment-options');
        paymentOptionDiv.style.display = 'block';
    })
})