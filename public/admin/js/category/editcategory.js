//*** Edit Category Name and Desciption***
document.getElementById('editCategoryForm').addEventListener('submit',function (event) {

    event.preventDefault(); // Prevent the default form submission

    //*** Form id is used to taken the values of The Input Field ***
    const categoryname = document.getElementById('editCategoryForm').categoryname.value;
    const oldCategoryName = document.getElementById('editCategoryForm').oldCategoryName.value;
    const description = document.getElementById('editCategoryForm').description.value;
    const categoryId = document.getElementById('categoryid').value;


    //*** Select The Result Printing Option
    const result = document.getElementById("category-submit-result");
    result.style.display = 'block';
    

    //*** Input Field Taken Value Store Object & Convert To JSON ***
    const formData = {
        categoryname,
        description,
        categoryId,
        oldCategoryName
    };
    const jsonData = JSON.stringify(formData);


    // *** Fetch API is Used To Send Data And Update ***
    fetch('/admin/editcategory', {
        method: 'POST',
        body: jsonData,
        headers :{'Content-Type':'application/json'}
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
       },2000)
        

    })
    .catch((error) => {
        console.log();('Error:', error.message);
    });

    
});



