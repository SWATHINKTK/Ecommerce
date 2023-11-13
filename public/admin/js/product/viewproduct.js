
// **** VIEW OF PRODUCT LIST (VIEW IN TABLE) *****
async function productListView(){

    const contentPlaceholder = document.getElementById("dynamic_page");

    const response = await fetch("/admin/productlist");

        if(response.status == 401){
            window.location.href = '/admin'
            return;
        }


        if(!response.ok){
            window.location.href = '/admin/error500';
            return;
        }

    const data = await response.text();
    contentPlaceholder.innerHTML = data;

    document.querySelector('title').innerHTML = 'Products';
    actionInViewProductTable();
}




// **** ACTION VIEW PRODUCT TABLE ****
function actionInViewProductTable(){
    
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

    });


    // ***** MODAL ACTION EVENTS *****
    document.getElementById('product-cancel').addEventListener('click',()=>{
        const modal_div = document.getElementById('modal-total-div');
        modal_div.style.display = "none";
    })



    document.getElementById('list-confirmation-sucess').addEventListener('click',()=>{
        productStatusSucess();
    })


    document.getElementById('list-confirmation-cancel1').addEventListener('click',()=>{
        listModalDisplayHidden()
    })
    document.getElementById('list-confirmation-cancel2').addEventListener('click',()=>{
        listModalDisplayHidden()
    })
}




//******** Product More Details view in Modal *******
async function viewMore(value){

    try{

        const target = value;
        console.log(target.id)
        const id = target.getAttribute('data-viewmore-id');
        console.log(id)


        const url = `/admin/productmoredata${id}`;

        const response = await fetch(url);

            if(response.status == 401){
                window.location.href = '/admin'
                return;
            }

            if(!response.ok){
                window.location.href = '/admin/error500';
                return;
            }

        const data = await response.text();

        const modal_div = document.getElementById('modal-total-div');
        modal_div.style.display = "block";
        
        const modal_body = document.getElementById('product-modal-content');
        modal_body.innerHTML = data;

        const colorViewDiv = document.getElementById('color-view');
        const color = colorViewDiv.getAttribute('data-product-color');
        colorViewDiv.style.backgroundColor = `${color}`;
        

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

            if(response.status == 401){
                window.location.href = '/admin'
                return;
            }

            if(!response.ok){

                window.location.href = '/admin/error500';
                return;
            }

        const data = await response.json();

        if(data.message){
            button.innerHTML = `<button class="btn  btn-danger pl-3 pr-3 l-u-button" name="l-u-button" data-button-id="${data.id}">Unlist</button>`;

        }else{
            button.innerHTML = `<button class="btn btn-success pl-4 pr-4 l-u-button" name="l-u-button" data-button-id="${data.id}">List</button>`;
        }

        const modal = document.getElementById('product-confirmation-modal');
        modal.style.display = 'none';

    }catch(error){
        console.log(error.message);
    }


}

// ** List Unlist Modal display None 
function listModalDisplayHidden(){
    const modal = document.getElementById('product-confirmation-modal');
    modal.style.display = 'none';
}





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

        document.getElementById('productImage').addEventListener('change',(event)=>{
            const fileInput = event.target;
            
            //*** Passing The Event Of the Input Field and The Array we Created For Storing Image Files Function Triggering to Coming Image Fields
            productImagePreview(fileInput,imageFile)
            console.log(imageFile)
              
        });




        // ################################ Image Remove From The View Of the Images #########################################
        document.getElementById('edit-image-preview-main-div').addEventListener('click',(event) =>{
            event.preventDefault()
            // Product Added Image Remove
            if(event.target.classList.contains("remove")){

                // Call The Fuction And Remove Images From Div. Function Present On the viewProduct.js
                editRemovePreviewImage(event.target,imageFile);
                console.log(event.target)
                console.log(imageFile)
            }
        })
        function editRemovePreviewImage(button){

            // *** Index Value Stored as a id in Button Retrieve Id ***
            const id = button.getAttribute('id');
        

            //*** Image and Button id Taken For Removing ***
            const imagePreview = document.getElementById('product-image-preview');
            const imageRemove = document.querySelector(`img[name="${id}"]`);
            const buttonRemove = document.querySelector(`button[id="${id}"]`);
        

            //*** Image Remove From The Array ***
            imageFile.splice(0,imageFile.length);
            
            removeImage[k++] = tempImage [id];
            tempImage[id] = false;
            
            imageFile = tempImage.filter(val => val!=false);
            // console.log(imageFile)

        
            //*** Image Remove From That Div and Remove Button ***
            imagePreview.removeChild(imageRemove);
            imagePreview.removeChild(buttonRemove);
        
        }

        

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

        document.getElementById('validate-addProduct').innerHTML = 'Image Upload Limit Exceeded ! Only Upload 4 Images . You Can Removed Then Add.'

        setTimeout(() => {
            document.getElementById('validate-addProduct').innerHTML = '';
        }, 2000);
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
async function submitNewProductData(imageFile,brandId){
  
    //*** Retrieve The Form And Creating Form Data ***
    const form = document.getElementById('addProduct-form');
    const formData = new FormData(form);


    // *** RETRIEVE BRAND DATA ID AND ASSIGN TO FORM DATA ***
    formData.append('productBrandName',brandId);


    //*** Retrieve the CategoryData View in Div . Then Appending the Category Array Into Form Data ***
    const category = document.getElementById('categoryHidden').value;
    const productCategorys = category.split(',');
    productCategorys.forEach((val,i)=>{
        formData.append('productCategory',productCategorys[i]);
    })



    //*** ImageFile Passing Through The Fuction This Value Added To The Form Data ***
    imageFile.forEach((val,i) => {
        formData.append('productImage',imageFile[i]);
    })

    imageFile.splice(0,imageFile.length)
    

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
            window.scroll(0,0);
            document.getElementById("addProduct-form").reset();
            document.getElementById('product-image-preview').style.display = 'none';

        }else{
            
            result.setAttribute('class','alert alert-danger');
            window.scroll(0,0);
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













function buttonWorkSearch(){
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
}