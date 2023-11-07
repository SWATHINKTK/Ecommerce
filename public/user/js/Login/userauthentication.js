/* ************** SIGNUP CONTAINER & SINGIN CONTAINER WORKING ANIMATION ANIMATION WORKING USE **************** */

let container = document.getElementById("container");

  toggle = () => {
    container.classList.toggle("sign-in");
    container.classList.toggle("sign-up");
  };

  setTimeout(() => {
    container.classList.add("sign-in");
  }, 200);



// *** MESSAGE OF THE SIGN PAGE HAVE EXIST EMAIL USED LIKE MESSAGE COME FROM REGISTER PAGE ***  

  setTimeout(()=>{
    document.getElementById('verification-Result').innerHTML = '';
  },3000)








/* ******** LOGIN (SIGN IN) FORM SUBMISSION ********* */

document.addEventListener("DOMContentLoaded", function () {
    // **** FORM LOGIN VALIDATE & SUBMIT IN THIS LISTENER ****
    const signinForm = document.getElementById("signinForm");

    signinForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // **** CHECK VALIDATION ****
        if (validateSignin()) {
            // **** SIGIN FORM SUBMISSION START ***
            try {
                const alert = document.getElementById("signin-alert");
                

                const username = document.getElementById("sign-in-username").value;
                const password = document.getElementById("sign-in-password").value;

                const url = "/signin";

                const config = {
                    method: "POST",
                    body: JSON.stringify({
                        username: `${username}`,
                        password: `${password}`,
                    }),
                    headers: { "Content-Type": "application/json" },
                };

                const response = await fetch(url, config);

                if (!response.ok) {
                    window.location.href = "/error500";
                }


                const data = await response.json();


                if (data.status) {
                    window.location.href = `/home`;
                } else {
                    alert.style.display = "block";
                    alert.innerHTML = data.message;
                }

                setTimeout(() => {
                    alert.style.display = "none";
                }, 2000);

            } catch (error) {
                console.log(error.message);
            }
        }
    });
});





/* ###################################  OTP VERIFICATION REGISTERING NEW USER ON OUR PAGE  ############################################# */



document.getElementById('verificationOTP').addEventListener('submit',(event)=>{
    event.preventDefault();

    const otpMessage = document.getElementById('otp-response-message');


    // const otp ={
    //     otp : document.getElementById('otp').value;
    // } 


    const jsonData = JSON.stringify({

        'otp':document.getElementById('otp').value

    })


    // ******* FETCH REQUEST TO SUBMIT OTP VERIFICATION PROCESS ******

    fetch('/otpverification', {
    method: 'POST',
    body: jsonData,
    headers :{'Content-Type':'application/json'}
    })

    .then(response =>  response.json())

    .then(data => {

        if(data.status){

            otpMessage.setAttribute('class','text-success');
            otpMessage.style.fontWeight = 600;
            otpMessage.innerHTML = data.message;
            document.getElementById('verificationOTP').reset();

            setTimeout(()=>{

                window.location.href = '/login';

            },2500)
            

        }else{

            otpMessage.setAttribute('class','text-danger')
            otpMessage.innerHTML = data.message;

        }


        setTimeout(()=>{

            otpMessage.innerHTML = '';

        },2500)
        
    })
    .catch((error) => {

        console.log();('Error:', error.message);

    });
})





// ##########################   OTP TIME COUNTER VIEW   ###########################

const data = document.getElementById('verify-heading')
const time = data.getAttribute('data-timer');


let second = 120;

// *** GET ATTRIBUTE TO RETRIVE OTP SEND TIME THEN INCREASE 120 SEC ****
let futureTimestampInSeconds = Math.floor(time / 1000) + 120;

function timer(){

    second--;
    document.getElementById('timer').innerText = second;

    let currentTimestampInSeconds = Math.floor(Date.now() / 1000);

    if (currentTimestampInSeconds >= futureTimestampInSeconds) {

        document.getElementById('timer').innerText = '';
        document.getElementById('resend').style.display = 'block';
        clearInterval(start);
        
    } 
}
const start = setInterval(timer,1000);
start();