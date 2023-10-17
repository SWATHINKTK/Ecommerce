
document.getElementById('sidebar').addEventListener('click', async function(event){
    const contentPlaceholder = document.getElementById("dynamic_page");
    const id = event.target.id;
    console.log(id);

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



        /*==============================Form Data to send to the Server============================*/
        // Image Value Taken and Store to an Array
        const images = new Array(4);
        document.getElementById("productImage_1").addEventListener("change", function () {
            const imagePreview = document.getElementById("productImage_1");
            const input = this;
            
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.readAsDataURL(input.files[0]);
                images[0] = input.files[0]
            }
        });

        document.getElementById("productImage_2").addEventListener("change", function () {
            const imagePreview = document.getElementById("productImage_2");
            const input = this;
            
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.readAsDataURL(input.files[0]);
                images[1] = input.files[0]
            }
        });

        document.getElementById("productImage_3").addEventListener("change", function () {
            const imagePreview = document.getElementById("productImage_3");
            const input = this;
            
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.readAsDataURL(input.files[0]);
                images[2] = input.files[0]
            }
        });

        document.getElementById("productImage_4").addEventListener("change", function () {
            const imagePreview = document.getElementById("productImage_4");
            const input = this;
            
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.readAsDataURL(input.files[0]);
                images[3] = input.files[0]
            }
        });


        /*--------------------------Submit The Data ------------------------------------------ */

        document.getElementById('product-submit').addEventListener('click',async(event) => {
            event.preventDefault();

            // Form Data Object Creation 
            const formData = new FormData();

            // Retrieve the Values From form 
            const productname = document.getElementById('productname').value;
            const category = document.getElementById('productcategory').innerHTML;
            const description = document.getElementById('productdescription').value;
            const brandname = document.getElementById('productbrandname').value;
            const stock = document.getElementById('productstock').value;
            const price = document.getElementById('productprice').value;
            const size = document.getElementById('productsize').value;
            const material = document.getElementById('productmaterial').value;
            const color = document.getElementById('productcolor').value;
            const specification = document.getElementById('productspecification').value ;
         
            // images are append into the formData using a array
            images.forEach((val,i)=>{
                formData.append('productimages',images[i]);
            })

            // Appending the category into array 
            const productCategorys = category.split(', ');
            productCategorys.forEach((val,i)=>{
                formData.append('categorys',productCategorys[i]);
            })

            //Speicification Sett to array
            const specificationData = specification.split(',');
            specificationData.forEach((val,i) => {
                formData.append('specification',specificationData[i]);
            })

            // Form Data to append the all form Datas 
            formData.append('productname',productname);
            formData.append('description',description);
            formData.append('brandname',brandname);
            formData.append('stock',stock);
            formData.append('price',price);
            formData.append('size',size);
            formData.append('material',material);
            formData.append('color',color);


            // Sending the Data to Sever using fetch 
            try{
                const SendData = await fetch('/admin/productadd',{
                    method:'POST',
                    body:formData
                })

                if(!SendData.ok){
                    window.location.href = '/admin/error500'
                }

                const data = await SendData.json();

                const result = document.getElementById('product-sucess')

                if(data.status){
                    result.innerHTML = data.message + " &#9989";
                    result.style.color = "green";

                }else{
                    result.innerHTML = data.message + " &#10071;";
                    result.style.color = "red"

                }

                setTimeout(()=>{
                    result.innerHTML = '';
                },2000)

            }catch(error){
                console.log(error.message)
            }
 
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


