const isUserLogin = (req,res,next) =>{
    try{

        if(req.session.userId){
        
        }else{
            res.redirect('/login')
        }
        next();
    }catch(error){
        console.log(error.message);
    }
   
}

module.exports = {isUserLogin};