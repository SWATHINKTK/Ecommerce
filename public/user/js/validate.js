function validateRegister(){
      let username = document.getElementById('Username').value;
      let email = document.getElementById('email').value;
      let phone = document.getElementById('phonenumber').value;
      let password = document.getElementById('password').value;
      let confirmpassword = document.getElementById('confirmPassword').value;

      let username_hint = document.getElementById('username-hint');
      let email_hint = document.getElementById('email-hint');
      let phone_hint = document.getElementById('phone-hint');
      let password_hint = document.getElementById('password-hint');
      let confirmPassword_hint = document.getElementById('confirmPassword-hint');

      let emailRegex= /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]{2,4}$/;
      let phoneRegex=/^[0-9]{10}$/;

      let is_valid = true;

            

      if(username.trim() == ''){
            username_hint.innerHTML = '*Enter this field';
            email_hint.innerHTML = '';
            phone_hint.innerHTML = '';
            password_hint.innerHTML = '';
            confirmPassword_hint.innerHTML = "";
            return false;
      }
      if(phone.trim() == ''){
            phone_hint.innerHTML = '*Enter this field';
            username_hint.innerHTML = '';
            email_hint.innerHTML = '';
            password_hint.innerHTML = '';
            confirmPassword_hint.innerHTML = "";
            return false;
      }
      if(email.trim() == ''){
            
            username_hint.innerHTML = '';
            phone_hint.innerHTML = '';
            password_hint.innerHTML = '';
            confirmPassword_hint.innerHTML = "";
            email_hint.innerHTML = '*Enter this field';
            return false;

      }
      if(emailRegex.test(email)){
            
            username_hint.innerHTML = '';
            phone_hint.innerHTML = '';
            password_hint.innerHTML = '';
            confirmPassword_hint.innerHTML = "";
            email_hint.innerHTML = '*Enter proper format';
            return false;

      }
      if(phoneRegex.test(phone)){
            
            username_hint.innerHTML = '';
            email_hint.innerHTML = '';
            password_hint.innerHTML = '';
            confirmPassword_hint.innerHTML = "";
            phone_hint.innerHTML = '*Enter proper format';
            return false;

      }
      if(password.trim() == ''){
            password_hint.innerHTML = '*Enter this field';       
            username_hint.innerHTML = '';
            email_hint.innerHTML = '';
            password_hint.innerHTML = '';
            confirmPassword_hint.innerHTML = "";
            return false;

      }
      if(password.length < 4){
            password_hint.innerHTML = '*musthave 5 digits';    
            username_hint.innerHTML = '';
            email_hint.innerHTML = '';
            phone_hint.innerHTML = '';
            confirmPassword_hint.innerHTML = "";
            return false;

      }
      if(confirmpassword == password){
            confirmPassword_hint.innerHTML = "*Password Must have same";           
            username_hint.innerHTML = '';
            email_hint.innerHTML = '';
            phone_hint.innerHTML = '';
            password_hint.innerHTML = '';

            return false;
      }
      return true;
}
