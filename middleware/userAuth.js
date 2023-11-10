
const isUserLogin = async(req,res,next) =>{
    try{

        if(!(req.session.userId)){

                res.redirect('/login');

            // if(req.method == 'GET')
            //     res.redirect('/login');
            // else
            //     res.status(404)
            
        }
        next();
    }catch(error){
        console.log(error.message);
    }
   
}

module.exports = {isUserLogin};