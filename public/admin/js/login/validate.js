/********************************* LOGIN VALIDATION **********************************/

function validateAdminLogin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    // Define a regular expression for a valid email address
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const alert = document.querySelectorAll("span[name='validate-admin-alert']");
    console.log(alert);

    let is_Valid = true;

    if (username.trim() === '') {

        alert[0].style.display = 'block';
        alert[0].innerHTML = '* Enter username';
        alert[1].innerHTML = '';

        is_Valid = false;

    } else if (!emailRegex.test(username)) {

        alert[0].style.display = 'block';
        alert[0].innerHTML = '* Enter a proper email format';
        alert[1].innerHTML = '';

        is_Valid = false;

    } else if (password.trim() === '') {

        alert[1].style.display = 'block';
        alert[1].innerHTML = '* Enter password';
        alert[0].innerHTML = '';

        is_Valid = false;
    }
    return is_Valid;

    
}
