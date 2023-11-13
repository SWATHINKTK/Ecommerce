const isAdminLogin = async(req, res, next)=>{
    try {
        // console.log(req)
        if(!(req.session.adminId)){
            res.status(401).redirect('/admin?authFailed=true');      
        }else{
            next();
        }
        
    } catch (error) {
        next(error);
    }
}

module.exports = {isAdminLogin};