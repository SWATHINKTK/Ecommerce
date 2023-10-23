document.getElementById("addCategoryForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        console.log('helo')
        const categoryname = document.getElementById('categoryname').value;
        const image = document.getElementById('categoryImage');
        const categoryDescription = document.getElementById('category-description').value;


        let validate = document.querySelectorAll('p[name="validate-category"]');

        if(categoryname.trim() === ''){

            validate[0].innerHTML = '* enter Brand name';
            validate[1].innerHTML = '';
            validate[2].innerHTML = '';

        }else if(image.files.length == 0){

            validate[0].innerHTML = '';
            validate[1].innerHTML = '* upload image';
            validate[2].innerHTML = '';

        }else if(categoryDescription.trim() === ''){

            validate[0].innerHTML = '';
            validate[1].innerHTML = '';
            validate[2].innerHTML = '* enter description';

        }
        else{

            const result = document.getElementById('category-submit-result');
            result.style.display = 'block';
            
            const form = document.getElementById('addCategoryForm');
            const formData = new FormData(form);

            fetch("/admin/addcategory", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    
                    if (data.status) {
                        result.setAttribute('class','alert alert-success');
                        result.innerHTML = data.message;
                        document.getElementById("addCategoryForm").reset();
                    }else{
                        result.setAttribute('class','alert alert-danger');
                        result.innerHTML = data.message;
                    }
                })
                .catch((error) => {
                    console.log();
                    "Error:", error.message;
                });

                setTimeout(()=>{
                    result.style.display = 'none';
                },2000);
        }
});


function formReset(){
    window.location.href = '/admin/home';
    // document.getElementById("addCategoryForm").reset();
}

//***** Image View On Add Category Form *****
function imageView(event){
    const image = event;
    const imgTag = document.getElementById('category-img-view');
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