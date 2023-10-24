
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














// *********************************************** ADD PRODUCT DATA SECTION **********************************************************************

// Function Calling From Fetch.js For Product View On input Change
function productImagePreview(fileInput,imageFile){

    //*** Div For the Image View ***
    const imagePreview = document.getElementById('product-image-preview');

    //*** Checking The Image Limit ***
    if(imageFile.length < 5 && fileInput.files.length <= 4){

        //*** Storing Images In the Passing Array and Create Image Tag ***
        for(let i = 0; i < fileInput.files.length;i++){

            //*** Image File Push To Array ***
            imageFile.push(fileInput.files[i]);

            //*** Image View To Create Image Tag Dynamically ***
            const img = document.createElement('img');
            img.src = URL.createObjectURL(fileInput.files[i]); 
            img.name = i
            img.width = 100;

            //*** Image Remove To Create Button Dynamically ***
            const btn = document.createElement('button');
            btn.id = i;
            btn.classList.add("remove");
            btn.innerHTML = `<i class="bi bi-x remove" id='${i}'></i>`;

            //*** Apppend That Button And Image To Preview View Div
            imagePreview.appendChild(img);
            imagePreview.appendChild(btn);
        }
    }else{

        document.getElementById('validate-product').innerHTML = 'Image Upload Limit Exceeded ! Only Upload 4 Images . You Can Removed Then Add.'

    }
}




// *** Remove File View In The Image Preview And Remove From That Array *** 
function removePreviewImage(button,imageFile){

    // *** Index Value Stored as a id in Button Retrieve Id ***
    const id = button.getAttribute('id');

    //*** Image and Button id Taken For Removing ***
    const imagePreview = document.getElementById('product-image-preview');
    const imageRemove = document.querySelector(`img[name="${id}"]`);
    const buttonRemove = document.querySelector(`button[id="${id}"]`);
   
    //*** Image Remove From The Array ***
    imageFile.splice(id,1);

    //*** Image Remove From That Div and Remove Button ***
    imagePreview.removeChild(imageRemove);
    imagePreview.removeChild(buttonRemove);

}




//********* Submit The New Product Data **********
async function submitNewProductData(imageFile){
  
    //*** Retrieve The Form And Creating Form Data ***
    const form = document.getElementById('addProduct-form');
    const formData = new FormData(form);


    //*** Retrieve The Brand Data ***
    const brandName = document.getElementById('productbrandname');
    formData.append('productBrandName',brandName);


    //*** Retrieve the CategoryData View in Div . Then Appending the Category Array Into Form Data ***
    const category = document.getElementById('productcategory').innerHTML;
    const productCategorys = category.split(',');
    productCategorys.forEach((val,i)=>{
        formData.append('productCategory',productCategorys[i]);
    })



    //*** ImageFile Passing Through The Fuction This Value Added To The Form Data ***
    imageFile.forEach((val,i) => {
        formData.append('productImage',imageFile[i]);
    })
    
    

    //========================= SUBMIT DATA TO FETCH ==============================

    try{

        const result = document.getElementById("add-product-submit-result");
        result.style.display = 'block';

        const response = await fetch('/admin/productadd',{
            method:'POST',
            body:formData
        })

        if(!response.ok){
            window.location.href = '/admin/error500'
        }

        const data = await response.json();


        if (data.status) {

            result.setAttribute('class','alert alert-success');
            result.innerHTML = data.message;
            document.getElementById("editBrandForm").reset();

        }else{
            
            result.setAttribute('class','alert alert-danger');
            result.innerHTML = data.message;
        }

        setTimeout(()=>{
            result.style.display = 'none';
        },2000);

    }catch(error){

        console.log(error.message);

    }
}



// ****** Product Validate Data ********
function validateProductData(imageFile){

    alert(imageFile.length)
    // Selecting The Error Message Printing P tag
    const errorElements = document.querySelectorAll('p[name="validate-addProduct"]');


    // *** Show error Message hiding ***
    errorElementReset();


    // Retrieve the Values From form 
    const productname = document.getElementById('productname').value;
    const category = document.getElementById('productcategory').innerHTML;
    const description = document.getElementById('productdescription').value;
    const brandName = document.getElementById('productbrandname').value;
    const stock = document.getElementById('productstock').value;
    const price = document.getElementById('productprice').value;
    const size = document.getElementById('productsize').value;
    const material = document.getElementById('productmaterial').value;
    const color = document.getElementById('productcolor').value;
    const specification = document.getElementById('productspecification').value ;
    const imgLength = imageFile.length;


    // Validation Checking
    if(productname.trim() == ''){

        errorElements[0].innerHTML = "* enter productname";
        return false;

    }else if(category == 'Select Category'){

        errorElements[1].innerHTML = "* select category";
        return false;

    }else if(description.trim() == ''){

        errorElements[2].innerHTML = "* enter description";
        return false;

    }else if(brandName.trim() == ''){

        errorElements[3].innerHTML = "* select brand";
        return false;

    }else if(stock.trim() == ''){

        errorElements[4].innerHTML = "* enter the stock";
        return false;

    }else if(stock < 0){

        errorElements[4].innerHTML = "* stock can not be negative";
        return false;

    }else if(price <= 0){

        errorElements[5].innerHTML = "* price can not be negative / zero";
        return false;

    }else if(size.trim() == ''){

        errorElements[6].innerHTML = "* enter size";
        return false;

    }else if(size < 0){

        errorElements[6].innerHTML = "* size can not be negative ";
        return false;

    }else if(material.trim() == ''){

        errorElements[7].innerHTML = "* enter material";
        return false;

    }else if(imageFile.length < 2){
        alert(imageFile.length)

        errorElements[8].innerHTML = "* upload atleast two images";
        return false;

    }else if(specification.trim() == ''){

        errorElements[9].innerHTML = "* enter specification";
        return false;

    }else{
        return true;
    }



}



//**** Error Element Hiding ******
function errorElementReset(){
    const errorElements = document.querySelectorAll('p[name="validate-addProduct"]');
    
    errorElements.forEach((val,i) => {
        val.innerHTML = '';
    })
}