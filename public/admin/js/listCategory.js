// List or Unlist Button to Confirmation Modal Display
function categoryList(value){
    document.getElementById('modal').style.display = 'block';

    // Button preset Row to taken the Categoryname for uniqueness
    const row = value.parentElement.parentElement;
    const id = row.cells[3]
    console.log(id)
    const categoryName = row.cells[1].textContent;

    // Adding Data to the Ok button 
    document.getElementById('sucess').setAttribute("data-category-name",categoryName)
    document.getElementById('sucess').setAttribute("data-category-id",id.getAttribute('id'));    
}

// Modal Back Button Functionality Working Method
function back(){
    document.getElementById('modal').style.display = 'none';
}

// Modal OK Button Functionality To Update the Data
document.getElementById('sucess').addEventListener('click',() => {
    document.getElementById('modal').style.display = 'none';

    // Retrieve the Data From OK Button 
    const buttonId = document.getElementById('sucess').getAttribute('data-category-id');
    const categoryName = document.getElementById('sucess').getAttribute('data-category-name')
    const element = document.querySelector(`td[id="${buttonId}"]`);

    fetch('/admin/categorystatusupdate',{
        method: 'PATCH',
        body: JSON.stringify({'category':`${categoryName}`}),
        headers: {'Content-Type':'application/json'}
    })
    .then((response) => response.json())
    .then((data) => {
        if(data.list){
            element.innerHTML = '<button class="btn btn-warning pl-3 pr-3" onclick="categoryList(this)"><i class="bi bi-x-circle"></i>Unlist</button>';
        }else{
            element.innerHTML = '<button class="btn btn-primary pl-4 pr-4" onclick="categoryList(this)"><i class="bi bi-check2-circle"> </i>list</button>';
        }
        
    }).catch((error) => {
        console.log(error.message);
    })
})





// Edit Button to View Edit Category Page
async function editCategory(value){

    // Take the Category name from that button Present Row 
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

            // Edit Category Page Inside js Functionality Working add Js File 
            const scriptSrc = '/public/admin/js/editCategory.js';
            const scriptExist = document.querySelector(`script[src="${scriptSrc}"]`);

            if(scriptExist){
                scriptExist.parentNode.removeChild(scriptExist);
            }

            const script = document.createElement('script');
            script.src = scriptSrc; 
            document.body.appendChild(script);
        })
        .catch((error) => {
            console.log(error.message);
        })
}


// Searching the Category Based on name
function search(){

    const  searchData = document.getElementById('categorySearch').value;
    
    const url = '/admin/searchcategory';
    const post = {
        method:'POST',
        body: JSON.stringify({'search':`${searchData}`}),
        headers:{'Content-Type':'application/json'}
    }

    fetch(url,post)

    .then((response) => {
        if(!(response.ok)){
            window.location.href = '/admin/error500';
        }
        return response.text();
    })

    .then((data) => {
        document.getElementById("dynamic_page").innerHTML = data;
    }).catch((error) => {
        console.log(error.message)
    })

}





