// ***** PRODUCT ADD TO CART *****
async function addToCart(eventTag){

    try{

        const productId = eventTag.getAttribute('data-product-id');

        const stock = eventTag.getAttribute('data-stock');

        const productPrice = document.getElementById('product-price').innerHTML;

        let productQuantity = document.getElementById('product-quanitity') ? document.getElementById('product-quanitity').value : 1;

        // if(stock <= 0){
        //     productQuantity = 0;
        // }

        const url = '/api/addToCart';

        const requestOption = {
            method:'POST',
            body:JSON.stringify({
                id:productId,
                quantity:productQuantity,
                price : productPrice
            }),
            headers:{'Content-Type':'application/json'}
        }



        const response = await fetch(url,requestOption);
        
            if(!response.ok){
                window.location.href = '/error500';
            }

        const data = await response.json();

                if(data.status){

                    // NavBar Cart Count Update
                    const cartCount = document.getElementById('Cart-Count');
                    cartCount.innerHTML = parseInt(cartCount.innerHTML) + 1;

                    const addToCart = document.getElementById('addToCart');
                    addToCart.innerHTML = '<a href="/api/cart" class="btn btn btn-warning rounded-pill btn-addToCart"><i class="bi bi-cart3 fa-lg text-dark"></i> Go To Cart</a>'
                }

    }catch(error){

        console.log(error.message);

    }

}




// *** HOME PAGE PAGE ADD TO CART ****

const homePageAddToCart = document.querySelectorAll('a[name="homePageAddToCart"]');

homePageAddToCart.forEach(eventTag => {

    eventTag.addEventListener('click',async(event)=>{
        event.preventDefault();

        const productId = event.target.getAttribute('data-product-id');
        const productPrice = event.target.getAttribute('data-product-price');

        const url = '/api/addToCart';

        const requestOption = {
            method:'POST',
            body:JSON.stringify({
                id:productId,
                quantity:1,
                price : productPrice
            }),
            headers:{'Content-Type':'application/json'}
        }

        const response = await fetch(url,requestOption);
        
            if(!response.ok){
                window.location.href = '/error500';
            }

        const data = await response.json();

            if(data.status){

                // NavBar Cart Count Update
                const cartCount = document.getElementById('Cart-Count');
                cartCount.innerHTML = parseInt(cartCount.innerHTML) + 1;
                
                const gotoCart = document.getElementById(`${productId}`);
                gotoCart.innerHTML = '<a href="/api/cart"> <i class="bi bi-cart3 text-dark"></i><span>Go to Cart</span></a>';
            }

        console.log(productPrice,productId)
    })
})




// **** CART DATA IS USED TO PLACE AN ORDER *****
const cartOrderPlace = document.getElementById('cartOrderPlace');
if(cartOrderPlace){
    cartOrderPlace.addEventListener('click',(event)=>{
        event.preventDefault();

        const stock = document.querySelectorAll('input[name="hidden-for-stock"]');

        let value = true;
        stock.forEach((stock)=>{
            if(stock.value == 0){
                value =false;
                Swal.fire({
                    position:'bottom',
                    text: `Some Out of Stock is Present in our Cart.You Check Our Cart`,
                    icon: 'error',
                    showConfirmButton: false, 
                    timer: 2500,
                    customClass: {
                        icon: 'my-custom-icon-class', 
                        content: 'my-custom-content-class', 
                      }, 
                  });
                  return
            }
        })

        if(value){
            const url = event.target.getAttribute('data-url');
            window.location.href = url;
        }
    })
}





