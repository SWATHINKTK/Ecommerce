
function changeUsername(input,btn_save,btn_cancel){

    const inputField = document.getElementById('username-input');
    inputField.removeAttribute('disabled')
    
    const buttonSave = document.getElementById('update-username');
    buttonSave.style.display = 'block';

    const buttonCancel = document.getElementById('username-cancel');
    buttonCancel.style.display = 'block';
}

document.getElementById('update-username').addEventListener('click',()=>{
    console.log('hello');
    alert('hello')
    window.location.href = '/'
})