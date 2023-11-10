
const isUserLogin = async(req,res,next) =>{
    try{
        if(!(req.session.userId)){
            res.status(404).redirect('/login')
        }
        next();
    }catch(error){
        console.log(error.message);
    }
   
}

module.exports = {isUserLogin};