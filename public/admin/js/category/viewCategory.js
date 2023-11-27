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
        categoryOfferRemove();
        
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


// CATEGORY OFFER APPLY 
function categoryOfferApply(){
    const applyBtns = document.querySelectorAll('button[name="offerApplyBtn"]');

    applyBtns.forEach(button => {
        button.addEventListener('click', async(event)=>{
            event.preventDefault();

            const offerId = event.target.getAttribute('data-offer-id');

            const categoryId = document.getElementById('offerApplyingCategory').value;

            const table = document.querySelector(`tr[class='${categoryId}']`);


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

            const responseData = await response.json();

            if(responseData.offerApplied){
                Swal.fire({
                    position:'bottom',
                    html: '<span class="font-weight-bold"><i class="mdi mdi-check-all" style="color: #2dd26c;"></i> Offer Applied Successfully.</span>',
                    showConfirmButton: false, 
                    timer: 1800,
                });
                table.cells[7].innerHTML = `<button type="button" class="btn btn-danger" name="offerRemoveBtn" data-offer-id="${offerId}" data-category-id="${categoryId}">Remove</button>`
                table.cells[6].innerHTML = `${responseData.offerName} `
            }else{
                Swal.fire({
                    position:'bottom',
                    html: '<span class="font-weight-bold"><i class="mdi mdi-close" style="color: #FF0000;"></i> Offer Applied Failed Try Again.</span>',
                    showConfirmButton: false, 
                    timer: 1800,
                });
            }

        })
    })
}




// CATEGORY OFFER REMOVE
function categoryOfferRemove(){
    const removeOffer = document.querySelectorAll('button[name="offerRemoveBtn"]');

    removeOffer.forEach(button => {
        button.addEventListener('click', async(event)=>{
            event.preventDefault();
            
            const offerId = event.target.getAttribute('data-offer-id');

            const categoryId = event.target.getAttribute('data-category-id');

            const table = document.querySelector(`tr[class='${categoryId}']`);


            const url = '/admin/categoryOfferRemove';
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

            const responseData = await response.json();

            if(responseData.offerApplied){
                Swal.fire({
                    position:'bottom',
                    html: '<span class="font-weight-bold"><i class="mdi mdi-close text-danger"></i> Offer Removed Successfully.</span>',
                    showConfirmButton: false, 
                    timer: 2000,
                });
                table.cells[7].innerHTML = `<button type="button" name="categoryOfferModalViewBtn" class="btn btn-dark" data-toggle="modal" data-target="#exampleModal" data-category-id="${categoryId}">Apply</button>`
                table.cells[6].innerHTML = ''
            }else{
                Swal.fire({
                    position:'bottom',
                    html: '<span class="font-weight-bold"><i class="mdi mdi-close" style="color: #FF0000;"></i> Offer Remove Rejected Try Again.</span>',
                    showConfirmButton: false, 
                    timer: 2000,
                });
            }

        })
    })
}