
//*************** Edit product Page Rendring *********
async function loadEditProductPage(target,imageFile){

    // UpdateImage Position Checking 
    let tempImage = [];
    let removeImage = [];
    let k = 0;
    try{

        const button = target;
        const id = button.getAttribute('data-edit-id');
        console.log(id)
        const contentPlaceholder = document.getElementById("dynamic_page");
        
        const url = `/admin/editproduct${id}`
        const response = await fetch(url);

            if(response.status == 401){
                window.location.href = '/admin'
                return;
            }

            if(!response.ok){
                window.location.href = '/admin/error500'
            }

        const data = await response.text();
        
        contentPlaceholder.innerHTML = data;


        const image = document.getElementById('oldImages').value;
        const imageArray = image.split(',')
        imageFile = [...imageArray];
        tempImage = [...imageArray];
        

    }catch(error){
        console.log(error.message)
    }
    


            // DROP DOWN FOR CATEGORY SELECTING
            document.getElementById('select-box').addEventListener('click',function(){
                const optionsContainer = document.getElementById('options-container');

                if (optionsContainer.style.display == 'block') {
                    optionsContainer.style.display = 'none';
                } else {
                    optionsContainer.style.display = 'block';
                }
            })
            

            // SELECTING EACH INPUT FIELD 
            const optionInputs = document.querySelectorAll('.option-input');
            const selectedOptions = document.querySelector('.selected-options');
            const categoryHidden = document.getElementById('categoryHidden');

            // RETRIVEING THE SELECTED DATA 
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



        document.getElementById('productImage').addEventListener('change',(event)=>{
            const fileInput = event.target;
            
            // PRODCTIMAGE PREVIEW
            productImagePreview(fileInput,imageFile)
              
        });




        // ################################ Image Remove From The View Of the Images #########################################
        document.getElementById('edit-image-preview-main-div').addEventListener('click',(event) =>{
            event.preventDefault()
            // Product Added Image Remove
            if(event.target.classList.contains("remove")){
                // Call The Fuction And Remove Images From Div. Function Present On the viewProduct.js
                removePreviewImage(event.target,imageFile);
                
            }else if(event.target.classList.contains("cropperBtn")){

                // CROP BUTTON TO VIEW MODAL
                cropperWindowView(event.target, imageFile);
                
                addProductImageCropClose();
    
                imageCropResult(imageFile);
            }
        });

        

        

        document.getElementById('editProduct-form').addEventListener('submit',async(event) => {
            event.preventDefault();

            const validate = validateProductData(imageFile);
            if(validate)
                submitEditData(imageFile);
        });
        

        //*** Edit Product Data Sumbit ***
        async function submitEditData(imageData){
            
            //*** Retrieve The Form And Creating Form Data ***
            const form = document.getElementById('editProduct-form');
            const formData = new FormData(form);

            const brandId = document.getElementById('productBrandId').value;
            formData.append('productBrandName',brandId);

            // *** Append Category Data Into Form Data ***
            const category = document.getElementById('categoryHidden').value;
            const productCategorys = category.split(',');
            productCategorys.forEach((val,i)=>{
                formData.append('productCategory',productCategorys[i]);
            })


            
            removeImage.forEach((val,i) => {
                formData.append('removeImage',removeImage[i]);
            })


             //*** ImageFile Passing Through The Fuction This Value Added To The Form Data ***
            imageFile.forEach((val,i) => {
                formData.append('productImage',imageFile[i]);
            })

            imageFile.splice(0,imageFile.length);
            tempImage.splice(0,tempImage.length);

         

            

            try{

                const result = document.getElementById("edit-product-submit-result");
                result.style.display = 'block';

                const response = await fetch('/admin/editproduct',{
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
                    window.scroll(0,0)
                    document.getElementById("editProduct-form").reset();

                }else{
                    
                    result.setAttribute('class','alert alert-danger');
                    result.innerHTML = data.message;
                }

                setTimeout(()=>{
                    result.style.display = 'none';
                    productListView();
                    window.scroll(0,0);
                },2000);

            }catch(error){

                console.log(error.message);

            }
        }


}







// function editRemovePreviewImage(button, imageFile){

//     // INDEX VALUE RETRIEVE THE EVENT EMITING BUTTON
//     const id = button.getAttribute('id');

//     //*** Image and Button id Taken For Removing ***
//     const imagePreview = document.getElementById('product-image-preview');
//     const imageRemove = document.querySelector(`img[name="${id}"]`);
//     const btnDiv = document.querySelector(`div[id="btnDiv${id}"]`);
//     const images = document.querySelectorAll('img[class="addProductImage"]');
    


//     // REMOVE THAT INDEX IMAGE FROM ARRAY
//     imageFile.splice(id,1);

//     // REMOVE IMAGE FROM THE MAIN DIV
//     imagePreview.removeChild(imageRemove);
//     imagePreview.removeChild(btnDiv);

//     const remove = document.querySelectorAll('button i.bi.bi-x.remove');

//     const cropperBtn = document.querySelectorAll('button i.mdi.mdi-crop.cropperBtn');

//     const addProductImage = document.querySelectorAll('img[class="addProductImage"]');

//     const imagePreviewBtnDiv = document.querySelectorAll('.imagePreview-BtnDiv');

//     imageFile.forEach(function(file,i) {

//         // DYNAMICALLY CREATE THE IMAGE TAG VALUE ASSIGN
//         addProductImage[i].src = URL.createObjectURL(file);
//         addProductImage[i].name = i

//         // DYNAMICALLY CREATE A DELETE BUTTON VALUE ASSIGN
//         remove[i].parentElement.id = i;
//         remove[i].id = i;

//         // DYNAMICALLY CREATE CROP BUTTON VALUE ASSIGN
//         cropperBtn[i].parentElement.id = `cropperBtn${i}`;
//         cropperBtn[i].name = i.toString();
//         cropperBtn[i].id = `cropperBtn${i}`;

//         // BUTTON VIEW CREATE DIV
//         imagePreviewBtnDiv[i].id = `btnDiv${i}`

//     });  


//     // // *** Index Value Stored as a id in Button Retrieve Id ***
//     // const id = button.getAttribute('id');


//     // //*** Image and Button id Taken For Removing ***
//     // const imagePreview = document.getElementById('product-image-preview');
//     // const imageRemove = document.querySelector(`img[name="${id}"]`);
//     // const buttonRemove = document.querySelector(`button[id="${id}"]`);


//     // //*** Image Remove From The Array ***
//     // imageFile.splice(0,imageFile.length);
    
//     // removeImage[k++] = tempImage [id];
//     // tempImage[id] = false;
    
//     // imageFile = tempImage.filter(val => val!=false);
//     // // console.log(imageFile)


//     // //*** Image Remove From That Div and Remove Button ***
//     // imagePreview.removeChild(imageRemove);
//     // imagePreview.removeChild(buttonRemove);

// }