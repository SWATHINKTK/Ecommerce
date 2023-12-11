
// ************  SIGNUP PAGE VALIDATION - VALIDATION SUCESSFUL AFTER GO FOR OTP PAGE ****

function validateRegister(){

      const errorElements = document.querySelectorAll('span[name="validate-signup"]');

      userErrorElementReset('validate-signup');

      let username = document.getElementById('Username').value;
      let email = document.getElementById('email').value;
      let phone = document.getElementById('phonenumber').value;
      let password = document.getElementById('password').value;
      let confirmpassword = document.getElementById('confirmPassword').value;


      
      let emailRegex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      let phoneRegex=/^[6789]\d{9}$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;


      let is_Valid = true;
            

      if(username.trim() == ''){
            
            errorElements[0].style.display = 'block';
            errorElements[0].innerHTML = '* enter the username';
            is_Valid = false;

      } 
      if(email.trim() == ''){

            errorElements[1].style.display = 'block';
            errorElements[1].innerHTML = '* enter the email';
            is_Valid = false;

      }
      if(!emailRegex.test(email)){
            
            errorElements[1].style.display = 'block';
            errorElements[1].innerHTML = '*Enter proper format';
            is_Valid = false;

      }
      if(phone.trim() == ''){

            errorElements[2].style.display = 'block';
            errorElements[2].innerHTML = '* enter the phonenumber';
            is_Valid = false;

      }
      if(!phoneRegex.test(phone)){
            
            errorElements[2].style.display = 'block';
            errorElements[2].innerHTML= '*Enter proper format';
            is_Valid = false;

      }
      if(password.trim() == ''){
            
            errorElements[3].style.display = 'block';
            errorElements[3].innerHTML = '* enter the password';
            is_Valid = false;

      }
      if(!passwordRegex.test(password)){
            
            errorElements[3].style.display = 'block';
            errorElements[3].innerHTML = '* include digit,capital and small letters';
            is_Valid = false;

      }
      if(password.length < 6){
           
            errorElements[3].style.display = 'block';
            errorElements[3].innerHTML = '* password must be 6 digit';
            is_Valid = false;
      }
      if(confirmpassword.trim() == ''){
            
            errorElements[4].style.display = 'block';
            errorElements[4].innerHTML = '* enter the confirm password';
            is_Valid = false;

      }
      if(password != confirmpassword){

            errorElements[4].style.display = 'block';
            errorElements[4].innerHTML = '* password & confirm password must be same';
            is_Valid = false;
      }

      if(!is_Valid){
            return false;
      }else{
            return true;
      }
    
}






// ******** lOGIN / SIGN IN PAGE VALIDATE. VALIDATE AFTER SUBMISSION WORK *****

function validateSignin(){

      const errorElements = document.querySelectorAll('span[name="validate-signin"]');

      const username = document.getElementById('sign-in-username').value;
      const password = document.getElementById('sign-in-password').value;

      let emailRegex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      userErrorElementReset('validate-signin');

      let is_Valid = true;

      if(username.trim() == ''){

            errorElements[0].style.display = 'block';
            errorElements[0].innerHTML = '* enter the username ';
            is_Valid = false;

      }
      if(!emailRegex.test(username)){

            errorElements[0].style.display = 'block';
            errorElements[0].innerHTML = '* enter proper email';
            is_Valid = false;

      }
      if(password.trim() == ''){

            errorElements[1].style.display = 'block';
            errorElements[1].innerHTML = '* enter the password';
            is_Valid = false;

      }else if(password.length < 4){

            errorElements[1].style.display = 'block';
            errorElements[1].innerHTML = '* password must be for digit';
            is_Valid = false;

      }
      
      if(!is_Valid){
            return false;
      }else{
            return true;
      }

}




// **** EVERY CHECK ERROR VIEW ELEMENT WILL UPDATED TO BLANK ******

function userErrorElementReset(name){

      const errorElements = document.querySelectorAll(`span[name="${name}"]`);
      
      errorElements.forEach((val,i) => {
            val.style.display = 'none';
            val.innerHTML = '';
      })
}


