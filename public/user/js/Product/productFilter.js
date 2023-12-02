
window.addEventListener("DOMContentLoaded", function() {

    // WINDOW RELOAD TIME CATEGORY FILTER ALREADY CHECKED DATA SETTING TO CHECKED FORMAT
    let searchData = document.getElementById('searchCategoryData');

    if(searchData){

        searchData = searchData.value.split(',');
        const categoryTag = document.querySelectorAll('input[name="allProductCategoryFilter"]');

        categoryTag.forEach(input =>{
            if(searchData.includes(input.value)){
                input.checked = true;
            }
        })
    }



    // WINDOW RELOAD TIME BRAND FILTER ALREADY CHECKED DATA SETTING TO CHECKED FORMAT
    let brandData = document.getElementById('searchBrandData');

    if(brandData){

        brandData = brandData.value.split(',');
        const brandTag = document.querySelectorAll('input[name="allProductBrandFilter"]');

        brandTag.forEach(input =>{
            if(brandData.includes(input.value)){
                input.checked = true;
            }
        })
    }


    // WINDOW RELOAD TIME PRICE FILTER ALREADY CHECKED DATA SETTING TO CHECKED FORMAT
    let priceSearchData = document.getElementById('searchPrice');

    if(priceSearchData){

        priceSearchData = priceSearchData.value;
        const PriceFilter = document.querySelectorAll('input[name="allProductPriceFilter"]');
        
        PriceFilter.forEach(input =>{
            console.log(input.value , priceSearchData)
            if(input.value == priceSearchData){
                input.checked = true;
            }
        })
    }

})




// SELECTED FILTER DATA SELECTING USING FUNCTION
let category = [];
let brand = [];
let price = 0;
let search = '';
let pageNo = 1;
function selectFilteData(){

    category.splice(0, category.length);
    brand.splice(0, brand.length)

    // CATEGORY
    const categoryTag = document.querySelectorAll('input[name="allProductCategoryFilter"]');
    categoryTag.forEach(input =>{
        if(input.checked){
            category.push(input.value)
        }
    })

    // BRAND
    const brandTag = document.querySelectorAll('input[name="allProductBrandFilter"]');
    brandTag.forEach(input =>{
        if(input.checked){
            brand.push(input.value)
        }
    })

    // PRICE
    const priceTag = document.querySelectorAll('input[name="allProductPriceFilter"]');
    priceTag.forEach(input =>{
        if(input.checked){
            price = input.value;
        }
    })


    // RETRIEVING THE USER TEXT DATA IN SEARCH INPUT
    const searchData = document.getElementById('searchInput');
        if(searchData.value.trim() != ''){
            search = searchData.value;
        }

    filterServerRequest()
}



// FILTERED PRODUCT SEARCH OPTION
const searchInput = document.getElementById('searchInput');

if(searchInput){
    searchInput.addEventListener('change',(event) =>{
        event.preventDefault();

        const searchData = document.getElementById('searchInput');
        if(searchData.value.trim() != ''){
            search = searchData.value;
        }

        window.location.href = `/productFilterSearch?search=${search}`
    })
}




// FILTER TO GET PRODUCT DATA ON PAGINATION WORKING
const pagination = document.querySelectorAll('a[name="pagination"]');

if(pagination){
    pagination.forEach(page => {
        page.addEventListener('click',(event)=>{
            event.preventDefault();
            pageNo = event.target.getAttribute('data-page')
            selectFilteData()
        })
    })
}




// SERVER REQUEST SENDING FOR FILTERING THE DATA
async function filterServerRequest(){
  
    // FILTER CANCEL TIME REDIRECT TO SHOP PAGE
    if(category.length == 0 && brand.length == 0 && price == 0 && search.trim() == ''){
        window.location.href = '/allproductview'
        return;
    }

    
    const brandData = brand.join(',');

    // SETTING THE URL AND THIS URL APPEND THE DATA OF FILTERING
    let url = `/productFilter?page=${pageNo}`;

    if(category.length > 0){
        const categoryData = category.join(',');
        url += `&category=${categoryData}`
    }
    
    if(brand.length > 0){
        const brandData = brand.join(',');
        url += `&brand=${brandData}`
    }

    if(price != 0){
        url += `&price=${price}`
    }

    if(search.trim() != ''){
        url += `&search=${search}`
    }

    // SENDING THE ROUTER REQ
    window.location.href = url

}

