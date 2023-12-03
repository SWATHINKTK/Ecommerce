
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

         // Adding a New Category Page Loading with a form
         fetch("/admin/addcategory")
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
<<<<<<< HEAD
                // Update the content of the placeholder with the fetched HTML
                contentPlaceholder.innerHTML = html;
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    });
    document.getElementById("add-product").addEventListener("click", function () {
        // // Make a Fetch GET request to retrieve the EJS-rendered page
        fetch("/admin/addproduct")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((html) => {
                // Update the content of the placeholder with the fetched HTML
                contentPlaceholder.innerHTML = html;
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    });
    document.getElementById("edit-product").addEventListener("click", function () {
        // // Make a Fetch GET request to retrieve the EJS-rendered page
        fetch("/admin/editproduct")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((html) => {
                // Update the content of the placeholder with the fetched HTML
                contentPlaceholder.innerHTML = html;
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    });
    document.getElementById("category-list").addEventListener("click", function () {
        // // Make a Fetch GET request to retrieve the EJS-rendered page
        fetch("/admin/categorylist")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((html) => {
                // Update the content of the Category List with the fetched HTML
                contentPlaceholder.innerHTML = html;

                // Dynamically Script tag is created to Linked url based
                const existingScript = document.querySelector('script[src="/public/admin/js/category.js"]');
                if(!(existingScript)){
                    const script = document.createElement('script');
                    script.src = '/public/admin/js/category.js'; 
                    document.body.appendChild(script);
                }
                
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    });
    document.getElementById("add-category").addEventListener("click", function () {
        // // Make a Fetch GET request to retrieve the EJS-rendered page
        fetch("/admin/addcategory")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((html) => {
                // Update the content of the placeholder with the fetched HTML
                contentPlaceholder.innerHTML = html;
                
                // Dynamically Script tag is created to Linked url based
                const existingScript = document.querySelector('script[src="/public/admin/js/category.js"]');
                if(!(existingScript)){
                    const script = document.createElement('script');
                    script.src = '/public/admin/js/category.js'; 
                    document.body.appendChild(script);
                }
                
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    });
    document.getElementById("edit-category").addEventListener("click", function () {
        // // Make a Fetch GET request to retrieve the EJS-rendered page
        fetch("/admin/editcategory")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((html) => {
                // Update the content of the placeholder with the fetched HTML
                contentPlaceholder.innerHTML = html;
                
                // Dynamically Script tag is created to Linked url based
                const existingScript = document.querySelector('script[src="/public/admin/js/category.js"]');
                if(!(existingScript)){
                    const script = document.createElement('script');
                    script.src = '/public/admin/js/category.js'; 
                    document.body.appendChild(script);
                }
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    });
=======

                // // Update The Part Of The HTML & View AddCategoryPage
                contentPlaceholder.innerHTML = html;
                
                //View Category Page Inside js Functionality Like Submit Data That Type Of Event are Handle Using
                const scriptSrc = '/public/admin/js/category/addCategory.js';
                const scriptExist = document.querySelector(`script[src="${scriptSrc}"]`);

                if(scriptExist){
                    scriptExist.parentNode.removeChild(scriptExist);
                }

                const script = document.createElement('script');
                script.src = scriptSrc; 
                document.body.appendChild(script);
>>>>>>> master

                document.querySelector('title').innerHTML = 'Add Categorys';
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });

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