document.addEventListener('DOMContentLoaded',()=>{


    // *******  QUNATITY UPDATE TO THE CART PRODUCT ********

    const quanitityUpdate = document.querySelectorAll('input[name="quanitity"]');


    quanitityUpdate.forEach((changeInputField)=>{

        changeInputField.addEventListener('click' , (event)=>{

            const productQuanitity = parseInt(event.target.value);

            const parent = event.target.parentNode;
            const oldData = parent.querySelector('#oldData');
            const oldQuantity = oldData.value;

            const stock = parseInt(oldData.getAttribute('data-stock'));

            if(stock < productQuanitity ){
                alert(stock)
                alert(productQuanitity)
                Swal.fire({
                    position:'bottom',
                    text: `Only ${stock} products is left`,
                    icon: 'warning',
                    showConfirmButton: false, 
                    timer: 2500,
                    customClass: {
                        icon: 'my-custom-icon-class', 
                        content: 'my-custom-content-class', 
                      }, 
                  });
                  event.target.value = oldQuantity;
                  return;
            }

            
            if(oldQuantity == 10 && productQuanitity == 10){

                Swal.fire({
                    position:'bottom',
                    text: 'Sorry ! Only 10 unit(s) allowed in each order',
                    icon: 'warning',
                    showConfirmButton: false, 
                    timer: 2500,
                    customClass: {
                        icon: 'my-custom-icon-class', 
                        content: 'my-custom-content-class', 
                      }, 
                  });
                  event.target.value = oldQuantity;
                  return;

            }else if(oldQuantity == 1 && productQuanitity == 1){

                Swal.fire({
                    position:'bottom',
                    text: 'Sorry ! this is not allowed',
                    icon: 'warning',
                    showConfirmButton: false, 
                    timer: 2500,
                    customClass: {
                        icon: 'my-custom-icon-class', 
                        content: 'my-custom-content-class', 
                      }, 
                  });
                  event.target.value = oldQuantity;
                  return;
            }

        })




        changeInputField.addEventListener('change', async(event) => {

            try{

                const productId = event.target.getAttribute('data-cart-product-id');

                const productQuanitity = parseInt(event.target.value);


                const parent = event.target.parentNode;
                const oldData = parent.querySelector('#oldData');
                const oldQuantity = oldData.value;
                const price = oldData.getAttribute('name');

                const stock = parseInt(oldData.getAttribute('data-stock'));

                if(stock < productQuanitity ){
                    Swal.fire({
                        position:'bottom',
                        text: `Only ${stock} products is left`,
                        icon: 'warning',
                        showConfirmButton: false, 
                        timer: 2500,
                        customClass: {
                            icon: 'my-custom-icon-class', 
                            content: 'my-custom-content-class', 
                          }, 
                      });
                      if(stock <= 10){
                        event.target.value = stock;
                      }
                      return;
                }
    

                const priceUpdate = document.querySelectorAll('span[name="cart-price"]');
                const totalAmount = parseFloat(priceUpdate[0].innerHTML);


                if(productQuanitity > 10 ){
                    Swal.fire({
                        position:'bottom',
                        text: 'Sorry ! Only 10 unit(s) allowed in each order',
                        icon: 'warning',
                        showConfirmButton: false, 
                        timer: 2500,
                        customClass: {
                            icon: 'my-custom-icon-class', 
                            content: 'my-custom-content-class', 
                          }, 
                      });
                      event.target.value = oldQuantity;
                      return;

                }else if(productQuanitity < 1){

                    Swal.fire({
                        position:'bottom',
                        text: 'Sorry ! this is not allowed',
                        icon: 'warning',
                        showConfirmButton: false, 
                        timer: 2500,
                        customClass: {
                            icon: 'my-custom-icon-class', 
                            content: 'my-custom-content-class', 
                          }, 
                      });
                      event.target.value = oldQuantity;
                      return;
                }



                const url = '/api/cartQuantityUpdate';

                const requestOption = {
                    method: 'PATCH',
                    body: JSON.stringify({
                        id: productId,
                        quantity : productQuanitity
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }


                const response = await fetch(url,requestOption);

                    if(!response.ok){
                        Window.location.href = '/error500';
                    }

                const responseData = await response.json();

                    if(responseData.status){

                        let newPrice;
                        if( productQuanitity > oldQuantity){
                            
                            // console.log(totalAmount,productQuanitity,oldQuantity,price)

                            newPrice = totalAmount + parseInt(((productQuanitity - oldQuantity) * price));


                        }else{

                            newPrice = totalAmount - ((oldQuantity - productQuanitity) * price);

                        }
                        oldData.value = productQuanitity
        
                        priceUpdate[0].innerText = newPrice;
                        priceUpdate[1].innerText = newPrice;

                        // Swal.fire({
                        //     position:'bottom',
                        //     text: 'Quantity Updated!',
                        //     icon: 'success',
                        //     showConfirmButton: false, 
                        //     timer: 1000,
                        //     customClass: {
                        //         icon: 'my-custom-icon-class', 
                        //         content: 'my-custom-content-class', 
                        //       }, 
                        //   });


                    }else{

                        Swal.fire({
                            position:'bottom',
                            text: 'Quantity Not Updated!',
                            icon: 'error',
                            showConfirmButton: false, 
                            timer: 1000,
                          });

                    }

            }catch(error){

                console.log(error.message);
            }
        
        })
    });





    // ******* CART REMOVE PRODUCTS ***********
    const productRemove = document.querySelectorAll('button[name="cart-product-delete"]');

    productRemove.forEach((button) => {

        button.addEventListener('click', async(event) => {

            document.getElementById('modalremoveCart').style.display = 'block';
            
            const productId = event.target.getAttribute('data-cart-product-id');

            const okButton = document.getElementById('deleteCartModalOk');
            okButton.setAttribute('data-product-id',`${productId}`);

        })
    })

})

async function successCartProduct(button){

   
    try{

        const productId = button.getAttribute('data-product-id');
    

        const url = '/api/deleteCartProduct';

        const requestOption = {
            method:'DELETE',
            body:JSON.stringify({
                productId:productId
            }),
            headers:{'Content-Type': 'application/json'}
        }

        const response = await fetch(url,requestOption);

            if(!response.ok){
                window.location.href = '/error500';
            }

            if(response.status == 404){

                window.location.href = '/login';

            }

        const responseData = await response.json();

            if(responseData.status){

                // NavBar Cart Count Update
                const cartCount = document.getElementById('Cart-Count');
                cartCount.innerHTML = parseInt(cartCount.innerHTML) - 1;

                const productDiv = document.getElementById(`${productId}`);
                document.getElementById('modalremoveCart').style.display = 'none';
                productDiv.remove();

                const productRemove = document.querySelectorAll('button[name="cart-product-delete"]');

                if(productRemove.length == 0){

                    location.reload();

                }else{

                    Swal.fire({
                        position:'bottom',
                        html: '<i class="fa-solid fa-circle-check" style="color: #2dd26c;"></i> Successfully Removed.',
                        showConfirmButton: false, 
                        timer: 1500,
                    })
                }
                
            }

    }catch(error){

        console.log(error.message)
    }

}


function removeModalCart(){
    document.getElementById('modalremoveCart').style.display = 'none';
}


   // Swal.fire({
            //     title: 'Are you sure?',
            //     text: "You won't be able to revert this!",
            //     icon: 'warning',
            //     showCancelButton: true,
            //     confirmButtonColor: '#3085d6',
            //     cancelButtonColor: '#d33',
            //     confirmButtonText: 'Yes, delete it!'
            //   }).then((result) => {
            //     if (result.isConfirmed) {
            //       // The "OK" button was clicked
            //       // Add your code to handle the "OK" button event here
            //       Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            //     }
            //   });

            //   const button = document.querySelector('.swal2-confirm');
            //   console.log(button)
              