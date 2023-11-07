// **** VIEW ALL CATEGORY DETAILS ****
function viewAllCategoryDetails(){

    const contentPlaceholder = document.getElementById("dynamic_page");

    // View Category List to a Table Form
    fetch("/admin/categorylist")
    .then((response) => {
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

        document.querySelector('title').innerHTML = 'Categorys'
        
    })
    .catch((error) => {
        console.error("Fetch error:", error);
    });
}