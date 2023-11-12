
const isUserLogin = async(req,res,next) =>{
    try{

        if(!(req.session.userId)){
            console.log('auth')
            if(req.is('json')){
                res.status(401).json()
            }else{
                res.status(401).redirect('/login');
            return;
            }
            
        }else{
            next();
        }
    }catch(error){
        console.log(error.message);
    }
   
}

module.exports = {isUserLogin};