// OFFER FORM SUBMIT
const addOffer = document.getElementById('addOfferForm');

if (addOffer) {

    addOffer.addEventListener('submit', async (event) => {
        event.preventDefault();

        const offerResult = document.getElementById('offer-submit-result');

        // DATA TAKEN THE ADD OFFER FORM
        const data = {
            offerName: document.getElementById('offerName').value,
            OfferPercentage: document.getElementById('OfferPercentage').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,

        }


        // CHECKING THE VALIDATION IN ADD OFFER FORM
        if (offerValidate(data)) {

            const url = '/admin/addOffer'
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            }

            // SENDING THE API REQUEST TO SERVER 
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                window.location.href = '/admin/error500';
            }

            const responseData = await response.json();

            // RESPOSE EQUALITY CONDITON CHECKING AND PROVIDE THE MESSAGE TO USER
            if (responseData.success) {

                window.scroll(0, 0);
                offerResult.setAttribute('class', 'alert alert-success');
                offerResult.innerHTML = 'Offer Data Added Sucessful';

                setTimeout(() => {
                    document.getElementById('addOfferForm').reset();
                    window.location.reload();
                    offerResult.style.display = 'none';
                }, 2000);

            } else {
                offerResult.setAttribute('class', 'alert alert-danger');
                offerResult.innerHTML = 'Offer Added Failed Tryagain';
            }
        }
    })
}



// EDIT OFFER DATA SUBMISSION
const editOffer = document.getElementById('editOfferForm');

if (editOffer) {

    editOffer.addEventListener('submit', async (event) => {
        event.preventDefault();

        const offerResult = document.getElementById('edit-offer-submit-result');

        // DATA TAKEN THE ADD OFFER FORM
        const data = {
            id: document.getElementById('editFormDataId').value,
            offerName: document.getElementById('offerName').value,
            OfferPercentage: document.getElementById('OfferPercentage').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,

        }


        // CHECKING THE VALIDATION IN ADD OFFER FORM
        if (offerValidate(data)) {

            const url = '/admin/editOffer'
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            }

            // SENDING THE API REQUEST TO SERVER 
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                window.location.href = '/admin/error500';
            }

            const responseData = await response.json();

            // RESPOSE EQUALITY CONDITON CHECKING AND PROVIDE THE MESSAGE TO USER
            if (responseData.success) {

                window.scroll(0, 0);
                offerResult.setAttribute('class', 'alert alert-success');
                offerResult.innerHTML = 'Offer Data Edit Sucessful';

                setTimeout(() => {
                    document.getElementById('editOfferForm').reset();
                    window.location.href = '/admin/viewOfferList';
                    offerResult.style.display = 'none';
                }, 2000);

            } else {
                offerResult.setAttribute('class', 'alert alert-danger');
                offerResult.innerHTML = 'Offer Edit Failed Tryagain';
            }
        }
    })
}



// DELETE OFFER
const deleteOfferBtn = document.querySelectorAll('button[name="deleteCouponBtn"]');

if (deleteOfferBtn) {

    deleteOfferBtn.forEach(button => {

        button.addEventListener('click', async (event) => {

            Swal.fire({
                text: "Do you want to Delete the Offer?",
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

                    const offerId = event.target.getAttribute('data-offer-id');

                    const url = '/admin/deleteOffer';
                    const requestOptions = {
                        method: 'DELETE',
                        body: JSON.stringify({
                            offerId: offerId
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    }

                    const response = await fetch(url, requestOptions);

                        if (!response.ok) {
                            window.location.href = '/admin/error500';
                        }

                    const responseData = await response.json();

                    if (responseData.success) {
                        // const row = document.getElementById(`${offerId}`);
                        // row.parentNode.removeChild(row);

                        // const serialNo = document.querySelectorAll('td[name="offerSerialNumber"]');
                        // serialNo.forEach((td, i) => {
                        //     td.innerHTML = i + 1;
                        // })
                        Swal.fire({
                            position:'bottom',
                            html: '<span class="font-weight-bold"><i class="mdi mdi-check-all" style="color: #2dd26c;"></i> Deleted Successfully.</span>',
                            showConfirmButton: false, 
                            timer: 1800,
                        });
                        setTimeout(() => {
                            window.location.reload();
                        }, 1801);
                        

                    }
                }
            })
        })
    })

}




// VALIDATING THE COUPON FORM
function offerValidate(data) {

    const errorElemetns = document.querySelectorAll('p[name="validate-offer"]');
    console.log(errorElemetns)

    removeOfferErrorElements();

    let is_valid = true;



    if (data.offerName.trim() == '') {

        errorElemetns[0].innerHTML = ' * please fill out coupon name.';
        is_valid = false;

    }
    if (data.OfferPercentage.trim() == '') {

        errorElemetns[1].innerHTML = ' * please fill out offer percentage.';
        is_valid = false;

    }
    if (data.OfferPercentage > 99 || data.OfferPercentage < 0) {

        errorElemetns[1].innerHTML = ' * offer percentage must included (1-99)%.';
        is_valid = false;

    }
    if (data.startDate.trim() == '') {

        errorElemetns[2].innerHTML = ' * please fill out coupon start date';
        is_valid = false;

    }
    if (data.endDate.trim() == '') {

        errorElemetns[3].innerHTML = ' * please fill out coupon start date';
        is_valid = false;

    }
    if (data.startDate > data.endDate) {

        errorElemetns[2].innerHTML = ' * check our dates';
        errorElemetns[3].innerHTML = ' * check our dates';
        is_valid = false;

    }
    return is_valid;
}



// **** REMOVING THE ERROR ELEMENTS IN THE FORM ****
function removeOfferErrorElements() {

    const erroElemetns = document.querySelectorAll('p[name="validate-offer"]');

    erroElemetns.forEach((val) => {
        val.innerHTML = '';
    })
}



