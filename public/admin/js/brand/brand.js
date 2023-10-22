//*** Image view On Change The Input Section ***
let imageFile;
document.getElementById('brandImage').addEventListener('change',(event) => {
    const image = event.target;
    const imgTag = document.getElementById('brand-img-view');
    const file = image.files[0];

    //*** Assign image file for submission ***
    imageFile = file;

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
});



document.getElementById('addBrandForm').addEventListener('submit',async(event)=>{
    event.preventDefault();

    //*** Creating a FormData Object
    const form = document.getElementById('addBrandForm');
    const formData = new FormData(form);

    const url = '/admin/addbrand';
    const config = {
        method: 'POST',
        body: formData
    }
    const response = await fetch(url,config);

    const data = await response.json();

    alert(data.message  )

    

})