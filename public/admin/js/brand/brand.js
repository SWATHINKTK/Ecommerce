



//***** Brand Search ******
function searchBrands(){

    const searchData = document.getElementById("brandSearch").value;
    window.location.href = `/admin/searchbrand?search=${searchData}`;
}




//********* Brand Satus Update Modal Display ******
async function brandStatusUpdate(value){
    
    const id = value.getAttribute('id');

    const modal = document.getElementById('brand-modal');
    modal.style.display = 'block';

    const sucess_btn = document.getElementById('brand-unlist-sucess');
    sucess_btn.setAttribute('data-category-id',id)

}



// ******** Modal Sucess Btn Update The Status *******
async function brandUnlist(button){

    const id = button.getAttribute('data-category-id');

    const modal = document.getElementById('brand-modal');
    modal.style.display = 'none';

    const btn = document.querySelector(`td[id="${id}"]`);
    let status = document.querySelectorAll(`td[name="${id}"]`);
    status = status[0];

    const url = `/admin/brandstatusupdate${id}`;
    const response = await fetch(url);

    if(!response.ok){
        window.location.href = '/admin/error500';
    }

    const data = await response.json(); 

    if(data.status){
        status.innerHTML = '<span class="text-success font-weight-bold">&#9989; Listed</span>';
        btn.innerHTML = `<button class="btn btn-warning pl-3 pr-3" id="${id}" onclick="brandStatusUpdate(this)"><i class="bi bi-x-circle"></i>Unlist</button>`;
    }else{
        status.innerHTML = '<span class="text-danger font-weight-bold">&#128683; Unlisted</span>';
        btn.innerHTML = `<button class="btn btn-primary pl-4 pr-4" id="${id}" onclick="brandStatusUpdate(this)"><i class="bi bi-check2-circle"> </i>list</button>`;
    }
    
}


//***** Modal Back *****
function back(){
    const modal = document.getElementById('brand-modal');
    modal.style.display = 'none';
}