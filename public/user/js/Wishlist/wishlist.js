
// ***** Product Data Add To Wishlist ****
const addToWishlist = document.querySelectorAll('a[name="addToWishlist"]');

addToWishlist.forEach((addWishlistBtn)=>{

    addWishlistBtn.addEventListener('click',async(event) => {
        event.preventDefault();

        const productId = event.target.getAttribute('data-wishlist-productId');
        
        const anchorTag = event.target.parentNode;

        const url = '/api/addWishlist';
        const requestOptions = {
            method:'POST',
            body:JSON.stringify({
                productId:productId
            }),
            headers:{'Content-Type':'application/json'}         
        }

        const response = await fetch(url,requestOptions);

            if(response.status == 401){
                window.location.href = '/login';
                return;
            }

            if(!response.ok){
                window.location.href = '/error500';
                return;
            }
        
        const responseData = await response.json();

        if(responseData.status && responseData.removed){

            if(anchorTag.getAttribute('data-cart')){
                anchorTag.innerHTML = `<i class="fa-regular fa-heart fa-lg text-dark  py-3 px-2" data-wishlist-productId="${productId}"></i>`;
                Swal.fire({
                    position:'bottom',
                    html: '<span class="font-weight-bold"><i class="fa-solid fa-circle-check" style="color: #2dd26c;"></i> Removed Successfully.</span>',
                    showConfirmButton: false, 
                    timer: 1800,
                });                         
                return;
            }

            anchorTag.innerHTML = `<i class="fa-regular text-dark fa-heart fa-lg  py-3 px-2" data-wishlist-productId="${productId}"></i><span class="mr-5">Add to Wishlist</span>`


        }else if(responseData.status){

            if(anchorTag.getAttribute('data-cart')){
                anchorTag.innerHTML = `<i class="fa-solid fa-heart fa-lg text-danger  py-3 px-2" data-wishlist-productId="${productId}"></i>`;
                Swal.fire({
                    position:'bottom',
                    html: '<span class="font-weight-bold"><i class="fa-solid fa-circle-check" style="color: #2dd26c;"></i> Added Successfully.<span>',
                    showConfirmButton: false, 
                    timer: 1999,
                })
                return;
            }

            anchorTag.innerHTML = `<i class="fa-solid fa-heart fa-lg text-danger  py-3 px-2" data-wishlist-productId="${productId}"></i><span class="mr-5">Item In Your Wishlist</span>`

        }else{

            // Swal.fire({
            //     text: 'Server Error!.',
            //     showConfirmButton: false, 
            //     timer: 1500,
            // })
        }

    })
})






// ***** REMOVE PRODUCT FROM WISHLIST ****
const removeProductWishlist = document.querySelectorAll('a[name="remove-wishlist"]');

removeProductWishlist.forEach((proucts)=>{
    proucts.addEventListener('click', async(event)=>{

        Swal.fire({
            title: 'Are you sure?',
            text: "It will permanently deleted !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#808080',
            confirmButtonText: '<i class="fa-regular fa-trash-can  fa-lg" style="color: #ffffff;"></i> Delete'
          }).then(async (result) => {
        
                if (result.isConfirmed) {

                    const wishlistProductId = event.target.getAttribute('data-wishlist-product');

                    const noofProducts = document.querySelectorAll('a[name="remove-wishlist"]')

                    const url = '/api/removeWishlistProduct';

                    const requestOptions = {
                        method:'DELETE',
                        body:JSON.stringify({
                            productId:wishlistProductId
                        }),
                        headers:{'Content-Type':'application/json'}
                    }

                    const response = await fetch(url,requestOptions);

                        if(!response.ok){
                            window.location.href = '/error500';
                            return;
                        }

                    const responseData = await response.json();

                    if(responseData.status){
                        
                        const divToRemove = document.getElementById(`${wishlistProductId}`);
                        divToRemove.remove();

                        console.log(noofProducts.length)
                        if(noofProducts.length == 1){
                            location.reload();
                        }
                        
                        Swal.fire({
                            position:'bottom',
                            html: '<i class="fa-solid fa-circle-check" style="color: #2dd26c;"></i> Successfully Removed.',
                            showConfirmButton: false, 
                            timer: 1500,
                        })
                    }else{
                        Swal.fire({
                            position:'bottom',
                            html: ' NetWork Please Try Again.',
                            showConfirmButton: false, 
                            timer: 1500,
                        })
                    }

                }
            })
    })
})