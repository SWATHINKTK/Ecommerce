const orderFilter = document.querySelectorAll("input[name='orderFilter']");

orderFilter.forEach((checked) => {
    checked.addEventListener('click',(event) => {
        const select = event.target.value;

        const orderViewDiv = document.querySelectorAll('div[name="orderDatas"]');
        console.log(orderViewDiv)
        orderViewDiv.forEach((viewDiv) => {
            viewDiv.style.display = 'block';
            let status = viewDiv.getAttribute('value');

            console.log(select,status)
            
            if(select != status){
                viewDiv.style.display = 'none';
            }

            if(select == 'All'){
                viewDiv.style.display = 'block';
            }
        })
    })
})