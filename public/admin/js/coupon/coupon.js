function viewCouponListPage(){

    const contentPlaceholder = document.getElementById("dynamic_page");


    // View the Coupon Present in my appication in Table View
    fetch("/admin/couponlist")
    .then((response) => {

        if(response.status == 401){
            window.location.href = '/admin'
            return;
        }

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.text();
    })
    .then((html) => {
        // Update the content of the placeholder with the fetched HTML
        contentPlaceholder.innerHTML = html;

        document.querySelector('title').innerHTML = 'Coupons';

        viewCouponlistActions();
    })
    .catch((error) => {
        console.error("Fetch error:", error);
    });
}



function addCoupon(){

    // ADD COUPON FORM SUBMIT EVENTLISTENER
    document.getElementById('addCouponForm').addEventListener('submit', async(event) => {
        event.preventDefault();
        
        // SUBMITTED DATA RESULT PRINTING ALERT DIV
        const bannerResult = document.getElementById('coupon-submit-result');

        // DATA TAKEN THE ADD COUPON FORM
        const data = {
            couponName : document.getElementById('couponName').value,
            minimumPurchase : document.getElementById('minimumPurchase').value,
            OfferPercentage : document.getElementById('OfferPercentage').value,
            startDate : document.getElementById('startDate').value,
            endDate : document.getElementById('endDate').value,

        }
        
        // CHECKING THE VALIDATION IN ADD COUPON FORM
        if(couponValidate(data)){

            const url = '/admin/addCoupon'
            const requestOptions = {
                method : 'POST',
                body : JSON.stringify(data),
                headers : {'Content-Type':'application/json'}
            }

            // SENDING THE API REQUEST TO SERVER 
            const response = await fetch(url, requestOptions);
            
                    if(!response.ok){
                        window.location.href = '/admin/error500';
                    }
        
            const responseData = await response.json();

            // RESPOSE EQUALITY CONDITON CHECKING AND PROVIDE THE MESSAGE TO USER
            if(responseData.success){
                
                window.scroll(0,0);
                bannerResult.setAttribute('class','alert alert-success');
                bannerResult.innerHTML = 'Coupon Data Added Sucessful';

                setTimeout(() => {
                    document.getElementById('addCouponForm').reset();
                    bannerResult.style.display = 'none';
                }, 2000);

            }else{
                bannerResult.setAttribute('class','alert alert-danger');
                bannerResult.innerHTML = 'Coupon Added Failed Tryagain';
            }
            }
    })
}


// VALIDATING THE COUPON FORM
function couponValidate(data){

    const errorElemetns = document.querySelectorAll('p[name="validate-coupon"]');
  
    removeErrorElements();

    let is_valid = true;

    

    if(data.couponName.trim() == ''){

        errorElemetns[0].innerHTML = ' * please fill out coupon name.';
        is_valid = false;

    }
    if(data.minimumPurchase.trim() == ''){

        errorElemetns[1].innerHTML = ' * please fill out minimum purchase amount.';
        is_valid = false;

    }
    if(data.minimumPurchase < 1){

        errorElemetns[1].innerHTML = ' * please fill out minimum 1 rupee.';
        is_valid = false;

    }
    if(data.OfferPercentage.trim() == ''){

        errorElemetns[2].innerHTML = ' * please fill out offer percentage.';
        is_valid = false;

    } 
    if(data.OfferPercentage > 80 || data.OfferPercentage < 0){

        errorElemetns[2].innerHTML = ' * offer percentage must included (1-99)%.';
        is_valid = false;

    } 
    if(data.startDate.trim() == ''){

        errorElemetns[3].innerHTML = ' * please fill out coupon start date';
        is_valid = false;

    } 
    if(data.endDate.trim() == ''){

        errorElemetns[4].innerHTML = ' * please fill out coupon start date';
        is_valid = false;

    } 
    if(data.startDate > data.endDate){

        errorElemetns[3].innerHTML = ' * check our dates';
        errorElemetns[4].innerHTML = ' * check our dates';
        is_valid = false;

    } 
    return is_valid;
}




// **** REMOVING THE ERROR ELEMENTS IN THE FORM ****
function removeErrorElements(){

    const erroElemetns = document.querySelectorAll('p[name="validate-coupon"]');

    erroElemetns.forEach((val)=>{
        val.innerHTML = '';
    })
}


