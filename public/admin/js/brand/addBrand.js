/*======================= Add Brand Image view On Change The Input Section ==============================*/

// IMAGE UPLOAD TIME IMAGE VIEW ON THE OUT SIDE
let cropperAddBrand;
let croppedImgAddBrand;
let srcAddBrandImage;
const brandImageUpload = document.getElementById('brandImageUpload');

if (brandImageUpload) {
    brandImageUpload.addEventListener('change', (event) => {

        const imgTag = document.getElementById('brand-img-view');

        const input = event.target;
  
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                srcAddBrandImage = e.target.result;
                imgTag.src = srcAddBrandImage;

                document.getElementById('brandAddImgDiv').style.display = 'block';
                imgTag.style.display = 'block';

            }
            reader.readAsDataURL(input.files[0]);
        
        } else {
            imgTag.style.display = 'none';
            imgTag.src = '';
        }
    });
}


// CROPPER MODAL VIEW 
const brandCropModalView = document.getElementById('brandCropModalView');

if(brandCropModalView){
    brandCropModalView.addEventListener('click', (event) => {
        event.preventDefault();

        const modal = document.getElementById('brandCropModal');
        modal.style.display = 'block';

        const image = document.getElementById('croppingImageView');
        image.src = srcAddBrandImage;

        cropperAddBrand = new Cropper(image, {
            aspectRatio: NaN, // Allow freeform cropping
            viewMode: 0,      // Display the cropped area in the preview
        });
    });
}


// CROPPER RESULT GET BUTTON CLICK
const cropResult = document.getElementById('cropResult');

if(cropResult){
    cropResult.addEventListener('click', (event) => {
        event.preventDefault();

        if (cropperAddBrand) {
            const cropperCanvas = cropperAddBrand.getCroppedCanvas();

            if (cropperCanvas) {
                cropperCanvas.toBlob(async (blob) => {
                    const imageElement = document.getElementById("brand-img-view");
                    imageElement.src = URL.createObjectURL(blob);
                    const customName = "cropped-brand.png";
                    const file = new File([blob], customName, { type: 'image/png' });
                    cropperAddBrand = file;
                });
            }

            cropperAddBrand.destroy(); // Move the destroy call here
        }

        // Hide the modal
        document.getElementById('brandCropModal').style.display = "none";
    });
}


// CROPPER WINDOW OPEN MODAL CLOSE
function brandImageCropClose(){
    const modal = document.getElementById('brandCropModal');
    modal.style.display = 'none';
    cropperAddBrand.destroy();
}



/*==================================== Add Brand Data To Data Base ====================================*/
const addBrandForm = document.getElementById('addBrandForm');

if(addBrandForm){

    addBrandForm.addEventListener('submit',async(event)=>{
        event.preventDefault();
        try{

            const brandName = document.getElementById('brandname').value;
            const image = document.getElementById('brandImageUpload');
            var file = image.files[0];
            let validate = document.querySelectorAll('p[name="validate-brand"]');

            if(brandName.trim() === ''){

                validate[0].innerHTML = '* enter Brand name';

            }else if(image.files.length < 1){

                validate[1].innerHTML = '* please upload an image';

            }else{

                validate[0].innerHTML = '';
                //*** Creating a FormData Object ***
                const form = document.getElementById('addBrandForm');
                const formData = new FormData(form);

                if(cropperAddBrand){
                    formData.append('brandImage',cropperAddBrand);
                    cropperAddBrand = undefined;
                }
                

                //*** Result Printing in the request
                const result = document.getElementById("brand-submit-result");
                result.style.display = 'block';

                const url = '/admin/addbrand';
                const config = {
                    method: 'POST',
                    body: formData
                }
                const response = await fetch(url,config);

                if(!response.ok){

                    window.location.href = '/admin/error500'
                    
                }

                const data = await response.json();

                if (data.status) {

                    result.setAttribute('class','alert alert-success');
                    result.innerHTML = data.message;
                    document.getElementById("addBrandForm").reset();
                    document.getElementById('brandAddImgDiv').style.display = "none";


                }else{
                    
                    result.setAttribute('class','alert alert-danger');
                    result.innerHTML = data.message;
                }

                setTimeout(()=>{

                    result.style.display = 'none';

                },2000)
            }

        }catch(error){

            console.log(error.message);
        }

    })
}


//*** Cancel Button To Reset Form ***
function formReset(id){
    const form = document.getElementById(`${id}`);
    form.reset();
}