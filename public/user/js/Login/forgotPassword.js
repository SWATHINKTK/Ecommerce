
// FORGOT PASSWORD EMAIL SEND TO THE SERVER
const forgotPassword = document.getElementById('forgotPasswordForm');

if(forgotPassword){
    forgotPassword.addEventListener('submit',async(event) => {
        event.preventDefault();

        const forgotEmail = document.getElementById('fogotEmailAddress').value;

        const validate = document.getElementById('validate-forgotpassword');


        let emailRegex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        let is_Valid = true;

        validate.style.display = 'none';

        if(forgotEmail.trim() == ''){

            validate.style.display = 'block';
            validate.innerHTML = '* enter the username ';
            is_Valid = false;

        }
        if(!emailRegex.test(forgotEmail)){

            validate.style.display = 'block';
            validate.innerHTML = '* enter proper email';
            is_Valid = false;

        }

        if(!is_Valid){
            return;
        }else{

            const url = '/forgotPassword';

            const options = {
                method:'POST',
                body:JSON.stringify({
                    email:forgotEmail
                }),
                headers: { "Content-Type": "application/json" }
            }

            const response = await fetch(url, options);

                if(!response.ok){
                    window.location.href = '/error500';
                }
            
            const responseData = await response.json();

            if(responseData.success){

                Swal.fire({
                    position:'bottom',
                    html: `<i class="fa-solid fa-circle-check" style="color: #2dd26c;"></i> ${responseData.message}. `,
                    showConfirmButton: false, 
                    timer: 2100,
                })
                document.getElementById('forgotPasswordForm').reset();

                setTimeout(()=>{
                    window.location.href = '/login';
                },2100)

            }else{

                Swal.fire({
                    position:'bottom',
                    html: `<span class="font-weight-bold"><i class="fa-solid fa-ban text-danger"></i> ${responseData.message}. </span>`,
                    showConfirmButton: false, 
                    timer: 2200,
                })

            }
        }
    })
}




// PASSWORD RESET AND CREATE NEW PASSWORD
const resetPassword = document.getElementById('passwordChange');

if(resetPassword){

    resetPassword.addEventListener('submit', async(event) => {
        event.preventDefault();

        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        const errorElements = document.querySelectorAll('span[name="validate-forgotpassword"]');


        let is_Valid = true;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        errorElements[0].style.display = 'none';
        errorElements[1].style.display = 'none';

        if(newPassword.trim() == ''){
            
            errorElements[0].style.display = 'block';
            errorElements[0].innerHTML = '* enter the password';
            is_Valid = false;

        }else if(!passwordRegex.test(newPassword)){

            errorElements[0].style.display = 'block';
            errorElements[0].innerHTML = '* password must occur atleast one capital letter ,small letter and one digit.';
            is_Valid = false;

        }else if(newPassword.length < 6){
            
            errorElements[0].style.display = 'block';
            errorElements[0].innerHTML = '* password must be 6 digit';
            is_Valid = false;
        }

        if(confirmPassword.trim() == ''){
                
                errorElements[1].style.display = 'block';
                errorElements[1].innerHTML = '* enter the confirm password';
                is_Valid = false;

        }else if(newPassword != confirmPassword){

                errorElements[1].style.display = 'block';
                errorElements[1].innerHTML = '* password & confirm password must be same';
                is_Valid = false;
        }

        if(!is_Valid){

            return;

        }else{

            const token = document.getElementById('token').value;

            const url = `/resetPassword?id=${token}`;

            const options = {
                method:'POST',
                body:JSON.stringify({
                    newPassword:newPassword,
                    confirmPassword:confirmPassword
                }),
                headers: { "Content-Type": "application/json" }
            }

            const response = await fetch(url, options);

                if(!response.ok){
                    window.location.href = '/error500';
                }
            
            const responseData = await response.json();

            if(responseData.success){

                Swal.fire({
                    position:'bottom',
                    html: `<i class="fa-solid fa-circle-check" style="color: #2dd26c;"></i> ${responseData.message}. `,
                    showConfirmButton: false, 
                    timer: 2100,
                })
                document.getElementById('passwordChange').reset();

                setTimeout(()=>{
                    window.location.href = '/login';
                },2100)

            }else{

                Swal.fire({
                    position:'bottom',
                    html: `<i class="fa-solid fa-circle-check" style="color: #2dd26c;"></i> ${responseData.message}. `,
                    showConfirmButton: false, 
                    timer: 2100,
                });
            }
        }
    })

}