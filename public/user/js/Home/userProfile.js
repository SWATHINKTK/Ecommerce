function editUserDetails(){
    const username = document.getElementById('userprofile-username');
    username.removeAttribute('disabled');

    const phonenumber = document.getElementById('userprofile-phonenumber');
    phonenumber.removeAttribute('disabled');

    const editinformation = document.getElementById('userprofile-edit');
    editinformation.style.display = 'none';

    const resetPasswordLink = document.getElementById('reset-password-link');
    resetPasswordLink.style.display = 'none';

    const resetPasswodDiv = document.getElementById('reset-password-div');
    resetPasswodDiv.style.display = 'none'

    const submit = document.getElementById('editinfomation-submit');
    submit.style.display = 'block';

    const cancelButton = document.getElementById('editInformation-Cancel');
    cancelButton.style.display = 'block';

}

const editinfomation = document.getElementById('editinfomation-submit');
if(editinfomation){
document.getElementById('editinfomation-submit').addEventListener('click',async function(event){
    event.preventDefault();

    const id = event.target.getAttribute('data-user-id');

    const username = document.getElementById('userprofile-username').value;
    const phonenumber = document.getElementById('userprofile-phonenumber').value;

    const phonenumberRgex = /^[789]\d{9}$/;

    const status = document.querySelectorAll("span[name='userinfo-hint']");
    console.log(status)

    status[1].innerHTML = '';
    status[0].innerHTML = '';


    if(username.trim() == ''){

        status[0].innerHTML = ' * enter username';

    }else if(!phonenumberRgex.test(phonenumber)){

        status[1].innerHTML = ' * enter proper number'

    }else{

        const jsonData = JSON.stringify({
            name:username,
            number:phonenumber,
            id:id
        });
        
        const response = await fetch('/edituserinformation',{
            method: 'POST',
            body:jsonData,
            headers:{'Content-Type':'application/json'}
        });

        if(!response.ok){
            window.location.href = '/error500'
        }

        const data = await response.json();

        

        if(data.status){

            const inputname = document.getElementById('userprofile-username');
            const phonenumberField = document.getElementById('userprofile-phonenumber');

            const result = document.getElementById('userupdate-result');
            result.style.display = 'block';
            result.innerHTML = "&#9989; Succesfully Updated";

            inputname.value = data.updateData.username;
            phonenumberField.value = data.updateData.phonenumber;

            inputname.setAttribute('disabled','disabled');
            phonenumberField.setAttribute('disabled','disabled');

            const editinformation = document.getElementById('userprofile-edit');
            editinformation.style.display = 'block';

            const submit = document.getElementById('editinfomation-submit');
            submit.style.display = 'none';

           setTimeout(() => {
            result.style.display = 'none';
           }, 2000);
        
        }

    }
    
})
}


function cancelEditOperation(button){
    window.location.reload();
}



const resetPasswodDiv = document.getElementById('reset-password-link');
if(resetPasswodDiv){
    resetPasswodDiv.addEventListener('click',(event)=>{
        event.preventDefault();
        
        const resetDiv = document.getElementById('reset-password-div');
        resetDiv.style.display = 'block';
    })
}

function cancelResetOperation(){

    window.location.reload();
    window.scroll(0,0);
   
    // const resetDiv = document.getElementById('reset-password-div');
    // resetDiv.style.display = 'none';
}


// RESET PASSWORD
async function submitResetPassword(){
    const currentPassword = document.getElementById('currentPassword-reset').value;
    const newPassword = document.getElementById('newPassword-reset').value;
    const confirmPassword = document.getElementById('confirmPassword-reset').value;

    const errorElements = document.querySelectorAll('span[name="resetPassword-error"]');
    // console.log(errorElements)

    const resetPasswordResult = document.getElementById('resetPassword-result');

    errorElements[0].innerHTML = '';
    errorElements[1].innerHTML = '';
    errorElements[2].innerHTML = '';
    
    if(currentPassword.trim() == ''){

        errorElements[0].innerHTML = '* enter the current password';

    }else if(currentPassword.length < 3){

        errorElements[0].innerHTML = '* password must be have 4 digits';
    }
    
    if(newPassword.trim() == ''){

        errorElements[1].innerHTML = '* enter the new password';

    }else if(newPassword.length < 3){

        errorElements[1].innerHTML = '* password must be have 4 digits';
    }

    if(confirmPassword.trim() == ''){

        errorElements[2].innerHTML = '* enter the confirm password';

    }else if(confirmPassword.length < 3){

        errorElements[2].innerHTML = '* password must be have 4 digits';

    }else if(confirmPassword != newPassword){

        errorElements[2].innerHTML = '* new password and confirm password must be same';

    }else{
        const url = '/editPassword';

        const requestOption = {
            method:'POST',
            body:JSON.stringify({
                currentPassword:currentPassword,
                newPassword:newPassword,
            }),
            headers:{'Content-Type':'application/json'}
        }

        const response = await fetch(url,requestOption);

        const responseData = await response.json();

        if(responseData.status){

            resetPasswordResult.style.display = 'block';
            resetPasswordResult.setAttribute('class','text-success font-weight-bold  mb-4');
            resetPasswordResult.innerHTML = "&#9989; Succesfully Updated";

            setTimeout(() => {
                const resetDiv = document.getElementById('reset-password-div');
                resetDiv.style.display = 'none';
                window.scroll(0,0);
            }, 2500);

        }else{

            resetPasswordResult.style.display = 'block';
            resetPasswordResult.setAttribute('class','text-danger font-weight-bold  mb-4');
            resetPasswordResult.innerHTML = "&#10060; Your Password is incorrect ";
        }
        setTimeout(() => {
            resetPasswordResult.innerHTML = '';
        }, 2500);
    }

}




function referalLink() {
    // Get the text field
    var copyText = document.getElementById("myInput");
  
    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
  
    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
    
    // Alert the copied text
    Swal.fire({
        position:'top',
        html: `<h5 class="font-weight-bold"> Share the Link Earn Money </h5>
                <p class="font-weight-bold">Link is Already copied to Your Clipboard</p>
                <p class="text-primary">${copyText.value}</p>`,
        showConfirmButton: false, 
        timer: 3500,
    });
    // alert("Copied the text: " + copyText.value);
  }