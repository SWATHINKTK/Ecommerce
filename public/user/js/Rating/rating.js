const ratingForm = document.getElementById('ratingForm');

if(ratingForm){
    ratingForm.addEventListener('submit',async(event) => {
        event.preventDefault();

        const feedback = document.getElementById('Feedback-text').value;
        const star = document.querySelectorAll("input[name='starRadio']");
        const productId = document.getElementById('productReview').value;
        const orderId = document.getElementById('orderReview').value;


        if(validateRating()){
            let selected = false;
            for(let input of star){
                if(input.checked){
                    selected = input.value;
                }
            }
            
            const url = "/api/review";

            const requestOptions = {
                method:'POST',
                body:JSON.stringify({
                    starRadio:selected,
                    feedback:feedback,
                    orderId:orderId,
                    productId:productId
                }),
                headers:{'Content-Type':'application/json'}
            }

            const response = await fetch(url, requestOptions);

                if(!response.ok){
                    window.location.href = '/error500';
                }
            
            const responseData = await response.json();

                if(responseData.success){
                    Swal.fire({
                        position:'bottom',
                        html: '<i class="fa-solid fa-circle-check" style="color: #2dd26c;"></i> Successfully Added Your Review.',
                        showConfirmButton: false, 
                        timer: 2500,
                    });
                }else{
                    Swal.fire({
                        position:'bottom',
                        html: '<i class="fa-solid fa-xmark" style="color: #eb0f0f;"></i> Adding Review Some Errors.',
                        showConfirmButton: false, 
                        timer: 2500,
                    })
                }
        }

        
    })
}



function validateRating(){

    const star = document.querySelectorAll("input[name='starRadio']");
    const feedback = document.getElementById('Feedback-text').value;

    const errorElements = document.querySelectorAll('p[name="Feedback-validation"]');

    let selected = false;
    for(let input of star){
        if(input.checked){
            selected = true;
        }
    }

    let is_Valid = true;

    if(feedback.trim() == ''){
        errorElements[1].innerHTML = 'enter your feedback';
        is_Valid = false
    }
    if(!selected){
        errorElements[0].innerHTML = 'please select a rating star';
        is_Valid = false
    }

    if(is_Valid){
        return true;
    }else{
        return false;
    }
    

}