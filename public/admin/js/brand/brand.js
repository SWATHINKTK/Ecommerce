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


//*** Function For Brand Edit.Brand Logo will View on a Div The Input Field Change Image Change ***
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

function brandStatusUpdate(value){
    console.log(value)
}



/*------------------------ Image view On Change The Input Section------------------------- */
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


/*-------------------------------------Add Brand Data To Data Base---------------------------------- */
document.getElementById('addBrandForm').addEventListener('submit',async(event)=>{
    event.preventDefault();

    try{

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

        }else{
            
            result.setAttribute('class','alert alert-danger');
            result.innerHTML = data.message;
        }

    }catch(error){

        console.log(error.message);
    }

})


function formReset(id){
    const form = document.getElementById(`${id}`);
    form.reset();
}