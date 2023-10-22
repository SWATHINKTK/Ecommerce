// Block or Un Bublock button to Confirmation Modal Display
function userList(value) {
    document.getElementById("modal").style.display = "block";

    //*** Button preset Row to taken the Categoryname for uniqueness***
    const row = value.parentElement.parentElement;
    const id = row.cells[5];

    // ***Adding Data to the Ok button***
    document
        .getElementById("user-sucess")
        .setAttribute("data-category-id", id.getAttribute("id"));
}

// Modal Back Button Functionality Working Method
function back() {
    document.getElementById("modal").style.display = "none";
}




//*** Modal OK Button Functionality To Block or UnBlock User ***
function userBlock() {

    document.getElementById("modal").style.display = "none";

    //*** Retrieve the Data From OK Button ***
    const buttonId = document
        .getElementById("user-sucess")
        .getAttribute("data-category-id");


    const button = document.querySelector(`td[id="${buttonId}"]`);


    // ****Taken the td for status printing and change status for block and unblock button Click*****
    let status = document.querySelectorAll(`td[name="${buttonId}"]`);
    status = status[0];



    //****Converting the buttonId data to json Format sending patch request****
    const json = JSON.stringify({ id: buttonId });


    // ***Fetch Api is used send request***
    fetch("/admin/blockuser", {
        method: "PATCH",
        body: json,
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.user) {
                button.innerHTML =
                    '<button class="btn btn-outline-success pl-3 pr-3" id="<%= data[i]._id %>" onclick="userList(this)">Unblock</button>';
                status.innerHTML =
                    '<span class="text-danger font-weight-bold">&#128683; Blocked</span>';
            } else {
                button.innerHTML =
                    '<button class="btn  btn-outline-danger pl-4 pr-4" id="<%= data[i]._id %>" onclick="userList(this)">Block</button>';
                status.innerHTML =
                    '<span class="text-success font-weight-bold">&#9989 Verified</span>';
            }
        })
        .catch((error) => {
            console.log(error.message);
        });

}



//*** Searching the User Based on name ***
function searchUser() {

    const searchData = document.getElementById("categorySearch").value;
    window.location.href = `/admin/searchuser?search=${searchData}`;

    // const url = '/admin/searchuser';
    // const post = {
    //     method:'POST',
    //     body: JSON.stringify({'search':`${searchData}`}),
    //     headers:{'Content-Type':'application/json'}
    // }

    // fetch(url,post)

    // .then((response) => {
    //     if(!(response.ok)){
    //         window.location.href = '/admin/error500';
    //     }
    //     return response.text();
    // })

    // .then((data) => {
    //     console.log(data)
    //     var parser = new DOMParser();
    //     var doc = parser.parseFromString(data, 'text/html');
    //     var html = doc.querySelector('#userview')
    //     console.log(html)

    //     document.getElementById("dynamic_page").innerHTML = html;
    // }).catch((error) => {
    //     console.log(error.message)
    // })
}
