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
                
                // Add a script tag dynamically
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

