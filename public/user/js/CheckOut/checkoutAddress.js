
// **** NEW ADDRESS ADDING FORM SUBMIT ****
const add = document.getElementById('newAddressAdding') ? true : false;
if(add){
document.getElementById('newAddressAdding').addEventListener('submit',async(event)=>{
    event.preventDefault();
    
    const form = document.getElementById('newAddressAdding');
    const formData = new FormData(form);
    

    // *** FormData Convert To Normal Object ***
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }

    if(validateAddress(data)){

        const result = document.getElementById('add-new-address-sucess');

        const url = `/addnewaddress`;

        const jsonData = JSON.stringify(data);
       

        const config = {
            method: 'POST',
            body:jsonData,
            headers:{'Content-Type':'application/json'}
        }
        
        const response = await fetch(url,config);

        if(!response.ok){
            Window.Location.href = '/error500'
        }

        const message = await response.json();

    
        const middlePosition = Math.ceil(document.body.scrollHeight / 6);


        if(message.status){

            window.scrollTo({
                top: middlePosition,
                behavior: 'smooth' // You can use 'auto' for instant scrolling
              });

            result.style.display = 'block';
            result.classList.add('alert-success');
            
            form.reset();
            result.innerHTML = `&#9989; ${message.data}`;
            

        }else{
            
            window.scrollTo({
                top: middlePosition,
                behavior: 'smooth' // You can use 'auto' for instant scrolling
              });

            result.style.display = 'block';
            result.classList.add('alert-danger');
            
            result.innerHTML = `&#10071; ${message.data}`;
        }


        setTimeout(() => {
            result.style.display = 'none'; 
        }, 2200);
    }
})

}