
// ***** Product Data Add To Wishlist ****
const addToWishlist = document.querySelectorAll('a[name="addToWishlist"]');

addToWishlist.forEach((addWishlistBtn)=>{

    addWishlistBtn.addEventListener('click',async(event) => {
        event.preventDefault();

        const productId = event.target.getAttribute('data-wishlist-productId');
        
        const anchorTag = event.target.parentNode;

        console.log(anchorTag)

        const response = await fetch(`/api/addWishlist${productId}`);

            if(!response.ok){
                window.location.href = '/error500';
            }
        
        const responseData = await response.json();

        if(responseData.status && responseData.removed){

            anchorTag.innerHTML = `<i class="fa-regular text-dark fa-heart fa-lg  py-3 px-2" data-wishlist-productId="${productId}"></i><span class="mr-5">Add to Wishlist</span>`

            // event.target.setAttribute('class','fa-regular fa-heart fa-lg text-dark py-3 px-2');
            // event.target.setAttribute('data-wishlist-productId',`${productId}`);

            // Swal.fire({
            //     html: '<i class="fa-solid fa-circle-check" style="color: #2dd26c;"></i> Successfully Removed.',
            //     showConfirmButton: false, 
            //     timer: 1800,
            // });


        }else if(responseData.status){

            anchorTag.innerHTML = `<i class="fa-solid fa-heart fa-lg text-danger  py-3 px-2" data-wishlist-productId="${productId}"></i><span class="mr-5">Item In Your Wishlist</span>`


            // event.target.setAttribute('class','fa-solid fa-heart fa-lg text-danger py-3 px-2');
            // event.target.setAttribute('data-wishlist-productId',`${productId}`);

            // Swal.fire({
            //     html: '<i class="fa-solid fa-circle-check" style="color: #2dd26c;"></i> Successfully Added.',
            //     showConfirmButton: false, 
            //     timer: 1800,
            // })

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
                    }

                    if(response.status == 404){

                        window.location.href = '/login';

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

                    }

                }
            })
    })
})