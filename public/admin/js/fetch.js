
document.getElementById('sidebar').addEventListener('click', async function(event){
    const contentPlaceholder = document.getElementById("dynamic_page");
    const id = event.target.id;


    /*========================================Product Page Loading Section ============================== */
    if(id == 'view-productlist'){

        productListView(); 
        

    }else if(id == 'add-product'){

        addProductPageLoad();

    }else if(id == 'view-categorylist'){

        viewAllCategoryDetails();

    }else if(id == 'add-category'){

        addCategoryPageView();

    }else if(id == 'view-couponlist'){

        viewCouponListPage();

    }else if(id == 'add-coupon'){

        // Add a new Coupon adding Form is Loaded
        fetch("/admin/addcoupon")
            .then((response) => {

                if(response.status == 401){
                    window.location.href = '/admin'
                    return;
                }

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((html) => {
                // Update the content of the placeholder with the fetched HTML
                contentPlaceholder.innerHTML = html;

                document.querySelector('title').innerHTML = 'Add Coupons';

                //ADD COUPON PAGE INSIDE FUNCTIONALIY
                addCoupon();
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });


    }
})

