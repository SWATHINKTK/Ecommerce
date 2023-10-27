document.addEventListener("DOMContentLoaded", function () {
      const signupForm = document.getElementById("signupForm");
  
      signupForm.addEventListener("submit", function (event) {
          event.preventDefault(); 
  
          if (validateRegister()) {
              signupForm.submit();
          }
      });

      const signinForm = document.getElementById('signinForm');
      
      signinForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            if(validateSignin()){

                  // signinForm.submit();
                  try {
                        const alert = document.getElementById('signin-alert');
                        

                        const username = document.getElementById('sign-in-username').value;
                        const password = document.getElementById('sign-in-password').value;

                        const url = '/signin';
      
                        const config = {
                              method: 'POST',
                              body:JSON.stringify({
                                    'username':`${username}`,
                                    'password':`${password}`
                              }),
                              headers: {'Content-Type': 'application/json',}
                        }
      
                        const response = await fetch(url,config);

                        if(!response.ok){
                              window.location.href = '/error500';
                        }
                        
                        const data = await response.json();
                        console.log(data)

                        if(data.status){

                              window.location.href = `/home?login=true`;
                             
                        }else{

                              alert.style.display = 'block';
                              alert.innerHTML = data.message;
                             
                        }

                        setTimeout(()=>{
                              alert.style.display = 'none';
                        },2000)

                  } catch (error) {
      
                        console.log(error.message);    
                  }
            }
      })
      

});




function validateRegister(){

      const errorElements = document.querySelectorAll('span[name="validate-signup"]');

      userErrorElementReset('validate-signup');

      let username = document.getElementById('Username').value;
      let email = document.getElementById('email').value;
      let phone = document.getElementById('phonenumber').value;
      let password = document.getElementById('password').value;
      let confirmpassword = document.getElementById('confirmPassword').value;

      
      let emailRegex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

      let phoneRegex=/^\d{10}$/;

      

            

      if(username.trim() == ''){
            
            errorElements[0].innerHTML = '* enter the username'
            return false;
      }else if(email.trim() == ''){

            errorElements[1].innerHTML = '* enter the email'
            return false;
      }else if(!emailRegex.test(email)){
               
            errorElements[1].innerHTML = '*Enter proper format';
            return false;

      }else if(phone.trim() == ''){

            errorElements[2].innerHTML = '* enter the phonenumber';
            return false;

      }else if(!phoneRegex.test(phone)){
            
            errorElements[2].innerHTML= '*Enter proper format';
            return false;

      }else if(password.trim() == ''){
            
            errorElements[3].innerHTML = '* enter the password'
            return false;

      }else if(password.length < 4){
           
            errorElements[3].innerHTML = '* password must be 4 digit'
            return false;

      }else if(confirmpassword.trim() == ''){
            
            errorElements[4].innerHTML = '* enter the confirm password'
            return false;

      }else if(password != confirmpassword){

            errorElements[4].innerHTML = '* password & confirm password must be same'
            return false;
      }else {

            return true;
      }
    
}






function validateSignin(){

      const errorElements = document.querySelectorAll('span[name="validate-signin"]');

      const username = document.getElementById('sign-in-username').value;
      const password = document.getElementById('sign-in-password').value;

      let emailRegex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      userErrorElementReset('validate-signin');

      if(username.trim() == ''){

            errorElements[0].innerHTML = '* enter the username ';
            return false;

      }else if(!emailRegex.test(username)){

            errorElements[0].innerHTML = '* enter proper email';
            return false;

      }else if(password.trim() == ''){

            errorElements[1].innerHTML = '* enter the password';
            return false;

      }else if(password.length < 4){

            errorElements[1].innerHTML = '* password must be for digit';
            return false;

      }else {
            
            return true;
      }

}




//**** Error Element Hiding ******
function userErrorElementReset(name){
      const errorElements = document.querySelectorAll(`span[name="${name}"]`);
      
      errorElements.forEach((val,i) => {
          val.innerHTML = '';
      })
}


