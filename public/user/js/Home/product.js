
/* ################################# PRODUCT DETAIL VIEW &  PRODUCT IMAGE ZOOM ################################ */


// ********* EVENT DELIGATION TO VIEW SIDE TEMP IMAGE HOVER VIEW FULL IMAGE ON DIV ***********
const ImageTemp = document.getElementById('image-temp');
if(ImageTemp){
    document.getElementById('image-temp').addEventListener('mouseover',function(event){
        if(event.target.id == "image-thumb"){
            const imageViewDiv = document.getElementById('divInsideImage');
            const imageSrc = event.target.src;
            imageViewDiv.src = imageSrc;
        }
        })
}



// ****************** IMAGE DIV TO IMAGE ZOOM SETTING *************************
const ImageView = document.getElementById('imageView-Div');
if(ImageView){
    document.getElementById('imageView-Div').addEventListener('mouseover',()=>{
        let options = {
            width:590,
            zoomwidth:100,
            zoomLensStyle: "height:200; opacity: 0.3; background-color: white;",
            fillContainer: true,
            zoomPosition: 'original',
            offset: { vertical: 0, horizontal: 5 }
        }
        new ImageZoom(document.getElementById("imageView-Div"), options);
        
    })
}



// ************* PRODUCT DETAILED VIEW TIME COLOR WILL SHOW ON DIV SET THE BACKGROUND OF THE DIV ************
window.addEventListener('load', function() {
    
    const colorDiv = document.getElementById('productdetail-color-view');
    const color = colorDiv.getAttribute('name');
    colorDiv.style.backgroundColor = color;
    

});



// ********** BUYNOW BUTTON CLICKED TO GO FOR THE CHECKOUT PAGE ********
const BtnBuyNow = document.getElementById('buyNowBtn');
if(BtnBuyNow){
    BtnBuyNow.addEventListener('click',(event)=>{

        const url = event.target.getAttribute('data-url');
        window.location.href = url;
    })
}