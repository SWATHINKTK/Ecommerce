document.getElementById("addCategoryForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        const categoryname = document.getElementById("addCategoryForm").categoryname.value;
        const description = document.getElementById("addCategoryForm").description.value;

        const result = document.getElementById("category-submit-result");
        result.style.display = 'block';

        const formData = {
            categoryname,
            description,
        };

        const jsonData = JSON.stringify(formData);

        fetch("/admin/addcategory", {
            method: "POST",
            body: jsonData,
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                
                if (data.status) {
                    result.setAttribute('class','alert alert-success');
                    result.innerHTML = data.message;
                    document.getElementById("addCategoryForm").reset();
                }else{
                    result.setAttribute('class','alert alert-danger');
                    result.innerHTML = data.message;
                }
            })
            .catch((error) => {
                console.log();
                "Error:", error.message;
            });

            setTimeout(()=>{
                result.style.display = 'none';
            },2000)
    });


function formReset(){
    window.location.href = '/admin/home';
    // document.getElementById("addCategoryForm").reset();
}