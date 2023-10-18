
//******** Product More Details view in Modal *******
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



// ******Product Status Change ********
async function productStatus(tag){

    const id = tag.getAttribute('data-button-id');
    const modal = document.getElementById('product-confirmation-modal');
    modal.style.display = 'block';
   
    const modal_ok = document.getElementById('list-confirmation-sucess');
    modal_ok.setAttribute('data-product-id',id)
    console.log(modal_ok)

}



//********** List and Unlist Button click view modal ************
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

    const modal = document.getElementById('product-confirmation-modal');
    modal.style.display = 'none';
}


//*************** Edit product Page Rendring *********
async function loadEditProductPage(target){
    const button = target;
    const id = button.getAttribute('data-edit-id');
    console.log(id)
    const contentPlaceholder = document.getElementById("dynamic_page");
    
    const url = `/admin/editproduct${id}`
    const response = await fetch(url);

    if(!response.ok){
        window.location.href = '/admin/error500'
    }

    const data = await response.text();
    
    contentPlaceholder.innerHTML = data;


    /* ====================Fetch the Data and Render the Page at that time Drop down to view the Category 
                             That Category Multiple Select Taken Script Code=======================================================*/


        // Drop Down Dispalay view and hidden using
        document.getElementById('select-box').addEventListener('click',function(){
            const optionsContainer = document.getElementById('options-container');
            console.log('open')
            if (optionsContainer.style.display == 'block') {
                optionsContainer.style.display = 'none';
            } else {
                optionsContainer.style.display = 'block';
            }
        })
        

        // Selecting the Each input field
        const optionInputs = document.querySelectorAll('.option-input');
        const selectedOptions = document.querySelector('.selected-options');

        // view the Selecting input Field
        optionInputs.forEach((input) => {
            input.addEventListener('change', function () {
                const selected = Array.from(optionInputs)
                    .filter((input) => input.checked)
                    .map((input) => input.value);
                selectedOptions.textContent = selected.length > 0 ? selected.join(', ') : 'Select options';
            });
        });

        /*------------------------------End of view Category------------------------------------------ */
}