async function addProductPageLoad(){

    try {

        // MAIN DIV FOR PAGE VIEW SIDE
        const contentPlaceholder = document.getElementById("dynamic_page");

        // FETCH TO SEND A API REQUEST FOR ADD PRODUCT PAGE
        const response = await fetch("/admin/addproduct");

            if(response.status == 401){
                window.location.href = '/admin'
                return;
            }

            // RESPONSE CHECK
            if(!response.ok){

                window.location.href = '/admin/error500';
                return;
            }

        // RESPONSE CONVERTED TO TEXT
        const html = await response.text();
        contentPlaceholder.innerHTML = html;

        document.querySelector('title').innerHTML = 'Add Products'
    } catch (error) {
        console.log(error.message)
    }
}