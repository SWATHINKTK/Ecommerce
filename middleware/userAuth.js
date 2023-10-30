const isUserLogin = (req,res,next) =>{
    try{

        if(!(req.session.userId)){
            res.redirect('/login')
        }
        next();
    }catch(error){
        console.log(error.message);
    }
   
}

module.exports = {isUserLogin};