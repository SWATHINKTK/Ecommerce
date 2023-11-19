//***** Image View On EDIT Category Form *****
let cropperEditCategory;
let croppedImgEditCategory;
let srcEditCategoryImage;
function editCategoryimageView(event){
    const input = event;
    const imgTag = document.getElementById('edit-category-img-view');

    if (input.files && input.files[0]) {

        const reader = new FileReader();
        reader.onload = function (e) {
            srcEditCategoryImage = e.target.result;
            imgTag.src = srcEditCategoryImage;

            document.getElementById('editCategoryImagePreview').style.display = 'block';
            imgTag.style.display = 'block';

        }
        reader.readAsDataURL(input.files[0]);
    }else{
        imgTag.style.display = 'none';
        document.getElementById('editCategoryImagePreview').style.display = 'none';
        imgTag.src = '';
    }

}


// EDIT CATEGORY CROPPER VIEW
const editCategoroyCropperWindow = document.getElementById('editCategory-CropperWindowView');

if(editCategoroyCropperWindow){

    editCategoroyCropperWindow.addEventListener('click',(event)=>{
        event.preventDefault();

        const modal = document.getElementById('editCategory-cropper-modal');
        modal.style.display = 'block';

        const image = document.getElementById('editCategory-cropper-Image');
        if(srcEditCategoryImage){
            image.src = srcEditCategoryImage;
        }else{
            image.src = document.getElementById('edit-category-img-view').src;
        }

        cropperEditCategory = new Cropper(image, {
            aspectRatio: NaN, // Allow freeform cropping
            viewMode: 0,      // Display the cropped area in the preview
        });
    })
}



// CROPPER RESULT GET BUTTON CLICK
const editCategorycropResult = document.getElementById('editCategory-cropResult');

if(editCategorycropResult){
    editCategorycropResult.addEventListener('click', (event) => {
        event.preventDefault();

        if (cropperEditCategory) {
            const cropperCanvas = cropperEditCategory.getCroppedCanvas();

            if (cropperCanvas) {
                cropperCanvas.toBlob(async (blob) => {
                    const imageElement = document.getElementById("edit-category-img-view");
                    imageElement.src = URL.createObjectURL(blob);
                    const customName = "cropped-editCategory.png";
                    const file = new File([blob], customName, { type: 'image/png' });
                    croppedImgEditCategory = file;

                });
            }

            cropperEditCategory.destroy(); // Move the destroy call here
        }

        // Hide the modal
        document.getElementById('editCategory-cropper-modal').style.display = "none";
    });
}



// CROPPER WINDOW OPEN MODAL CLOSE
function editCategoryCropperClose(){
    const modal = document.getElementById('editCategory-cropper-modal');
    modal.style.display = 'none';
    cropperEditCategory.destroy();
}




//*** Edit Category Name and Desciption***
document.getElementById('editCategoryForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const errorMessage = document.querySelectorAll('p[name="validate-category"]');
    // console.log(errorMessage)

    //*** Form id is used to taken the values of The Input Field ***
    const categoryname = document.getElementById('categoryname').value;
    const description = document.getElementById('category-description').value;
    const image = document.getElementById('edit-categoryImage');



    if(categoryname.trim() === ''){

        errorMessage[0].innerHTML = '* enter the categoryname';

    }else if(description.trim() == ''){

        errorMessage[2].innerHTML = '*enter the description'

    }else{ 

            const result = document.getElementById('edit-category-submit-result');
            result.style.display = 'block';

            const form = document.getElementById('editCategoryForm');
            const formData = new FormData(form);

            if(croppedImgEditCategory){
                formData.set('categoryImage',croppedImgEditCategory);
            }


            // *** Fetch API is Used To Send Data And Update ***
            fetch('/admin/editcategory', {
                method: 'POST',
                body: formData
            }) 

            .then(response => response.json())

            .then(data => {
               
                //*** Status of the Edit Result Print on Web And reset the form After Sucess ***
                if(data.status){

                    //*** Adding Updated Data To The Field
                    document.getElementById('categoryname').setAttribute('value',`${categoryname}`);
                    document.getElementById('category-description').innerHTML = description;

                    result.innerHTML = data.message;
                    result.setAttribute('class','alert alert-success');
                    document.getElementById('editCategoryForm').reset();

                }else{

                    result.innerHTML = data.message;
                    result.setAttribute('class','alert alert-danger');

                }


                // ***Result Data Div Hide
                setTimeout(()=>{
                    result.style.display = 'none';
                    viewAllCategoryDetails();
                    window.scroll(0,0)
                },2000)
            

            })
            .catch((error) => {
                console.log();('Error:', error.message);
            });
    }

    
});


// ***** Clear The Error Messages ***
function clearErrorMessages(){
    const errorMessage = document.querySelectorAll('p[id="validate-category"]');

    errorMessage.forEach((element) => {
        element.innerHTML = '';
    })
}




// function imageView(event){
//     const image = event;
//     const imgTag = document.getElementById('edit-category-img-view');
//     const file = image.files[0];


//     if(file){

//         const reader = new FileReader();

//         reader.onload = function(e) {
//             imgTag.src = e.target.result;
//         }

//         reader.readAsDataURL(file);
//         imgTag.style.display = 'block';

//     }else{
//         imgTag.style.display = 'none';
//         imgTag.src = '';
//     }
// }
