
document.getElementById('sidebar').addEventListener('click', async function(event){
    const contentPlaceholder = document.getElementById("dynamic_page");
    const id = event.target.id;
    // console.log(id);

    /*========================================Product Page Loading Section ============================== */
    if(id == 'view-productlist'){

        // ********* View the Product Into a table ************
        const response = await fetch("/admin/productlist");

        if(!response.ok){
            window.location.href = '/admin/error500';
            return;
        }

        const data = await response.text();
        contentPlaceholder.innerHTML = data;

      
        /*--------------------------------------------View More Data--------------------------------------------- */
        const imageFile = [];
        document.getElementById('table-product').addEventListener('click',function(event) {
            const target = event.target;
            
            if(target.tagName == 'A' && target.classList.contains('product-viewmore')){
                viewMore(target)

            }else if(target.tagName == 'BUTTON' && target.classList.contains('l-u-button')){
                productStatus(target);

            }else if(target.tagName == 'BUTTON' && target.classList.contains('product-edit-button')){
                loadEditProductPage(target,imageFile);
                

            }

        /*---------------------------------------View More Data End------------------------------------------------*/



        })


        /* --------------------------------------------Back Button for View More Data------------------------------------------------- */
        document.getElementById('product-cancel').addEventListener('click',()=>{
            const modal_div = document.getElementById('modal-total-div');
            modal_div.style.display = "none";
        })



        /*------------------------------------------Sucess Button for list unllist Product------------------------------------------- */
        document.getElementById('list-confirmation-sucess').addEventListener('click',()=>{
            productStatusSucess();
        })



        /*------------------------------------------ 2 Back Button for confiramation modal-------------------------------------------- */
        document.getElementById('list-confirmation-cancel1').addEventListener('click',()=>{
            listModalDisplayHidden()
        })
        document.getElementById('list-confirmation-cancel2').addEventListener('click',()=>{
            listModalDisplayHidden()
        })


        document.getElementById('productSearchBtn').addEventListener('click',async function(){
            const searchData = document.getElementById('productSearch').value;

            const url = `/admin/searchproduct${searchData}`;
            
            const response = await fetch(url);

            if(!response.ok){
                window.location.href = '/admin/error500';
            }

            const data = await response.text();
            contentPlaceholder.innerHTML = data;
            buttonWorkSearch();

        })       


    }else if(id == 'add-product'){

        /*------------------------Fetch View Add Product Page------------------ */
        try{
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

        }catch(error){
            console.log(error.message)
        }
        
        /*----------------------End of the Fetch--------------------- */



        /* ====================Fetch the Data and Render the Page at that time Drop down to view the Category 
                             That Category Multiple Select Taken Script Code=======================================================*/


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
        const categoryHidden = document.getElementById('categoryHidden');

        // view the Selecting input Field
        optionInputs.forEach((input) => {
            input.addEventListener('change', function () {
                const selected = Array.from(optionInputs)
                    .filter((input) => input.checked)
                    .map((input) => {
                        return input.value
                    });
                selectedOptions.textContent = selected.length > 0 ? selected.join(', ') : 'Select options';

                const selectedId = Array.from(optionInputs)
                .filter((input) => input.checked)
                .map((input) => {
                    return input.getAttribute('data-category-id')
                });
                categoryHidden.value = selectedId;
            });
        });

      
        /*------------------------------End of view Category------------------------------------------ */


        // #################################### Image View Input Field Triggering ############################################
        const imageFile = []
        document.getElementById('productImage').addEventListener('change',(event)=>{
            const fileInput = event.target;
            
            //*** Passing The Event Of the Input Field and The Array we Created For Storing Image Files Function Triggering to Coming Image Fields
            productImagePreview(fileInput,imageFile)
              
        });


        // ################################ Image Remove From The View Of the Images #########################################
        document.getElementById('image-preview-main-div').addEventListener('click',(event) =>{
            event.preventDefault()
            
            // Product Added Image Remove
            if(event.target.classList.contains("remove")){

                // Call The Fuction And Remove Images From Div. Function Present On the viewProduct.js
                removePreviewImage(event.target,imageFile);
            }
        })

        
        

        /*--------------------------Submit The Data ------------------------------------------ */

        document.getElementById('addProduct-form').addEventListener('submit',async(event) => {
            event.preventDefault();

            const validate = validateProductData(imageFile);
            if(validate)
                submitNewProductData(imageFile);
            
        /*-----------------------------------------Submit data complete------------------------------------------ */

          
 
        })

        

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

