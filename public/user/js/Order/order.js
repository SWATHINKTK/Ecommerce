const progress = document.querySelectorAll("div[name='progress-order']");

window.addEventListener('load',()=>{

    const progressCanceled = document.getElementById('progress-div-canceled');
    progressCanceled.style.display = 'none';

    const progressMainDiv = document.getElementById('order-Progress-ViewPage');
    const status = progressMainDiv.getAttribute('data-order-status');
    const placedOn = progressMainDiv.getAttribute('data-order-Place');
    const progressPoint = document.getElementsByClassName('progress-number');
    const currentTime = new Date();
    if(status == 'Placed'){
        setTimeout(() => {
            progress[0].style.width = '20%';
            progressPoint[0].innerHTML = '&#10004';
            progressPoint[0].style.backgroundColor = 'green';
        }, 1200);
    }

    if(status == 'Shipped'){
        setTimeout(() => {
            progress[0].style.width = '100%';
            progressPoint[0].innerHTML = '&#10004';
            progressPoint[1].innerHTML = '&#10004';

            progressPoint[0].style.backgroundColor = 'green';
            progressPoint[1].style.backgroundColor = 'green';

            progress[0].setAttribute('class','progress-bar progress-bar-striped bg-success')
        }, 1200);
    }

    if(status == 'Delivered'){
        setTimeout(() => {
            progress[0].style.width = '100%';
            progressPoint[0].innerHTML = '&#10004';
            progressPoint[1].innerHTML = '&#10004';

            progressPoint[0].style.backgroundColor = 'green';
            progressPoint[1].style.backgroundColor = 'green';

            progress[0].setAttribute('class','progress-bar progress-bar-striped bg-success');

        }, 1200);
        setTimeout(() => {
            progress[1].style.width = '100%';
            progressPoint[2].innerHTML = '&#10004;';

            progressPoint[2].style.backgroundColor = 'green';

            progress[1].setAttribute('class','progress-bar progress-bar-striped bg-success')

        }, 3000);
    }
    if(status === 'Canceled'){

        document.getElementById('progress-div').style.display = 'none';

        progressCanceled.style.display = 'block';

        setTimeout(() => {

            progress[2].style.width = '100%';
            
            progressPoint[3].style.backgroundColor = 'green';
            progressPoint[4].style.backgroundColor = '#f9f1f1';

            progressPoint[3].innerHTML = '&#10004;';
            progressPoint[4].innerHTML = '&#10060;';

            progress[2].setAttribute('class','progress-bar progress-bar-striped bg-success')
        }, 1200);
    }
    console.log(progress)
    console.log(progressPoint)
    
  
})