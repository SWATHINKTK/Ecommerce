document.getElementById('editCategoryForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Form id is used to taken the values. 
    const categoryname = document.getElementById('editCategoryForm').categoryname.value;
    const description = document.getElementById('editCategoryForm').description.value;
    const categoryId = document.getElementById('categoryid').value;
    
    // These Data Send to convert the data to object and then json
    const formData = {
        categoryname,
        description,
        categoryId
    };
    const jsonData = JSON.stringify(formData);

    fetch('/admin/editcategory', {
        method: 'POST',
        body: jsonData,
        headers :{'Content-Type':'application/json'}
    }) 
    .then(response => response.json())
    .then(data => {

        // Status of the Edit Result Print on Web And reset the form After Sucess
        document.getElementById('UpdateStatus').innerHTML = data.message;
        if(data.status){document.getElementById('addCategoryForm').reset()}
    })
    .catch((error) => {
        console.log();('Error:', error.message);
    });
});



