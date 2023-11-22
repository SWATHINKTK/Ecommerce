
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




// ********* EDIT ADDRESS DATA AND SUBMIT ********
const edit = document.getElementById('editAddress') ? true : false;
if(edit){

document.getElementById('editAddress').addEventListener('submit',async(event)=>{
    event.preventDefault();
    
    const form = document.getElementById('editAddress');
    const formData = new FormData(form);

    // *** FormData Convert To Normal Object ***
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }

    if(validateAddress(data)){

        const result = document.getElementById('edit-new-address-sucess');

        const url = `/updateaddress`;

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

        if(message.status){

            window.scrollTo(0, 0);
            result.style.display = 'block';
            result.classList.add('alert-success');
            
            result.innerHTML = `&#9989; ${message.data}`;
            

        }else{

            window.scrollTo(0, 0);
            result.style.display = 'block';
            result.classList.add('alert-danger');
            
            result.innerHTML = `&#10071; ${message.data}`;
        }


        setTimeout(() => {
            result.style.display = 'none'; 
            window.location.href = '/addressinformation';
        }, 2200);
    }
})


}




// *** ADDING NEW ADDRESS FORM VALIDATION ***
function validateAddress(fromData){

    const data = fromData;

    const errorElemetns = document.querySelectorAll('span[name="address-validate-message"]');
    removeErrorElements();

    // *** REGEX FOR VALIDATION ***
    const nameRegex = /^[a-zA-Z\s]+$/;
    const numberRegex = /^[789]\d{9}$/;
    const pincodeRegex = /^\d{6}$/;


    let is_valid = true;
    

    if(data.Name.split() == ''){

        errorElemetns[0].innerHTML = ' * please fill out this field.';
        is_valid = false;

    }
    if(!(data.Name.length >= 2 && data.Name.length <= 50)){

        errorElemetns[0].innerHTML = ' * name must be between 2 and 50 characters. ';
        is_valid = false;

    }
    if(!nameRegex.test(data.Name)){

        errorElemetns[0].innerHTML = ' * character only allowed.';
        is_valid = false;

    }
    if(data.MobileNumber.split() == ''){

        errorElemetns[1].innerHTML = ' * enter phonenumber.';
        is_valid = false;

    }
    if(!numberRegex.test(data.MobileNumber)){

        if(data.MobileNumber.length != 10){

            errorElemetns[1].innerHTML = ' * number must be 10 digit. ';
            is_valid = false;

        }else{

            errorElemetns[1].innerHTML = ' * enter proper format.';
            is_valid = false;

        }

    }
    if(!pincodeRegex.test(data.Pincode)){

        if(data.Pincode.length != 6){

            errorElemetns[2].innerHTML = ' *  must be enter 6 digit pincode. ';
            is_valid = false;

        }else{

            errorElemetns[2].innerHTML = ' * enter proper pincode format.';
            is_valid = false;

        }

    }
    if(data.Locality.split() == ''){

        errorElemetns[3].innerHTML = ' * please fill out this field.';
        is_valid = false;

    }
    if(data.Address.split() == ''){

        errorElemetns[4].innerHTML = ' * please fill out this field.';
        is_valid = false;

    }
    if(data.City.split() == ''){

        errorElemetns[5].innerHTML = ' * please fill out this field.';
        is_valid = false;

    }
    if(data.District.split() == ''){

        errorElemetns[6].innerHTML = ' * please select your district.';
        is_valid = false;

    }
    if(data.AlteranteNumber.length > 0){

        if(!numberRegex.test(data.AlteranteNumber)){

            if(data.MobileNumber.length != 10){
    
                errorElemetns[8].innerHTML = ' * number must be 10 digit. ';
                is_valid = false;
    
            }else{
    
                errorElemetns[8].innerHTML = ' * enter proper format.';
                is_valid = false;
    
            }
        }else if(data.AlteranteNumber == data.MobileNumber){
            
            errorElemetns[8].innerHTML = ' *  enter the different number.';
            is_valid = false;
        }
    }
    if(!is_valid){
        const middlePosition = Math.ceil(document.body.scrollHeight / 6);
        window.scrollTo({
            top: middlePosition,
            behavior: 'smooth' // You can use 'auto' for instant scrolling
          });
    }
    return is_valid;

}



// **** REMOVING THE ERROR ELEMENTS IN THE FORM ****
function removeErrorElements(){

    const erroElemetns = document.querySelectorAll('span[name="address-validate-message"]');

    erroElemetns.forEach((val)=>{
        val.innerHTML = '';
    })
}




function removeModal(){
    document.getElementById('modalDelete').style.display = 'none';
}



function deleteAddress(tag){

    document.getElementById('modalDelete').style.display = 'block';
    const id = tag.getAttribute('data-addressId');
 
    const okButton = document.getElementById('deleteModalOk');
    okButton.setAttribute('data-address-id',`${id}`);
}



async function deleteAddressSucess(tag){

    const id = tag.getAttribute('data-address-id');
    const address = document.getElementById(`${id}`);
    
    const url = `/deleteaddress${id}`

    const requestOption = {
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const response = await fetch(url,requestOption);

    if(!response.ok){

        window.location.href = '/error500'
    }

    const data = await response.json();

    if(data.status){
        
        address.style.display = 'none';
        document.getElementById('modalDelete').style.display = 'none';
    }

}