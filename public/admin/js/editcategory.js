
async function editCategory(value){
    const row = value.parentElement.parentElement;
    const id = row.cells[1].textContent;

    const url = `/admin/editcategory${id}`
    
    fetch(url)
        .then((response) => {
            if(!(response.ok)){
                window.location.href = '/admin/error404'
            }else{
                return response.text();
            }    
        })
        .then((data) => {
            document.getElementById("dynamic_page").innerHTML = data;
        })
        .catch((error) => {
            console.log(error.message);
        })
}

async function categoryList(value){
    const row = value.parentElement.parentElement;
    const categoryName = row.cells[1].textContent;
    const status = row.cells[3].textContent;
    const element = document.querySelector('td[data-category-id]');
    const category = element.getAttribute('data-category-id');

    fetch('/admin/categorystatusupdate',{
        method: 'PATCH',
        body: JSON.stringify({'category':`${categoryName}`}),
        headers: {'Content-Type':'application/json'}
    })
    .then((response) => response.json())
    .then((data) => {
        if(data.list){
                row.cells[3].innerHTML = '<button class="btn btn-warning pl-3 pr-3" onclick="categoryList(this)"><i class="bi bi-x-circle"></i>Unlist</button>';
        }else{
            row.cells[3].innerHTML = '<button class="btn btn-primary pl-4 pr-4" onclick="categoryList(this)"><i class="bi bi-check2-circle"> </i>list</button>';
        }
        
    }).catch((error) => {
        console.log(error.message);
    })
    
}
