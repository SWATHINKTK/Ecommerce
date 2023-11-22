

// ***** UPDATE STATUS OF THE ORDER IN ADMIN *****
const updateOrderStatus = document.querySelectorAll('button[name="updateOrderStatus"]');

updateOrderStatus.forEach((updateButton) => {
    updateButton.addEventListener('click', async(event)=>{

        const orderId = event.target.getAttribute('data-order-id');
        const productId = event.target.getAttribute('data-product-id');
        const productQty = event.target.getAttribute('data-product-quantity');

        const status = document.getElementById(`${productId}`);
        
        const headingStatusView = document.querySelector(`span[name='${productId}']`);


        if(status.value == ''){
            swal.fire({
                text:'Please Select The Status',
            });
            return;
        }

        Swal.fire({
            text: "Do you want to Update the Status?",
            // showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            // denyButtonText: `Don't save`
            customClass: {
                content: 'custom-swal-text-color'
            }
          }).then(async (result) => {
        
            if (result.isConfirmed) {

                
                // console.log(status,status.value)
                
                const url = '/api/updateStatus';

                const responseOptions = {
                    method:'PATCH',
                    body:JSON.stringify({
                        orderId:orderId,
                        productId:productId,
                        productQty:productQty,
                        orderStatus:status.value
                    }),
                    headers:{'Content-Type':'application/json'}
                }

                const response = await fetch(url,responseOptions) ;

                headingStatusView.innerHTML = `( ${status.value} )`;

                // Status Update Selction Box And Button
                const updateStatusSection = document.querySelector(`div[name='${productId}']`);
                
                if(status.value == 'Canceled'){

                    updateStatusSection.style.display = 'none';
                    headingStatusView.setAttribute('class','ml-3 font-weight-bold text-danger');
                    

                }else{
                    headingStatusView.setAttribute('class','ml-3 font-weight-bold text-success');
                    status.value == 'Delivered' ?  updateStatusSection.style.display = 'none' : '';
                    if(status.value == 'Delvered'){
                        document.getElementById('adminOrderProgress-paymentStatus').innerHTML = '( Paid )'
                    }
                }

                Swal.fire({
                    text:"Satus Updated!",
                    type:"success",
                    timer:1900
                });
            } 
          });

        
    })
})



// FILTER ORDER DATA ENTER DIV VIEW 
const filterBtn = document.getElementById('filterBtn');

if(filterBtn){
    filterBtn.addEventListener('click',()=>{
        
        const filterDiv = document.getElementById('filterOrder');

        if(filterDiv.style.display == 'none'){
            filterDiv.style.display = 'block';
        }else{
            filterDiv.style.display = 'none';
        }
    })
}



