const isAdminLogin = async(req, res, next)=>{
    try {
        if(!(req.session.adminId)){
            res.status(401).redirect('/admin');
        }
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {isAdminLogin};