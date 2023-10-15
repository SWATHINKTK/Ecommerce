document.getElementById('sidebar').addEventListener('click', async function(event){
    const contentPlaceholder = document.getElementById("dynamic_page");
    const id = event.target.id;


    // Fetch is used to load the Product,Category, & Coupon Pages
    if(id == 'view-productlist'){

        // View the Product Into a table
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

    }else if(id == 'add-product'){

        // View the Add a New Product Form Page
        const response = await fetch("/admin/addproduct");

        // Response Check Field
        if(!response.ok){

            window.location.href = '/admin/error500';
            return;
        }

        //Response Convert to text and view
        const html = await response.text();
        contentPlaceholder.innerHTML = html;

        /*Fetch the Data and Render the Page at that time Drop down to view the 
        Category That Category Multiple Select Taken Script Code*/

        // Drop Down Dispalay view and hidden using
        document.getElementById('select-box').addEventListener('click',function(){
            const optionsContainer = document.getElementById('options-container');

            if (optionsContainer.style.display == 'block') {
                optionsContainer.style.display = 'none';
            } else {
                optionsContainer.style.display = 'block';
            }
        })
        
        // Selecting the Each input field
        const optionInputs = document.querySelectorAll('.option-input');
        const selectedOptions = document.querySelector('.selected-options');

        // view the Selecting input Field
        optionInputs.forEach((input) => {
            input.addEventListener('change', function () {
                const selected = Array.from(optionInputs)
                    .filter((input) => input.checked)
                    .map((input) => input.value);
                selectedOptions.textContent = selected.length > 0 ? selected.join(', ') : 'Select options';
            });
        });
        

       
       
       
                // fetch("/admin/addproduct")
        //     .then((response) => {
        //         if (!response.ok) {
        //             throw new Error("Network response was not ok");
        //         }
        //         return response.text();
        //     })
        //     .then((html) => {
        //         // Update the content of the placeholder with the fetched HTML
        //         contentPlaceholder.innerHTML = html;


        //         /*Fetch the Data and Render the Page at that time Drop down to view the 
        //                  Category That Category Multiple Select Taken Script Code*/

        //         // Drop Down Dispalay view and hidden using
        //         document.getElementById('select-box').addEventListener('click',function(){
        //             const optionsContainer = document.getElementById('options-container');

        //             if (optionsContainer.style.display == 'block') {
        //                 optionsContainer.style.display = 'none';
        //             } else {
        //                 optionsContainer.style.display = 'block';
        //             }
        //         })
                
        //         // Selecting the Each input field
        //         const optionInputs = document.querySelectorAll('.option-input');
        //         const selectedOptions = document.querySelector('.selected-options');
        
        //         // view the Selecting input Field
        //         optionInputs.forEach((input) => {
        //             input.addEventListener('change', function () {
        //                 const selected = Array.from(optionInputs)
        //                     .filter((input) => input.checked)
        //                     .map((input) => input.value);
        //                 selectedOptions.textContent = selected.length > 0 ? selected.join(', ') : 'Select options';
        //             });
        //         });

        //     })
        //     .catch((error) => {
        //         console.error("Fetch error:", error);
        //     });


            
    
    

    }else if(id == 'view-categorylist'){

        // View Category List to a Table Form
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
                const scriptSrc = '/public/admin/js/category/listCategory.js';
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

    }else if(id == 'add-category'){

         // Adding a New Category Page Loading with a form
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
                const scriptSrc = '/public/admin/js/category/addCategory.js';
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

    }else if(id == 'view-couponlist'){

        // View the Coupon Present in my appication in Table View
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

    }else if(id == 'add-coupon'){

        // Add a new Coupon adding Form is Loaded
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


    }
})


