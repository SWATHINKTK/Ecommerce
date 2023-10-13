document.addEventListener("DOMContentLoaded", function () {
    const contentPlaceholder = document.getElementById("dynamic_page");

    // Button to Work Events 
    document.getElementById("view-productlist").addEventListener("click", function () {
        // // Make a Fetch GET request to retrieve the EJS-rendered page
        fetch("/admin/productlist")
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

        // Category View Page Rendering using Fetch
        fetch("/admin/categorylist")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((html) => {

                // Update The Part Of The HTML & View Categorys
                contentPlaceholder.innerHTML = html;

                //View Category Page Inside js Functionality Working add Js File
                const scriptSrc = '/public/admin/js/listCategory.js';
                const scriptExist = document.querySelector(`script[src="${scriptSrc}"]`);

                if(scriptExist){
                    scriptExist.parentNode.removeChild(scriptExist);
                }
                const script = document.createElement('script');
                script.src = scriptSrc; 
                document.body.appendChild(script);
                
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    });
    document.getElementById("add-category").addEventListener("click", function () {

         // Adding a New Category Page Rendering using Fetch
        fetch("/admin/addcategory")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((html) => {

                // // Update The Part Of The HTML & View AddCategoryPage
                contentPlaceholder.innerHTML = html;
                
                //View Category Page Inside js Functionality Like Submit Data That Type Of Event are Handle Using
                const scriptSrc = '/public/admin/js/addCategory.js';
                const scriptExist = document.querySelector(`script[src="${scriptSrc}"]`);

                if(scriptExist){
                    scriptExist.parentNode.removeChild(scriptExist);
                }

                const script = document.createElement('script');
                script.src = scriptSrc; 
                document.body.appendChild(script);
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    });

    document.getElementById("coupon-list").addEventListener("click", function () {
        // // Make a Fetch GET request to retrieve the EJS-rendered page
        fetch("/admin/couponlist")
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

    document.getElementById("add-coupon").addEventListener("click", function () {
        // // Make a Fetch GET request to retrieve the EJS-rendered page
        fetch("/admin/addcoupon")
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

});

