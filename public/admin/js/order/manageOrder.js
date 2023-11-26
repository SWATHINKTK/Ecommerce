

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
                
                if(status.value == 'Canceled' || status.value == 'Return_Canceled'){

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
const orderSearch = document.getElementById('orderSearchBtn');


if(orderSearch){
    orderSearch.addEventListener('click',async(event)=>{

        const toggleSearch = document.getElementById('toggleSearch');

        if(toggleSearch.getAttribute('aria-expanded')){
            const searchData = document.getElementById('orderSearch').value;

            if(searchData.trim() == ''){
                window.location.href = '/api/orderlist';
                return;
            }

            window.location.href = `/api/searchOrderId?value=${searchData}`;
            
            // const tableBody = document.getElementById('orderDataTableBody');

            // const response = await  fetch(`/api/searchOrderManagement?value=${searchData}`);

            //     if(!response.ok){
            //         window.location.href = '/admin/error500';
            //     }

            // const responseData = await response.json();
            // console.log(responseData);
            // console.log(tableBody)

            // tableBody.innerHTML = creatingTableRows(responseData.order);
        }
    })
}


function creatingTableRows(data){

    let rows = '';
    if(data.length > 0){
        // <tr>
        //             <td><%= i+1 %></td>
        //             <td><%= orderData[i]._id %></td>
        //             <td><%= orderData[i].totalAmount %></td>
        //             <td><%= orderData[i].createdAt.toLocaleDateString() %></td>
        //             <td><%= orderData[i].updatedAt.toLocaleDateString() %></td>
        //             <td><a href='/api/orderManage<%= orderData[i]._id %>'  class="btn btn-warning">Manage</a></td>
        //           </tr>
        data.forEach((order, index) => {
            rows += '<tr>';
            rows += '<td>' + index +1 + '</td>';
            rows += '<td>' +  order.order_id + '</td>';
            rows += '<td>' +  order.totalAmount + '</td>';
            rows += '<td>' +  new Date(order.createdAt).toLocaleDateString() + '</td>';
            rows += '<td>' +  new Date(order.createdAt).toLocaleDateString() + '</td>';
            rows += '<td> <a class="btn btn-warning" href="/api/orderManage' +  order._id +  '">Manage</a> </td>';
            rows += '</tr>';
        })
        
    }else{
        rows += '<tr class="bg-danger">';
        rows += '<th class="text-dark text-center" colspan="6">NO MATCHES FOUND</th>';
        rows += '</tr>';
    }
    return rows
}


const dateSearch = document.getElementById('dateSearch');

if(dateSearch){

    dateSearch.addEventListener('click',async(event)=>{
        event.preventDefault();

        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const tableBody = document.getElementById('orderDataTableBody');

        if(startDate < endDate){
            window.location.href = `/api/searchOrderManagement?startDate=${startDate}&endDate=${endDate}`;
        }else{
            Swal.fire({
                text:"enter start date less than end date",
                icon:'error',
                type:"error",
                timer:1900
            });
        }

        // const response = await  fetch(`/api/searchOrderManagement?startDate=${startDate}&endDate=${endDate}`);

        //     if(!response.ok){
        //         window.location.href = '/admin/error500';
        //     }

        // const responseData = await response.json();
        // console.log(responseData);
        // console.log(tableBody)

        // tableBody.innerHTML = creatingTableRows(responseData.order);
    })
}


