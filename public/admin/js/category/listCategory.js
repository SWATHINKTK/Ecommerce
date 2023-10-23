/*============================================= List / UNList Functionality===========================================  */

//**** List or Unlist Button to Show the Modal****
function categoryList(value) {

    document.getElementById("modal").style.display = "block";

    //*** Button to Retrieve Details of the Category***
    const row = value.parentElement.parentElement;
    const id = row.cells[5];
    const categoryName = row.cells[1].textContent;

    //**** Above Retrive data Add to Modal Ok Button***
    document.getElementById("sucess").setAttribute("data-category-name", categoryName);
    document.getElementById("sucess").setAttribute("data-category-id", id.getAttribute("id"));
}




//*** Modal Back Button ***
function back() {

    document.getElementById("modal").style.display = "none";

}



//*** Modal Sucess Button ***
function sucess() {
    document.getElementById("modal").style.display = "none";

    //**** Retrieve the Category Name & Id From Modal Sucess Button ***
    const categoryId = document.getElementById("sucess").getAttribute("data-category-id");
    const categoryName = document.getElementById("sucess").getAttribute("data-category-name");

    console.log(categoryId,categoryName)

    
    //*** Modal Sucess to Update Data Retrieve ***
    const button = document.querySelector(`td[id="${categoryId}"]`);
    const status = document.querySelector(`td[name="${categoryId}"]`);

    console.log(button,status)


    //*** Fetch API Used to Update Data ***
    fetch("/admin/categorystatusupdate", {
        method: "PATCH",
        body: JSON.stringify({ categoryId: `${categoryId}` }),
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())

        .then((data) => { 

            //*** Check Staus And Update ****
            if (data.list) {

                status.innerHTML = '<td name="<%= data[i]._id %>"><span class="text-success font-weight-bold">&#9989; Listed</span></td>';
                button.innerHTML = '<button class="btn btn-warning pl-3 pr-3" onclick="categoryList(this)"><i class="bi bi-x-circle"></i>Unlist</button>';
            
            } else {

                status.innerHTML = '<td name="<%= data[i]._id %>"><span class="text-danger font-weight-bold">&#128683; Unlisted</span></td>';
                button.innerHTML = '<button class="btn btn-primary pl-4 pr-4" onclick="categoryList(this)"><i class="bi bi-check2-circle"> </i>list</button>';
            
            }

        })
        .catch((error) => {
            console.log(error.message);
        });

}




//*** Edit Button to View Edit Data Form ***
async function editCategory(value) {

    //*** Take the Category id from that button Present Row ***
    const row = value.parentElement.parentElement;
    const column = row.cells[5];
    const id =column.getAttribute("id");
   

    const url = `/admin/editcategory${id}`;

    //*** Fetch API is used to Retrieve Edit Page ***
    fetch(url)

        .then((response) => {

            //*** Check The Reponse is Sucess or Not
            if (!response.ok) {
                window.location.href = "/admin/error404";
            } else {
                return response.text();
            }

        })

        .then((data) => {

            document.getElementById("dynamic_page").innerHTML = data;

            //*** Edit Category Page Inside js Functionality Working add Js File ***
            const scriptSrc = "/public/admin/js/category/editCategory.js";
            const scriptExist = document.querySelector(`script[src="${scriptSrc}"]`);

            //*** Check Script is Exist or Not .Existed it Will Be Removed***
            if (scriptExist) {
                scriptExist.parentNode.removeChild(scriptExist);
            }

            //*** Add The Script File ***
            const script = document.createElement("script");
            script.src = scriptSrc;
            document.body.appendChild(script);

        })
        .catch((error) => {
            console.log(error.message);
        });

}



//*** Searching the Category Based on name ***
function searchCategory() {

    const searchData = document.getElementById("categorySearch").value;

    //*** Fetch API is Used To Search Category to Retrieve Data
    const url = "/admin/searchcategory";
    const post = {
        method: "POST",
        body: JSON.stringify({ search: `${searchData}` }),
        headers: { "Content-Type": "application/json" },
    };


    fetch(url, post)
        .then((response) => {

            if (!response.ok) {

                window.location.href = "/admin/error500";
                
            }
            return response.text();
        })

        .then((data) => {

            document.getElementById("dynamic_page").innerHTML = data;

        })

        .catch((error) => {

            console.log(error.message);

        });

}
