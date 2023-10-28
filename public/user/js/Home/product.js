
/* ################################# PRODUCT DETAIL VIEW &  PRODUCT IMAGE ZOOM ################################ */


// ********* EVENT DELIGATION TO VIEW SIDE TEMP IMAGE HOVER VIEW FULL IMAGE ON DIV ***********
document.getElementById('image-temp').addEventListener('mouseover',function(event){
    if(event.target.id == "image-thumb"){
        const imageViewDiv = document.getElementById('divInsideImage');
        const imageSrc = event.target.src;
        imageViewDiv.src = imageSrc;
    }
    })



window.addEventListener('load', function() {
    
    const colorDiv = document.getElementById('productdetail-color-view');
    const color = colorDiv.getAttribute('name');
    colorDiv.style.backgroundColor = color;
    

});



// ****************** IMAGE DIV TO IMAGE ZOOM SETTING *************************

document.getElementById('imageView-Div').addEventListener('mouseover',()=>{
    console.log('hello');
    let options = {
        width:400,
        zoomwidth:100,
        scale:1,
        zoomPosition: 'original',
    }
    new ImageZoom(document.getElementById("imageView-Div"), options);
})