// **** VIEW ALL CATEGORY DETAILS ****
function viewAllCategoryDetails(){

    const contentPlaceholder = document.getElementById("dynamic_page");

    // View Category List to a Table Form
    fetch("/admin/categorylist")
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

        // Update The Part Of The HTML & View Categorys
        contentPlaceholder.innerHTML = html;

        //View Category Page Inside js Functionality Working add Js File
        const scriptSrc = '/public/admin/js/category/listCategory.js';
        const scriptExist = document.querySelector(`script[src="${scriptSrc}"]`);

        if(scriptExist){
            scriptExist.parentNode.removeChild(scriptExist);
        }
        const script = document.createElement('script');
        script.src = scriptSrc; 
        document.body.appendChild(script);

        document.querySelector('title').innerHTML = 'Categorys';

        categoryOfferModalListView();
        categoryOfferApply();
        
    })
    .catch((error) => {
        console.error("Fetch error:", error);
    });
}


function categoryOfferModalListView(){

    const offerModalBtn = document.querySelectorAll('button[name="categoryOfferModalViewBtn"]');

    offerModalBtn.forEach(button => {
        button.addEventListener('click' ,(event) => {
            event.preventDefault();

            const categoryId = event.target.getAttribute('data-category-id');

            const hiddenData = document.getElementById('offerApplyingCategory');

            hiddenData.value = categoryId;
        })
    })
}



function categoryOfferApply(){
    const applyBtns = document.querySelectorAll('button[name="offerApplyBtn"]');

    applyBtns.forEach(button => {
        button.addEventListener('click', async(event)=>{
            event.preventDefault();

            const offerId = event.target.getAttribute('data-offer-id');

            const categoryId = document.getElementById('offerApplyingCategory').value;
            console.log(offerId,categoryId);


            const url = '/admin/categoryOfferApply';
            const requestOptions = {
                method:'PATCH',
                body:JSON.stringify({
                    offerId:offerId,
                    categoryId:categoryId
                }),
                headers:{
                    'Content-Type':'application/json'
                }
            };


            const response = await fetch(url, requestOptions);

        })
    })
}