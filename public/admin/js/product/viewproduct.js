
// **** VIEW OF PRODUCT LIST (VIEW IN TABLE) *****
async function productListView(){

    const contentPlaceholder = document.getElementById("dynamic_page");

    const response = await fetch("/admin/productlist");

        if(response.status == 401){
            window.location.href = '/admin'
            return;
        }


        if(!response.ok){
            window.location.href = '/admin/error500';
            return;
        }

    const data = await response.text();
    contentPlaceholder.innerHTML = data;

    document.querySelector('title').innerHTML = 'Products';
    actionInViewProductTable();
}




// **** ACTION VIEW PRODUCT TABLE ****
function actionInViewProductTable(){
    
    const imageFile = [];
    document.getElementById('table-product').addEventListener('click',function(event) {
        const target = event.target;
        
        if(target.tagName == 'A' && target.classList.contains('product-viewmore')){
            viewMore(target)

        }else if(target.tagName == 'BUTTON' && target.classList.contains('l-u-button')){
            productStatus(target);

        }else if(target.tagName == 'BUTTON' && target.classList.contains('product-edit-button')){
            loadEditProductPage(target,imageFile);
            

        }

    });


    // ***** MODAL ACTION EVENTS *****
    document.getElementById('product-cancel').addEventListener('click',()=>{
        const modal_div = document.getElementById('modal-total-div');
        modal_div.style.display = "none";
    })



    document.getElementById('list-confirmation-sucess').addEventListener('click',()=>{
        productStatusSucess();
    })


    document.getElementById('list-confirmation-cancel1').addEventListener('click',()=>{
        listModalDisplayHidden()
    })
    document.getElementById('list-confirmation-cancel2').addEventListener('click',()=>{
        listModalDisplayHidden()
    })
}




//******** Product More Details view in Modal *******
async function viewMore(value){

    try{

        const target = value;
        console.log(target.id)
        const id = target.getAttribute('data-viewmore-id');
        console.log(id)


        const url = `/admin/productmoredata${id}`;

        const response = await fetch(url);

            if(response.status == 401){
                window.location.href = '/admin'
                return;
            }

            if(!response.ok){
                window.location.href = '/admin/error500';
                return;
            }

        const data = await response.text();

        const modal_div = document.getElementById('modal-total-div');
        modal_div.style.display = "block";
        
        const modal_body = document.getElementById('product-modal-content');
        modal_body.innerHTML = data;

        const colorViewDiv = document.getElementById('color-view');
        const color = colorViewDiv.getAttribute('data-product-color');
        colorViewDiv.style.backgroundColor = `${color}`;
        

    }catch(error){
        console.log(error.message);
    }

    
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

    try{

        const modal_ok = document.getElementById('list-confirmation-sucess');
        const id = modal_ok.getAttribute('data-product-id');
        const button = document.querySelector(`td[id="${id}"]`);

        const url = `/admin/productstausupdate${id}`
        const response = await fetch(url);

            if(response.status == 401){
                window.location.href = '/admin'
                return;
            }

            if(!response.ok){

                window.location.href = '/admin/error500';
                return;
            }

        const data = await response.json();

        if(data.message){
            button.innerHTML = `<button class="btn  btn-danger pl-3 pr-3 l-u-button" name="l-u-button" data-button-id="${data.id}">Unlist</button>`;

        }else{
            button.innerHTML = `<button class="btn btn-success pl-4 pr-4 l-u-button" name="l-u-button" data-button-id="${data.id}">List</button>`;
        }

        const modal = document.getElementById('product-confirmation-modal');
        modal.style.display = 'none';

    }catch(error){
        console.log(error.message);
    }


}

// ** List Unlist Modal display None 
function listModalDisplayHidden(){
    const modal = document.getElementById('product-confirmation-modal');
    modal.style.display = 'none';
}
























function buttonWorkSearch(){
    const imageFile = [];
        document.getElementById('table-product').addEventListener('click',function(event) {
            const target = event.target;
            
            if(target.tagName == 'A' && target.classList.contains('product-viewmore')){
                viewMore(target)

            }else if(target.tagName == 'BUTTON' && target.classList.contains('l-u-button')){
                productStatus(target);

            }else if(target.tagName == 'BUTTON' && target.classList.contains('product-edit-button')){
                loadEditProductPage(target,imageFile);
                

            }

        /*---------------------------------------View More Data End------------------------------------------------*/



        })


        /* --------------------------------------------Back Button for View More Data------------------------------------------------- */
        document.getElementById('product-cancel').addEventListener('click',()=>{
            const modal_div = document.getElementById('modal-total-div');
            modal_div.style.display = "none";
        })



        /*------------------------------------------Sucess Button for list unllist Product------------------------------------------- */
        document.getElementById('list-confirmation-sucess').addEventListener('click',()=>{
            productStatusSucess();
        })



        /*------------------------------------------ 2 Back Button for confiramation modal-------------------------------------------- */
        document.getElementById('list-confirmation-cancel1').addEventListener('click',()=>{
            listModalDisplayHidden()
        })
        document.getElementById('list-confirmation-cancel2').addEventListener('click',()=>{
            listModalDisplayHidden()
        })
}