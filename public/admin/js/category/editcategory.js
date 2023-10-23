//*** Edit Category Name and Desciption***
document.getElementById('editCategoryForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const errorMessage = document.querySelectorAll('p[name="validate-category"]');
    // console.log(errorMessage)

    //*** Form id is used to taken the values of The Input Field ***
    const categoryname = document.getElementById('categoryname').value;
    const description = document.getElementById('category-description').value;
    const image = document.getElementById('edit-categoryImage');
    // console.log(categoryname,description,image)

    if(categoryname.trim() === ''){

        errorMessage[0].innerHTML = '* enter the categoryname';

    }else if(description.trim() == ''){

        errorMessage[2].innerHTML = '*enter the description'

    }else{ 

            const result = document.getElementById('category-submit-result');
            result.style.display = 'block';

            const form = document.getElementById('editCategoryForm');
            const formData = new FormData(form);


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
                setTimeout(() => {
                    result.style.display = 'none';
                },2000);
            

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




function imageView(event){
    const image = event;
    const imgTag = document.getElementById('edit-category-img-view');
    const file = image.files[0];


    if(file){

        const reader = new FileReader();

        reader.onload = function(e) {
            imgTag.src = e.target.result;
        }

        reader.readAsDataURL(file);
        imgTag.style.display = 'block';

    }else{
        imgTag.style.display = 'none';
        imgTag.src = '';
    }
}
