
// Product More Details view in Modal
async function viewMore(value){
    const target = value;
    console.log(target.id)
    const id = target.getAttribute('data-viewmore-id');
    console.log(id)
    const url = `/admin/productmoredata${id}`;

    const response = await fetch(url);

    if(!response.ok){
        window.location.href = '/admin/error500';
        return;
    }

    const data = await response.text();

    const modal_div = document.getElementById('modal-total-div');
    modal_div.style.display = "block";
    
    const modal_body = document.getElementById('product-modal-content');
    modal_body.innerHTML = data;
}


// Product Status Cahnge
async function productStatus(tag){

    const id = tag.getAttribute('data-button-id');
    const modal = document.getElementById('product-confirmation-modal');
    modal.style.display = 'block';
   
    const modal_ok = document.getElementById('list-confirmation-sucess');
    modal_ok.setAttribute('data-product-id',id)
    console.log(modal_ok)

}

async function productStatusSucess(){

    const modal_ok = document.getElementById('list-confirmation-sucess');
    const id = modal_ok.getAttribute('data-product-id');
    const button = document.querySelector(`td[id="${id}"]`);

    const url = `/admin/productstausupdate${id}`
    const response = await fetch(url);

    if(!response.ok){

        window.location.href = '/admin/error500';
    }

    const data = await response.json();

    if(data.message){
        button.innerHTML = `<button class="btn  btn-outline-danger pl-4 pr-4 l-u-button" name="l-u-button" data-button-id="${data.id}">List</button>`;

    }else{
        button.innerHTML = `<button class="btn btn-outline-success pl-3 pr-3 l-u-button" name="l-u-button" data-button-id="${data.id}">UnList</button>`;
    }

}