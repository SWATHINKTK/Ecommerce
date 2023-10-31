
// **** NEW ADDRESS ADDING FORM SUBMIT ****
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

        const url = `/addnewaddress/`;

        const config = {
            method:'POST',
            body:JSON.stringify(data),
            Headers:{'Content-Type':'application/json'}
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
    }
})

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

    }else if(!(data.Name.length >= 2 && data.Name.length <= 50)){

        errorElemetns[0].innerHTML = ' * name must be between 2 and 50 characters. ';
        is_valid = false;

    }else if(!nameRegex.test(data.Name)){

        errorElemetns[0].innerHTML = ' * character only allowed.';
        is_valid = false;

    }else if(data.MobileNumber.split() == ''){

        errorElemetns[1].innerHTML = ' * enter phonenumber.';
        is_valid = false;

    }else if(!numberRegex.test(data.MobileNumber)){

        if(data.MobileNumber.length != 10){

            errorElemetns[1].innerHTML = ' * number must be 10 digit. ';
            is_valid = false;

        }else{

            errorElemetns[1].innerHTML = ' * enter proper format.';
            is_valid = false;

        }

    }else if(!pincodeRegex.test(data.Pincode)){

        if(data.Pincode.length != 6){

            errorElemetns[2].innerHTML = ' *  must be enter 6 digit pincode. ';
            is_valid = false;

        }else{

            errorElemetns[2].innerHTML = ' * enter proper pincode format.';
            is_valid = false;

        }

    }else if(data.Locality.split() == ''){

        errorElemetns[3].innerHTML = ' * please fill out this field.';
        is_valid = false;

    }else if(data.Address.split() == ''){

        errorElemetns[4].innerHTML = ' * please fill out this field.';
        is_valid = false;

    }else if(data.City.split() == ''){

        errorElemetns[5].innerHTML = ' * please fill out this field.';
        is_valid = false;

    }else if(data.District.split() == ''){

        errorElemetns[6].innerHTML = ' * please select your district.';
        is_valid = false;

    }else if(data.AlteranteNumber.length > 0){

        if(!numberRegex.test(data.AlteranteNumber)){

            if(data.MobileNumber.length != 10){
    
                errorElemetns[1].innerHTML = ' * number must be 10 digit. ';
                is_valid = false;
    
            }else{
    
                errorElemetns[1].innerHTML = ' * enter proper format.';
                is_valid = false;
    
            }
        }
    }
    if(!is_valid){
        window.scrollTo(0, 0);
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