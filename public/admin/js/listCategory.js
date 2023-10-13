const modal = document.getElementById('modal');
const cancel = document.getElementById('cancel');
const sucess = document.getElementById('sucess');

// cancel.addEventListener('click',()=>{
//     modal.style.display = 'none';
// })

function back(){
    modal.style.display = 'none';
}
sucess.addEventListener('click',() => {
    modal.style.display = 'none';
    const buttonId = sucess.getAttribute('data-category-id');
    const categoryName = sucess.getAttribute('data-category-name')
    console.log(buttonId)
    const element = document.querySelector(`td[id="${buttonId}"]`);
    console.log(element)

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
async function categoryList(value){
    modal.style.display = 'block';
    const row = value.parentElement.parentElement;
    const id = row.cells[3]
    const categoryName = row.cells[1].textContent;
    sucess.setAttribute("data-category-name",categoryName)
    sucess.setAttribute("data-category-id",id.getAttribute('id'));    
}