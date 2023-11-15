const addAmountDivShowBtn = document.getElementById('AddAmount-DivBtn');
let walletAddAmountBtnStatus = false;
addAmountDivShowBtn.addEventListener('click',(event) => {
    event.preventDefault();

    if(walletAddAmountBtnStatus){
        document.getElementById('AddAmountWallet-Div').style.display = 'none';
        walletAddAmountBtnStatus = false;
    }else{
        document.getElementById('AddAmountWallet-Div').style.display = 'block';
        walletAddAmountBtnStatus = true;
    }

})

const walletAmountAdd = document.getElementById('walletAmountAddBtn');

if(walletAmountAdd){
    walletAmountAdd.addEventListener('click', async (event) => {
        event.preventDefault();

        const walletAmount = document.getElementById('walletAmountEnter').value;

        const walletValidate = document.getElementById('walletValidate');

        const currentAmount = walletValidate.getAttribute('data-wallet-Amount');


        walletValidate.innerHTML = '';

        if(walletAmount > 15000){

            walletValidate.innerHTML = '* at a time only 15000 add To Wallet';

        }else if((currentAmount + walletAmount) > 50000){
            
            walletValidate.innerHTML = '* wallet keep only 50000 Rs';

        }else if(walletAmount <= 0){

            walletValidate.innerHTML = '* add wallet atleast 1 rupees';

        }else if(walletAmount.trim() == ''){

            walletValidate.innerHTML = '* enter amount';

        }else{

            const url = '/walletAmount'

            const requestOptions = {
                method:'POST',
                body:JSON.stringify({
                    amount:walletAmount
                }),
                headers:{'Content-Type':'application/json'}
            }

            const response = await fetch(url,requestOptions);

            const responseData = await response.json();

            if(responseData.sucess){
                walletRazorpay(responseData.data);
            }
        }

        
    })
}




function walletRazorpay(data){
    var options = {
        "key": "rzp_test_ydy5yr6ieKyEj4", // Enter the Key ID generated from the Dashboard
        "amount":data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Male Fashion",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){

           walletPaymentSucess(response,data)

        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
//     rzp1.on('payment.failed', function (response){
//         alert(response.error.code);
//         alert(response.error.description);
//         alert(response.error.source);
//         alert(response.error.step);
//         alert(response.error.reason);
//         alert(response.error.metadata.order_id);
//         alert(response.error.metadata.payment_id);
// });
    rzp1.open();
}


async function walletPaymentSucess(response,data){

    const url = '/walletPaymentVerify';
    const requestOption = {
        method:'POST',
        body:JSON.stringify({
            walletReceipt:data,
            Payment:response
        }),
        headers:{'Content-Type':'application/json'}
    }

    const paymentResponse = await fetch(url,requestOption);

    const paymentResponseData = await paymentResponse.json();

    if(paymentResponseData.sucess){
        window.location.href = '/viewWallet';
    }else{

       const failed = document.getElementById('walletPaymentFailed');
       failed.innerHTML = "Wallet Amount Adding Failed";

       setTimeout(() => {
            failed.innerHTML = "";
       }, 2000);
    }
}