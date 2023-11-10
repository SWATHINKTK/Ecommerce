
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