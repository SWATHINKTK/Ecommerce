
const LoadCheckoutPage = (req,res) => {

    const checkLogin = req.session.userId ? true : false;

    res.render('user/checkout',{user:true, title:'CheckOut', login:checkLogin});
}

module.exports = {
    LoadCheckoutPage
}