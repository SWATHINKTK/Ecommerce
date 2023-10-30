function editUserDetails(){
    const username = document.getElementById('userprofile-username');
    username.removeAttribute('disabled');

    const phonenumber = document.getElementById('userprofile-phonenumber');
    phonenumber.removeAttribute('disabled');

    const editinformation = document.getElementById('userprofile-edit');
    editinformation.style.display = 'none';

    const submit = document.getElementById('editinfomation-submit');
    submit.style.display = 'block';

}

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
