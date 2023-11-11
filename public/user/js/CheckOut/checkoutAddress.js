let address = true;
// ***** ADDING NEW ADDRESS FORM VIEW *****
const addNewAddress = document.getElementById('checkout-AddNewAddress');
addNewAddress.addEventListener('click',() => {

    const addressDiv = document.getElementById('checkout-addAddressForm');
    const editAddressDiv = document.getElementById('checkout-editAddressForm');
    editAddressDiv.style.display = 'none';
    if(address){
        addressDiv.style.display = 'block';
        address = false;
    }else{
        addressDiv.style.display = 'none';
        address = true;
    }
});





// **** NEW ADDRESS ADDING FORM CHECKOUT PAGE****
document.addEventListener('DOMContentLoaded',()=>{

    
    document.getElementById('newAddressAddingCheckout').addEventListener('submit',async(event)=>{
        event.preventDefault();
        
        const form = document.getElementById('newAddressAddingCheckout');
        const formData = new FormData(form);
        

        // *** FormData Convert To Normal Object ***
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        if(validateCheckoutAddress(data)){

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
                window.location.reload();
            }, 2200);
        }
    })

})







// ***** EDIT THE EXISTNG ADDRESS IN CHECKOUT PAGE *****
const editCheckoutAddress = document.querySelectorAll('a[name="editCheckoutAddress"]');
if(editCheckoutAddress){

    editCheckoutAddress.forEach((edit)=>{

        edit.addEventListener('click',async(event)=>{
            event.preventDefault();

            const id = event.target.getAttribute('data-addressId');
            const url = `/editaddress${id}?url=true`;

            const response = await fetch(url);

            const responseData = await response.text();
            console.log(responseData)

            const addressDiv = document.getElementById('checkout-editAddressForm');
            addressDiv.style.display = 'block';

            const middlePosition = Math.ceil(document.body.scrollHeight / 2.6);
            window.scrollTo({
                top: middlePosition,
                behavior: 'smooth' // You can use 'auto' for instant scrolling
            });
            
            addressDiv.innerHTML = responseData;

            document.getElementById('editCheckoutAddress').addEventListener('submit',async(event)=>{
                event.preventDefault();
               
                submitCheckoutEditAddress();
            })

            // const middlePosition = Math.ceil(document.body.scrollHeight / 2.6);
            // window.scrollTo({
            //     top: middlePosition,
            //     behavior: 'smooth' // You can use 'auto' for instant scrolling
            // });






            // *** ADDING NEW ADDRESS IN CHECKOUT PAGE FORM VALIDATION ***
            function validateCheckoutAddress(fromData){

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
                    const middlePosition = Math.ceil(document.body.scrollHeight / 2.6);
                    window.scrollTo({
                        top: middlePosition,
                        behavior: 'smooth' // You can use 'auto' for instant scrolling
                    });
                }
                return is_valid;

            }

            async function submitCheckoutEditAddress(){
                const form = document.getElementById('editCheckoutAddress');
                const formData = new FormData(form);

                // *** FormData Convert To Normal Object ***
                const data = {};
                for (const [key, value] of formData.entries()) {
                    data[key] = value;
                }

                if(validateCheckoutAddress(data)){

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

                            window.scrollTo({
                                top: middlePosition,
                                behavior: 'smooth' // You can use 'auto' for instant scrolling
                            });
                            
                            result.style.display = 'block';
                            result.classList.add('alert-success');
                            
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
                        window.location.reload();
                    }, 2200);
                }
            }




        })
    })
}




// *** ADDING NEW ADDRESS IN CHECKOUT PAGE FORM VALIDATION ***
function validateCheckoutAddress(fromData){

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
    
                errorElemetns[8].innerHTML = ' * number must be 10 digit. ';
                is_valid = false;
    
            }else{
    
                errorElemetns[8].innerHTML = ' * enter proper format.';
                is_valid = false;
    
            }
        }else if(data.AlteranteNumber == data.MobileNumber){
            
            errorElemetns[8].innerHTML = ' * enter the different number.';
            is_valid = false;
        }
    }
    if(!is_valid){
        const middlePosition = Math.ceil(document.body.scrollHeight / 2.6);
        window.scrollTo({
            top: middlePosition,
            behavior: 'smooth' // You can use 'auto' for instant scrolling
          });
    }
    return is_valid;

}