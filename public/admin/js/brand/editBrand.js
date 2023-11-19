//************** Edit Form Data ***********
let cropperEditBrand;
let cropperEditBrandFile;
let srcEditBrandImage;
async function editBrandData(value){

    try{

        const id = value.getAttribute('name');
        const contentPlaceholder = document.getElementById("dynamic_page");
        
        const url = `/admin/editbrand${id}`
        const response = await fetch(url);

        if(!response.ok){
            Window.location.href = '/admin/error500';
        }

        const data = await response.text();

        contentPlaceholder.innerHTML = data;

        

        //*** Title Name Setting ***
        const title = document.querySelector('title');
        title.innerHTML = 'Edit Brand';
        

        //*** Edit Image View ***
        document.getElementById('editBrandImage').addEventListener('change',(event)=>{
           editImageViewInDiv(event);
        });

        //  CROPPER MODAL VIEW
        document.getElementById('editBrandCropModalView').addEventListener('click', (event) => {
            event.preventDefault();

            editBrandCropperModalView();

        });



        //*** Form Submit in Edit Brand Details ***
        document.getElementById('editBrandForm').addEventListener('submit',(event) => {
            event.preventDefault();

            //*** Calling a Fuction For Submiting Data.Fuction is Written Below ***
            submitEditBrandData();
        }) ;


        document.getElementById('editCropResult').addEventListener('click', (event) => {
            event.preventDefault();

            editBrandCropperResult();
        
        });


        
    }catch(error){
        console.log(error.message);
    }
}



//******** Function For Brand Edit.Brand Logo will View on a Div The Input Field Change Image Change *******
function editImageViewInDiv(event){
  
    const imgTag = document.getElementById('edit-brand-img-view');

        const input = event.target;
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                srcAddBrandImage = e.target.result;
                imgTag.src = srcAddBrandImage;

            }
            reader.readAsDataURL(input.files[0]);
        
        } else {
            imgTag.style.display = 'none';
            imgTag.src = '';
        }
}


// cropper modal view 
function editBrandCropperModalView(){

    const modal = document.getElementById('editBrandCropModal');
    modal.style.display = 'block';

    const imgTag = document.getElementById('edit-brand-img-view');

    const image = document.getElementById('editCroppingImageView');
    image.src = imgTag.src;

    cropperAddBrand = new Cropper(image, {
        aspectRatio: NaN, // Allow freeform cropping
        viewMode: 0,      // Display the cropped area in the preview
    });
}

function editBrandCropperResult(){

    if (cropperAddBrand) {
        const cropperCanvas = cropperAddBrand.getCroppedCanvas();

        if (cropperCanvas) {
            cropperCanvas.toBlob(async (blob) => {
                const imageElement = document.getElementById("edit-brand-img-view");
                imageElement.src = URL.createObjectURL(blob);
                const customName = "cropped-brand.png";
                const file = new File([blob], customName, { type: 'image/png' });
                cropperEditBrandFile = file;
            });
        }

        cropperAddBrand.destroy(); // Move the destroy call here
    }

    // Hide the modal
    document.getElementById('editBrandCropModal').style.display = "none";
}



// CROPPER WINDOW OPEN MODAL CLOSE
function editBrandImageCropClose(){
    const modal = document.getElementById('editBrandCropModal');
    modal.style.display = 'none';
    cropperEditBrand.destroy();
}

//*** Edit Form Submit Data ***
async function submitEditBrandData(){
    try{
        const form = document.getElementById('editBrandForm');
        const formData = new FormData(form);
        formData.append('editBrandImage',cropperEditBrandFile);


        const result = document.getElementById("edit-brand-submit-result");
        result.style.display = 'block';

        const validate = document.getElementById('validate-editbrand');
        validate.innerHTML = '';

        console.log(formData.get('brandName'))

        if(formData.get('brandName').trim() == ''){
            validate.innerHTML = '* enter brand name';
            return;
        }
        
        const url = '/admin/editbrand';
        const config = {
            method: 'POST',
            body: formData
        }

        const response = await fetch(url,config);

        if(!response.ok){
            window.location.href = '/admin/error500';
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
            window.location.reload();
        },2000);

    }catch(error){
        console.log(error.message);
    }
}
