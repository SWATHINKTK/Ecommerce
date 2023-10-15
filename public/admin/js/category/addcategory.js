document.getElementById('addCategoryForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const categoryname = document.getElementById('addCategoryForm').categoryname.value;
    const description = document.getElementById('addCategoryForm').description.value;
    
    const formData = {
        categoryname,
        description
    };
    const jsonData = JSON.stringify(formData);
    
    fetch('/admin/addcategory', {
        method: 'POST',
        body: jsonData,
        headers :{'Content-Type':'application/json'}
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('categorysuccess').innerHTML = data.message;
        if(data.status){document.getElementById('addCategoryForm').reset()}
    })
    .catch((error) => {
        console.log();('Error:', error.message);
    });
});


