
//******** Product More Details view in Modal *******
async function viewMore(value){

    try{

        const target = value;
        console.log(target.id)
        const id = target.getAttribute('data-viewmore-id');
        console.log(id)


        const url = `/admin/productmoredata${id}`;

        const response = await fetch(url);

        if(!response.ok){
            window.location.href = '/admin/error500';
            return;
        }

        const data = await response.text();

        const modal_div = document.getElementById('modal-total-div');
        modal_div.style.display = "block";
        
        const modal_body = document.getElementById('product-modal-content');
        modal_body.innerHTML = data;

    }catch(error){
        console.log(error.message);
    }

    
}



// ******Product Status Change ********
async function productStatus(tag){

    const id = tag.getAttribute('data-button-id');
    const modal = document.getElementById('product-confirmation-modal');
    modal.style.display = 'block';
   
    const modal_ok = document.getElementById('list-confirmation-sucess');
    modal_ok.setAttribute('data-product-id',id)
    console.log(modal_ok)

}



//********** List and Unlist Button click view modal ************
async function productStatusSucess(){

    try{

        const modal_ok = document.getElementById('list-confirmation-sucess');
        const id = modal_ok.getAttribute('data-product-id');
        const button = document.querySelector(`td[id="${id}"]`);

        const url = `/admin/productstausupdate${id}`
        const response = await fetch(url);

        if(!response.ok){

            window.location.href = '/admin/error500';
            return;
        }

        const data = await response.json();

        if(data.message){
            button.innerHTML = `<button class="btn  btn-outline-danger pl-4 pr-4 l-u-button" name="l-u-button" data-button-id="${data.id}">List</button>`;

        }else{
            button.innerHTML = `<button class="btn btn-outline-success pl-3 pr-3 l-u-button" name="l-u-button" data-button-id="${data.id}">UnList</button>`;
        }

        const modal = document.getElementById('product-confirmation-modal');
        modal.style.display = 'none';

    }catch(error){
        console.log(error.message);
    }


}


//*************** Edit product Page Rendring *********
async function loadEditProductPage(target){

    try{

        const button = target;
        const id = button.getAttribute('data-edit-id');
        console.log(id)
        const contentPlaceholder = document.getElementById("dynamic_page");
        
        const url = `/admin/editproduct${id}`
        const response = await fetch(url);

        if(!response.ok){
            window.location.href = '/admin/error500'
        }

        const data = await response.text();
        
        contentPlaceholder.innerHTML = data;

    }catch(error){
        console.log(error.message)
    }
    


    /* ====================Fetch the Data and Render the Page at that time Drop down to view the Category 
                             That Category Multiple Select Taken Script Code=======================================================*/


        // Drop Down Dispalay view and hidden using
        document.getElementById('select-box').addEventListener('click',function(){
            const optionsContainer = document.getElementById('options-container');
            console.log('open')
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

            if(image.id == 'editProductImage_1'){

                const image1 = document.getElementById('editImageProduct-1');
                imageView('editImageProduct-1',image1);
            
            }else if(image.id == 'editProductImage_2'){

                const image2 = document.getElementById('editImageProduct-2');
                imageView('editImageProduct-2',image2);

            }else if(image.id == 'editProductImage_3'){

                const image3 = document.getElementById('editImageProduct-3');
                imageView('editImageProduct-3',image3);

            }else if(image.id == 'editProductImage_4'){

                const image4 = document.getElementById('editImageProduct-4');
                imageView('editImageProduct-4',image4);

            }
        });

        /*------------------ End Of The Event Deligation for view images-----------------------*/
        
        
        
        /*==============================Form Data to send to the Server Images are Setting to array============================*/
        // Image Value Taken and Store to an Array
        const images = new Array(4);
        document.getElementById("editProductImage_1").addEventListener("change", function () {
            // const imagePreview = document.getElementById("productImage_1");
            const input = this;
            
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.readAsDataURL(input.files[0]);
                images[0] = input.files[0]
            }
        });

        document.getElementById("editProductImage_2").addEventListener("change", function () {
            // const imagePreview = document.getElementById("productImage_2");
            const input = this;
            
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.readAsDataURL(input.files[0]);
                images[1] = input.files[0]
            }
        });

        document.getElementById("editProductImage_3").addEventListener("change", function () {
            // const imagePreview = document.getElementById("productImage_3");
            const input = this;
            
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.readAsDataURL(input.files[0]);
                images[2] = input.files[0]
            }
        });

        document.getElementById("editProductImage_4").addEventListener("change", function () {
            // const imagePreview = document.getElementById("productImage_4");
            const input = this;
            
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.readAsDataURL(input.files[0]);
                images[3] = input.files[0]
            }
        });




        /*--------------------------Submit The Data ------------------------------------------ */

        document.getElementById('edit-product-submit').addEventListener('click',async(event) => {
            event.preventDefault();

            // Form Data Object Creation 
            const formData = new FormData();

            // Retrieve the Values From form 
            const productname = document.getElementById('editProductName').value;
            const category = document.getElementById('editProductCategory').innerHTML;
            const description = document.getElementById('editProductDescription').value;
            const brandname = document.getElementById('editProductBrandname').value;
            const stock = document.getElementById('editProductStock').value;
            const price = document.getElementById('editProductPrice').value;
            const size = document.getElementById('editProductSize').value;
            const material = document.getElementById('editProductMaterial').value;
            const color = document.getElementById('editProductColor').value;
            const specification = document.getElementById('editProductSpecification').value ;
            const oldImages = document.getElementById('oldImages').value;
            const id = document.getElementById('productId').value;
            
            // Old Images are Append the form data
            const old = oldImages.split(',');
            old.forEach((val,i) => {
                formData.append('imageOld',old[i])
            })


            // console.log(images);
            const update = []
            // images are append into the formData using a array
            images.forEach((val,i)=>{
                formData.append('productimages',images[i]);
                if(images[i]){
                    formData.append('imageUpdatePosition',i);
                }
            })
            

            // Appending the category into array 
            const productCategorys = category.split(',');
            console.log(productCategorys)
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
            formData.append('id',id);

            // console.log(...formData)


            // Sending the Data to Sever using fetch 
            try{

                const url = '/admin/editproduct';
                const config = {
                    method:'POST',
                    body:formData
                };

                const response = await fetch(url,config)

                if(!response.ok){
                    window.location.href = '/admin/error500'
                }

                const data = await response.json();

                const result = document.getElementById('edit-product-sucess')

                if(data.status){
                    result.innerHTML = "Sucessfully Updated &#9989";
                    result.style.color = "green";

                }else{
                    result.innerHTML = "Enter All Field &#10071;";
                    result.style.color = "red"

                }

                setTimeout(()=>{
                    result.innerHTML = '';
                },2000)

            }catch(error){
                console.log(error.message)
            }
            /*-----------------------------------------Submit data complete------------------------------------------ */


        })




}