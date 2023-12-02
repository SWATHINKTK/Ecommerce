const isAdminLogin = async(req, res, next)=>{
    try {
        if(req.session.adminId){   
        }else{
            res.status(401).redirect('/admin?authFailed=true');
            return;    
        }
        next();
        
    } catch (error) {
        next(error);
    }
}

const isAdminLogout = (req, res, next) => {
    try{
        if(req.session.adminId){
            res.redirect('/admin/home');
            return;
        }
        next();
    }catch(error){
        console.log(error.message);
    }
}



module.exports = {
    isAdminLogin,
    isAdminLogout
};