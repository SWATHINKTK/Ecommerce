// **** LOAD TIME EVENT WORKING ON PROGRESS BAR ***

const progress = document.querySelectorAll("div[name='progress-order']");

window.addEventListener('load',()=>{

    const progressCanceled = document.getElementById('progress-div-canceled');
    progressCanceled.style.display = 'none';

    const progressMainDiv = document.getElementById('order-Progress-ViewPage');
    const status = progressMainDiv.getAttribute('data-order-status');
    const placedOn = progressMainDiv.getAttribute('data-order-Place');
    const progressPoint = document.getElementsByClassName('progress-number');
    const currentTime = new Date();
    if(status == 'Placed'){
        setTimeout(() => {
            progress[0].style.width = '20%';
            progressPoint[0].innerHTML = '&#10004';
            progressPoint[0].style.backgroundColor = 'green';
        }, 1200);
    }

    if(status == 'Shipped'){
        setTimeout(() => {
            progress[0].style.width = '100%';
            progressPoint[0].innerHTML = '&#10004';
            progressPoint[1].innerHTML = '&#10004';

            progressPoint[0].style.backgroundColor = 'green';
            progressPoint[1].style.backgroundColor = 'green';

            progress[0].setAttribute('class','progress-bar progress-bar-striped bg-success')
        }, 1200);
    }

    if(status == 'Delivered'){
        setTimeout(() => {
            progress[0].style.width = '100%';
            progressPoint[0].innerHTML = '&#10004';
            progressPoint[1].innerHTML = '&#10004';

            progressPoint[0].style.backgroundColor = 'green';
            progressPoint[1].style.backgroundColor = 'green';

            progress[0].setAttribute('class','progress-bar progress-bar-striped bg-success');

        }, 1200);
        setTimeout(() => {
            progress[1].style.width = '100%';
            progressPoint[2].innerHTML = '&#10004;';

            progressPoint[2].style.backgroundColor = 'green';

            progress[1].setAttribute('class','progress-bar progress-bar-striped bg-success')

        }, 3000);
    }
    if(status === 'Canceled'){

        document.getElementById('progress-div').style.display = 'none';

        progressCanceled.style.display = 'block';

        setTimeout(() => {

            progress[2].style.width = '100%';
            
            progressPoint[3].style.backgroundColor = 'green';
            progressPoint[4].style.backgroundColor = '#f9f1f1';

            progressPoint[3].innerHTML = '&#10004;';
            progressPoint[4].innerHTML = '&#10060;';

            progress[2].setAttribute('class','progress-bar progress-bar-striped bg-success')
        }, 1200);
    }
  
})




// **** CANCEL ORDER FOR USER SIDE ****
const cancelOrder = document.getElementById('orderCancel');

cancelOrder.addEventListener('click',async(event) => {
    event.preventDefault();

    Swal.fire({
        title: 'Are you sure?',
        text: "Order Will Be Canceled !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#808080',
        confirmButtonText: '<i class="fa-regular fa-trash-can  fa-lg" style="color: #ffffff;"></i> Delete'
      }).then(async (result) => {
    
            if (result.isConfirmed) {
                const productQuantity = event.target.getAttribute('data-product-qunatity');
                const productId = event.target.getAttribute('data-product-id');
                const orderId = event.target.getAttribute('data-order-id');
                console.log(productId,orderId,productQuantity);

                const url = '/api/cancelOrder';

                const requestOptions = {
                    method:'DELETE',
                    body:JSON.stringify({
                        productId:productId,
                        orderId:orderId,
                        qunatity:productQuantity
                    }),
                    headers:{'Content-Type':'application/json'}
                }

                const response = await fetch(url,requestOptions);

                    if(!response.ok){
                        window.location.href = '/error500';
                    }

                const responseData = await response.json();

                    if(responseData.status){

                        Swal.fire({
                            position:'bottom',
                            html: '<i class="fa-solid fa-circle-check" style="color: #2dd26c;"></i> Order Cancel Successfull.',
                            showConfirmButton: false, 
                            timer: 1500,
                        })

                        setTimeout(() => {
                            window.location.href = `/api/orderDetails?id=${orderId}&productId=${productId}`
                        }, 1600);


                        // document.getElementById('progress-div').remove();

                        // document.getElementById('order-progress-footer').remove();

                        // const progressCanceled = document.getElementById('progress-div-canceled');
                        // progressCanceled.style.display = 'block';

                        // setTimeout(() => {
                        //     progress[2].style.width = '100%';
                            
                        //     progressState[3].style.backgroundColor = 'green';
                        //     progressState[4].style.backgroundColor = '#f9f1f1';

                        //     progressState[3].innerHTML = '&#10004;';
                        //     progressState[4].innerHTML = '&#10060;';

                        //     progress[2].setAttribute('class','progress-bar progress-bar-striped bg-success')
                        // }, 1600);


                        
                    }else{
                        Swal.fire({
                            position:'bottom',
                            html: 'NetWork Issue Try Again.',
                            showConfirmButton: false, 
                            timer: 1500,
                        })
                    }
            }
      })

    
})


