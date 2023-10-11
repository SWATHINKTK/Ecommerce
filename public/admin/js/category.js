
document.getElementById('addCategoryForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const categoryname = document.getElementById('addCategoryForm').categoryname.value;
    const description = document.getElementById('addCategoryForm').description.value;
    const formData = {
        categoryname,
        description
    };
    const jsonData = JSON.stringify(formData)
    
    fetch('/admin/addcategory', {
        method: 'POST',
        body: jsonData,
        headers :{'Content-Type':'application/json'}
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('categorysuccess').innerHTML = data.message;
        setTimeout(() => {
            document.getElementById('categorysuccess').innerHTML = '';
        }, 2700);

        // Form Data reset to view New Form 
        if(data.status){document.getElementById('addCategoryForm').reset()}
    })
    .catch((error) => {
        console.log();('Error:', error.message);
    });
});


function editCategory(value){
    const row = value.parentElement.parentElement;
    const id = row.cells[1].textContent;
    const element = document.querySelector('td[data-category-id]');
    const category = element.getAttribute('data-category-id');
    alert(row);
    console.log(row);
    console.log(id);
    console.log(element);
    console.log(category);
}

async function categoryList(value){
    const row = value.parentElement.parentElement;
    const categoryName = row.cells[1].textContent;
    console.log(categoryName);
    const data = {
        category: categoryName
    }
    const jsonData = JSON.stringify(data);
    console.log(jsonData);
    const response = await fetch('/categorystatusupdate',{
        method: 'PATCH',
        body: jsonData
    })
}
