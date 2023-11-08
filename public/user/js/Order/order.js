const progress = document.querySelectorAll("div[name='progress-order']");

window.addEventListener('load',()=>{

    const progressMainDiv = document.getElementById('order-Progress-ViewPage');
    const status = progressMainDiv.getAttribute('data-order-status');
    const placedOn = progressMainDiv.getAttribute('data-order-Place');
    const progressPoint = document.getElementsByClassName('progress-number');
    const currentTime = new Date();
    if(status == 'Pending'){
        setTimeout(() => {
            progress[0].style.width = '20%';
            progressPoint[0].innerHTML = '&#10004';
            progressPoint[0].style.backgroundColor = 'green';
        }, 2000);
    }

    if(status == 'Shipped'){
        setTimeout(() => {
            progress[0].style.width = '100%';
            progressPoint[0].innerHTML = '&#10004';
            progressPoint[1].innerHTML = '&#10004';

            progressPoint[0].style.backgroundColor = 'green';
            progressPoint[1].style.backgroundColor = 'green';

            progress[0].setAttribute('class','progress-bar progress-bar-striped bg-success')
        }, 1500);
    }

    if(status == 'Delivered'){
        setTimeout(() => {
            progress[0].style.width = '100%';
            progressPoint[0].innerHTML = '&#10004';
            progressPoint[1].innerHTML = '&#10004';

            progressPoint[0].style.backgroundColor = 'green';
            progressPoint[1].style.backgroundColor = 'green';

            progress[0].setAttribute('class','progress-bar progress-bar-striped bg-success');

        }, 1500);
        setTimeout(() => {
            progress[1].style.width = '100%';
            progressPoint[2].innerHTML = '&#10004';

            progressPoint[2].style.backgroundColor = 'green';

            progress[1].setAttribute('class','progress-bar progress-bar-striped bg-success')

        }, 3300);
    }
    
    console.log(progress[0])
})