function viewCouponlistActions(){

    const editCouponBtn = document.querySelectorAll('button[name="editCouponBtn"]');
    
    editCouponBtn.forEach(button => {
        button.addEventListener('click',async(event) => {
            
            const couponId = event.target.getAttribute('data-coupon-id');

            const url = `/admin/editCoupon?couponId=${couponId}`;
            
            
            const response = await fetch(url);
                
                if(!response.ok){
                    window.location.href = '/admin/error500';
                }

            const responseData = await response.text();

            const contentPlaceholder = document.getElementById("dynamic_page");

            contentPlaceholder.innerHTML = responseData;

            editSubmitData();
        })

    })


    const deleteCouponBtn = document.querySelectorAll('button[name="deleteCouponBtn"]');
    
        deleteCouponBtn.forEach(button => {
            button.addEventListener('click',async(event) => {
                
                Swal.fire({
                    text: "Do you want to Delete the Coupon?",
                    icon: "warning",
                    // showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Delete",
                    denyButtonText: `Cancel`,
                    customClass: {
                        content: 'custom-swal-text-color'
                    }
                  }).then(async (result) => {
                
                        if (result.isConfirmed) { 

                            const couponId = event.target.getAttribute('data-coupon-id');

                            const url = '/admin/deleteCoupon';
                            const requestOptions = {
                                method:'DELETE',
                                body:JSON.stringify({
                                    couponId:couponId
                                }),
                                headers : {'Content-Type':'application/json'}
                            }
            
                            const response = await fetch(url,requestOptions);
            
                                if(!response.ok){
                                    window.location.href = '/admin/error500';
                                }
            
                            const responseData = await response.json();
            
                                if(responseData.success){
                                    // const row = document.getElementById(`${couponId}`);
                                    // row.parentNode.removeChild(row);
            
                                    // const serialNo = document.querySelectorAll('td[name="couponSerialNumber"]');
                                    // serialNo.forEach((td, i) => {
                                    //     td.innerHTML = i+1;
                                    // });
                                    Swal.fire({
                                        position:'bottom',
                                        html: '<span class="font-weight-bold"><i class="mdi mdi-check-all" style="color: #2dd26c;"></i> Deleted Successfully.</span>',
                                        showConfirmButton: false, 
                                        timer: 1800,
                                    });
                                    viewCouponListPage();
                                    // window.location.reload();
                                }
                        }
                  })
            })
        })

        
}



// EDIT COUPON FORM SUBMIT EVENTLISTENER
function editSubmitData(){


        document.getElementById('editCouponForm').addEventListener('submit', async(event) => {
            event.preventDefault();
            
            // SUBMITTED DATA RESULT PRINTING ALERT DIV
            const bannerResult = document.getElementById('coupon-submit-result');

            // DATA TAKEN THE ADD COUPON FORM
            const data = {
                couponId : document.getElementById('couponId').value,
                couponName : document.getElementById('couponName').value,
                minimumPurchase : document.getElementById('minimumPurchase').value,
                OfferPercentage : document.getElementById('OfferPercentage').value,
                startDate : document.getElementById('startDate').value,
                endDate : document.getElementById('endDate').value,

            }
            
            // CHECKING THE VALIDATION IN ADD COUPON FORM
            if(couponValidate(data)){

                const url = '/admin/editCoupon'
                const requestOptions = {
                    method : 'PUT',
                    body : JSON.stringify(data),
                    headers : {'Content-Type':'application/json'}
                }

                // SENDING THE API REQUEST TO SERVER 
                const response = await fetch(url, requestOptions);
                
                        if(!response.ok){
                            window.location.href = '/admin/error500';
                        }
            
                const responseData = await response.json();

                // RESPOSE EQUALITY CONDITON CHECKING AND PROVIDE THE MESSAGE TO USER
                if(responseData.success){
                    
                    window.scroll(0,0);
                    bannerResult.setAttribute('class','alert alert-success');
                    bannerResult.innerHTML = 'Coupon Edit Sucessful';

                    setTimeout(() => {
                        viewCouponListPage();
                        bannerResult.style.display = 'none'; 
                    }, 2000);

                }else{
                    bannerResult.setAttribute('class','alert alert-danger');
                    bannerResult.innerHTML = 'Coupon Edit Failed Tryagain';
                }
            }
        })
}



 