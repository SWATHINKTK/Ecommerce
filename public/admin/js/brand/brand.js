//************** Edit Form Data ***********
async function editBrandData(value){

    try{

        const id = value.getAttribute('name');
        const contentPlaceholder = document.getElementById("dynamic_page");
        

        const url = `/admin/editbrand${id}`
        const response = await fetch(url);

        if(!response.ok){
            Window.location.href = '/admin/error500';
        }

        const data = await response.text();

        contentPlaceholder.innerHTML = data;

        

        //*** Title Name Setting ***
        const title = document.querySelector('title');
        title.innerHTML = 'Edit Brand';
        

        //*** Edit Image View ***
        document.getElementById('editBrandImage').addEventListener('change',(event)=>{
           editImageViewInDiv(event);
        });


        //*** Form Submit in Edit Brand Details ***
        document.getElementById('editBrandForm').addEventListener('submit',(event) => {
            event.preventDefault();

            //*** Calling a Fuction For Submiting Data.Fuction is Written Below ***
            submitEditBrandData();

        }) ;
        
    }catch(error){
        console.log(error.message);
    }
}



//******** Function For Brand Edit.Brand Logo will View on a Div The Input Field Change Image Change *******
function editImageViewInDiv(event){
    const image = event.target;
    const imageViewDiv = document.getElementById('edit-brand-img-view');
    const file = image.files[0];
    if(file){
         
        const reader = new FileReader();

        reader.onload = function(e) {
            imageViewDiv.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}


//*** Edit Form Submit Data ***
async function submitEditBrandData(){
    try{
        const form = document.getElementById('editBrandForm');
        const formData = new FormData(form);


        const result = document.getElementById("edit-brand-submit-result");
        result.style.display = 'block';
        
        const url = '/admin/editbrand';
        const config = {
            method: 'POST',
            body: formData
        }

        const response = await fetch(url,config);

        if(!response.ok){
            window.location.href = '/admin/error500';
        }

        const data = await response.json();

        if (data.status) {

            result.setAttribute('class','alert alert-success');
            result.innerHTML = data.message;
            document.getElementById("editBrandForm").reset();

        }else{
            
            result.setAttribute('class','alert alert-danger');
            result.innerHTML = data.message;
        }

        setTimeout(()=>{
            result.style.display = 'none';
        },2000);

    }catch(error){
        console.log(error.message);
    }
}





/*======================= Add Brand Image view On Change The Input Section ==============================*/
function imageView(event){
    const image = event;
    const imgTag = document.getElementById('brand-img-view');
    const file = image.files[0];


    if(file){

        const reader = new FileReader();

        reader.onload = function(e) {
            imgTag.src = e.target.result;
        }

        reader.readAsDataURL(file);
        imgTag.style.display = 'block';

    }else{
        imgTag.style.display = 'none';
        imgTag.src = '';
    }
}



/*==================================== Add Brand Data To Data Base ====================================*/
document.getElementById('addBrandForm').addEventListener('submit',async(event)=>{
    event.preventDefault();

    try{

        const brandName = document.getElementById('brandname').value;
        const image = document.getElementById('brandImage');
        let validate = document.querySelectorAll('p[name="validate-brand"]');

        if(brandName.trim() === ''){

            validate[0].innerHTML = '* enter Brand name';

        }else if(image.files.length == 0){

            validate[0].innerHTML = '';
            validate[1].innerHTML = '* upload image';
            
        }else{

        

            //*** Creating a FormData Object ***
            const form = document.getElementById('addBrandForm');
            const formData = new FormData(form);

            //*** Result Printing in the request
            const result = document.getElementById("brand-submit-result");
            result.style.display = 'block';

            const url = '/admin/addbrand';
            const config = {
                method: 'POST',
                body: formData
            }
            const response = await fetch(url,config);

            if(!response.ok){

                window.location.href = '/admin/error500'
                
            }

            const data = await response.json();

            if (data.status) {

                result.setAttribute('class','alert alert-success');
                result.innerHTML = data.message;
                document.getElementById("addBrandForm").reset();
                document.getElementById('brand-img-view').style.display = 'none';

            }else{
                
                result.setAttribute('class','alert alert-danger');
                result.innerHTML = data.message;
            }

            setTimeout(()=>{

                result.style.display = 'none';

            },2000)
        }

    }catch(error){

        console.log(error.message);
    }

})




//*** Cancel Button To Reset Form ***
function formReset(id){
    const form = document.getElementById(`${id}`);
    form.reset();
}




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