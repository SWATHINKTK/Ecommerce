
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

        /*------------------------Fetch View Page------------------ */

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

        /*----------------------End of the Fetch--------------------- */



        /*---------Fetch the Data and Render the Page at that time Drop down to view the Category 
        That Category Multiple Select Taken Script Code----------------------------------------*/


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

        /*------------------------------End of view Category------------------------------------------ */


        
        
        /*-------------------------- Event Deligation for view images --------------------------------*/

        // this event deligation for selcting image and  view that image imediatly
        document.getElementById('image-product-data').addEventListener('change',(event)=>{
            const image = event.target;

            // this funcation view the images
            function imageView(imageProduct,imageTag){

                const imagePreview = document.getElementById(`${imageProduct}`);
                const file = image.files[0];
    
                    if(file){
    
                        const reader = new FileReader();
    
                        reader.onload = function(e) {
                            imageTag.src = e.target.result;
                        }
    
                        reader.readAsDataURL(file);
                        imageTag.style.display = 'block';
    
                    }else{
                        imageTag.style.display = 'none';
                        imageTag.src = '';
                    }
    
            }

            if(image.id == 'productImage_1'){

                const image1 = document.getElementById('imageProduct-1');
                imageView('imageProduct-1',image1);
            
            }else if(image.id == 'productImage_2'){

                const image2 = document.getElementById('imageProduct-2');
                imageView('imageProduct-2',image2);

            }else if(image.id == 'productImage_3'){

                const image3 = document.getElementById('imageProduct-3');
                imageView('imageProduct-3',image3);

            }else if(image.id == 'productImage_4'){

                const image4 = document.getElementById('imageProduct-4');
                imageView('imageProduct-4',image4);

            }
        });

        /*------------------ End Of The Event Deligation for view images-----------------------*/



        /*----------------------Form Data to send to the Server--------------------------------*/

        document.getElementById('product-submit').addEventListener('click',async(event) => {
            event.preventDefault();

            // Form data taken form element & Creating Form object
            const form = document.getElementById('addProduct-form');
            const formData = new FormData(form);
            

            // Multiple images taken product name sett all fields taken as array and store it object
            const imageFiles = formData.getAll("productImage");
            const imageName = []; 
            
            for (let i = 0; i < imageFiles.length; i++) {
                imageName[i] = imageFiles[i].name;
            }
           
            console.log(...formData);

            // Retriev the data from category and storing it as a array
            const categorylist = document.getElementById('categorys').innerHTML;
            let category = categorylist.split(', ');
            formData.append('categorys',category);
        
            // converting the data in to json

            const SendData = await fetch('/admin/productadd',{
                method:'POST',
                body:formData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Type": "multipart/form-data",
                },

            })

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


