// document.getElementById('categorysubmit').addEventListener('submit',()=>{
//     // alert(document.getElementById('exampleInputName1').value)
//     // alert(document.getElementById('exampleTextarea1').value)
//     const form = document.getElementById('addCategoryForm');
//     console.log(form)
//     const formData = new FormData(form);
//     // alert(form.categoryname.value);


//     fetch('/admin', {
//         method: 'POST', // Use the appropriate HTTP method (POST, GET, etc.)
//         body: formData
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error("Network response was not ok");
//         }
//         return response.text();
//     }) // Assuming the server returns JSON response
//     .then(data => {
//         console.log('fetched',data);
//         // Handle the response from the server
//         // document.getElementById('response').textContent = data.message;
//     })
//     .catch(error => {
//         // Handle errors here
//         console.error('Error:', error);
//     });
    

// })
// // document.getElementById('addCategoryForm').addEventListener('submit', function(event) {
// //     // event.preventDefault(); // Prevent the default form submission behavior
// //     // (document.getElementById('addCategoryForm').categoryname)
// //     // Get form data
// //     const formData = new FormData(this);

// //     // Send form data to the server using Fetch API
// //     fetch('/admin/addcategory', {
// //         method: 'POST', // Use the appropriate HTTP method (POST, GET, etc.)
// //         body: formData
// //     })
// //     .then(response => response.json()) // Assuming the server returns JSON response
// //     .then(data => {
// //         alert('fetched');
// //         // Handle the response from the server
// //         // document.getElementById('response').textContent = data.message;
// //     })
// //     .catch(error => {
// //         // Handle errors here
// //         console.error('Error:', error);
// //     });
// // });

// document.getElementById('categorysubmit').addEventListener('click',()=>{

// })

// //post new categor to server
document.getElementById('addCategoryForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Create a FormData object to collect form data
    // const formData = new FormData(this);

    const categoryname = document.getElementById('addCategoryForm').categoryname.value;
    const description = document.getElementById('addCategoryForm').description.value;
    console.log(categoryname,description)
    const formData = {
        categoryname,
        description
    };
    const jsonData = JSON.stringify(formData)
    console.log(jsonData)
    
    fetch('/admin/addcategory', {
        method: 'POST',
        body: jsonData,
        headers :{'Content-Type':'application/json'}
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('categorysuccess').innerHTML = data.message;
        if(data.status){document.getElementById('addCategoryForm').reset()}
    })
    .catch((error) => {
        console.log();('Error:', error.message);
    });
});