
let address = true;
// document.addEventListener('DOMContentLoaded',()=>{


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
    const editCheckoutAddress = document.querySelectorAll('a[name="editCheckoutAddress"]');
    if(editCheckoutAddress){

        editCheckoutAddress.forEach((edit)=>{

            edit.addEventListener('click',async(event)=>{
                event.preventDefault();

                const id = event.target.getAttribute('data-addressId');
                const url = `/editaddress${id}?url=true`;

                const response = await fetch(url);

                const responseData = await response.text();
                console.log(responseData)

                const addressDiv = document.getElementById('checkout-editAddressForm');
                addressDiv.style.display = 'block';
                addressDiv.innerHTML = responseData

                const middlePosition = Math.ceil(document.body.scrollHeight / 2.6);
                window.scrollTo({
                    top: middlePosition,
                    behavior: 'smooth' // You can use 'auto' for instant scrolling
                });
            })
        })
    }





    // ****** PROCEED TO PAYMENT - PAYMENT OPTION DIV VIEW *****
    const proceedPaymentBtn = document.getElementById('proceed-payment-btn');
    proceedPaymentBtn.addEventListener('click',()=>{

        const paymentOptionDiv = document.getElementById('payment-options');
        paymentOptionDiv.style.display = 'block';
    });



    // ****** QUANTITY UPDATE TIME UPDATE PRODUCT PRICE IN PRICE VIEW RIGHT SECTION ****
    const priceUpdate = document.getElementById('checkout-product-quanitity');
    priceUpdate.addEventListener('change',(event)=>{

        const newProductQuantity = event.target.value;
        const hiddenInput = document.getElementById('checkout-hidden-data');
        console.log(hiddenInput)
        const oldProductQuantity = hiddenInput.value;
        const singlePrice = hiddenInput.getAttribute('name');
        

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
              return;
        }else if(newProductQuantity <= 0 || newProductQuantity == 'e'){
            event.target.value = 1;
        }


        const checkoutPriceUpdate = document.querySelectorAll('span[name="checkout-price"]');
        console.log(checkoutPriceUpdate)

        let toalPrice = newProductQuantity * singlePrice;

        checkoutPriceUpdate[0].innerHTML = toalPrice;
        checkoutPriceUpdate[1].innerHTML = newProductQuantity;
        checkoutPriceUpdate[2].innerHTML = toalPrice;
        
        
        
    })
// })