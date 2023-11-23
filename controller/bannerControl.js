
// LOAD BANNER VIEW PAGE
const loadBannerPage = (req, res, next) => {
    try {
        res.render('admin/viewBanner', { admin: true });
    } catch (error) {
        
    }
}

// Load Add Banner page 
const loadAddBannerPage = (req, res, next) => {
    try {
        res.render('admin/addBanner', { admin: true });
    } catch (error) {
        next(error);
    }
}


// ADD NEW BANNER
const addNewBanner = (req, res, next) => {
    try {
        const data = req.body;
        console.log(data);
        console.log(req.file)
    } catch (error) {
        next(error);
    }
}


module.exports = {
    loadBannerPage,
    loadAddBannerPage,
    addNewBanner
}