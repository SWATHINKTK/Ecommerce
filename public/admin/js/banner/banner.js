

let cropperAddBanner;
let cropperAddBannerResult;

// BANNER INPUR FIELD CHANGE TIME IMAGE PREVIEW VIEW
const bannerBackground = document.getElementById('bannerBackground');

if(bannerBackground){
    bannerBackground.addEventListener('change',(event) => {

        const backgroundPreview = document.getElementById('bannerBackgroundImg');

        const input = event.target;

        if (input.files && input.files[0]) {

            const reader = new FileReader()

            reader.onload = (e) => {
                backgroundPreview.src = e.target.result;
            }
            reader.readAsDataURL(input.files[0])
        }
    })
}



// BANNER CROPPER MODAL 
const bannerCropperWindow = document.getElementById('banner-background-CropperWindowView');

if(bannerCropperWindow){

    bannerCropperWindow.addEventListener('click',(event) => {
        event.preventDefault();

        const cropperModal = document.getElementById('addBanner-cropper-modal');
        cropperModal.style.display = 'block';

        const inputImg = document.getElementById('bannerBackgroundImg');
        const modalCropperImg = document.getElementById('addBanner-cropper-Image');
        modalCropperImg.src = inputImg.src;

        cropperAddBanner = new Cropper(modalCropperImg , {
            aspectRatio : NaN,
            viewMode:0
        })
         
    })
}

// IMAGE CROPPER MODAL CLOSE
function addBannerCropperClose(){
    const cropperModal = document.getElementById('addBanner-cropper-modal');
    cropperModal.style.display = 'none';

    cropperAddBanner.destroy();
}

// IMAGE CROPPER RESULT TAKEN
const addBannerCropperResult = document.getElementById('bannerCropResult');

if(addBannerCropperResult){

    addBannerCropperResult.addEventListener('click',(event) => {
        event.preventDefault();

        if (cropperAddBanner) {
            const cropperCanvas = cropperAddBanner.getCroppedCanvas();

            if (cropperCanvas) {
                cropperCanvas.toBlob(async (blob) => {
                    const imageElement = document.getElementById("bannerBackgroundImg");
                    imageElement.src = URL.createObjectURL(blob);
                    const customName = "cropped-Banner.png";
                    const file = new File([blob], customName, { type: 'image/png' });
                    cropperAddBannerResult = file;

                });
            }

            cropperAddBanner.destroy(); // Move the destroy call here
        }

        // Hide the modal
        document.getElementById('addBanner-cropper-modal').style.display = "none";
    })
}



// ADD BANNER DATA
const submitAddBannerData = document.getElementById('addBannerForm');

if(submitAddBannerData){

    submitAddBannerData.addEventListener('submit', async(event) => {
        event.preventDefault();

        const bannerResult = document.getElementById('banner-submit-result');


        const form = document.getElementById('addBannerForm');
        const formData = new FormData(form);

        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        if(cropperAddBannerResult){
            formData.set('bannerBackground',cropperAddBannerResult);
        }

        if(validateBanner(data)){

            const url = '/admin/addBanner';
            const requestOptions = {
                method:'POST',
                body:formData
            }


            const response = await fetch(url,requestOptions);

                if(!response.ok){
                    window.location.href = '/admin/error500';
                }
            
            const responseData = await response.json();

            if(responseData.success){
                
                window.scroll(0,0);
                bannerResult.setAttribute('class','alert alert-success');
                bannerResult.innerHTML = 'Banner Data Added Sucessful';

                setTimeout(() => {
                    window.location.reload();
                }, 2000);

            }else{
                bannerResult.setAttribute('class','alert alert-danger');
                bannerResult.innerHTML = 'Banner Added Failed Tryagain';
            }
        }

    })
}


// VALLIDATE BANNER DATA
function validateBanner(formData){

    const data = formData;

    const errorElemetns = document.querySelectorAll('p[name="validate-banner"]');
    removeErrorElements();

    let is_valid = true;

    

    if(data.bannerOfferName.trim() == ''){

        errorElemetns[0].innerHTML = ' * please fill out this field.';
        is_valid = false;

    }
    if(data.bannerHeading.trim() == ''){

        errorElemetns[1].innerHTML = ' * please fill out this field.';
        is_valid = false;

    }
    if(data.linkPage.trim() == ''){

        errorElemetns[2].innerHTML = ' * please fill out this field.';
        is_valid = false;

    } 
    if(document.getElementById('bannerBackground').files.length == 0){

        errorElemetns[3].innerHTML = ' * upload a image.';
        is_valid = false;

    }
    if(data.bannerDescription.trim() == ''){

        errorElemetns[4].innerHTML = ' * please fill out this field.';
        is_valid = false;

    } 
    return is_valid;
}




// **** REMOVING THE ERROR ELEMENTS IN THE FORM ****
function removeErrorElements(){

    const erroElemetns = document.querySelectorAll('p[name="validate-banner"]');

    erroElemetns.forEach((val)=>{
        val.innerHTML = '';
    })
}


const bannerPreviewAddBrand = document.getElementById('bannerPreview');

if(bannerPreviewAddBrand){

    bannerPreviewAddBrand.addEventListener('click',(event) => {
        event.preventDefault();

        const bannerImagePreview = document.getElementById('bannerImagePreview');



        const form = document.getElementById('addBannerForm');
        const formData = new FormData(form);

        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }


        if(validateBanner(data)){

            bannerImagePreview.style.display = 'block';

            const image = document.getElementById('bannerBackgroundImg');
            bannerImagePreview.style.backgroundImage = `url("${image.src}")`;

            const banner = document.getElementsByName('banner');

            banner[0].innerHTML = data.bannerOfferName;
            banner[1].innerHTML = data.bannerHeading;
            banner[2].innerHTML = data.bannerDescription;

        }
    })
}