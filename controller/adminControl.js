const bcrypt = require('bcrypt');
const fs = require('fs');
const { loginData, category, productInfo,brandInfo } = require('../models/adminModel');
const { userData } = require('../models/userModal');
const { query } = require('express');
const { connected } = require('process');
const { error } = require('console');


/*---------------------------------------ADMIN ROUTER ACCESSING FUNCTIONS----------------------------------------------------------*/
async function strong(pass) {
    try {
        const x = await bcrypt.hash(pass, 10)
        return x;
    } catch (err) {
        console.log(err)
    }

}


/*---------------------------------------ADMIN LOGIN & HOME PAGE LOAD FUNTIONS---------------------------------------------------------*/

// VIEW Admin Login Page 
const loadAdminLogin = (req, res) => {
    res.render('admin/login', { admin: false, style: true, title: 'Admin Login' });

}

// Verify the Admin Credential and Redirect Admin Homepage
const verifyLogin = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const adminData = await loginData.findOne({ username: username });
        if (adminData) {
            const passwordMatch = await bcrypt.compare(password, adminData.password)
            if (passwordMatch) {
                req.session.name = adminData.adminname;
                req.session.admin_id = adminData._id;
                res.redirect('admin/home');
            } else {
                res.render('admin/login', { admin: false, style: true, title: 'Admin Login' });
            }
        }
    } catch (error) {
        console.log(error.message);
    }

}

// VIEW Admin Home Window 
const loadAdminHomepage = (req, res) => {
    // const name = req.params.adminData.name;
    res.render('admin/main', { admin: true, name: req.session.name, title: 'AdminHome' });
}



/*============================================ ADMIN USER MANAGE ROUTE FUNCTIONS =================================================*/

// ***VIEW User List Window***
const loadUserList = async (req, res) => {
    const user = await userData.find({}).sort({ block: 1,_id:-1 });
    res.render('admin/viewUsers', { admin: true, title: 'User Data', data: user });
}


// ***USER BLOCK / UNBLOCK FEATURE***
const blockUser = async (req, res) => {

    const id = req.body.id;
    const user = await userData.findOne({ _id: id });


    // in this case checking the User is blocked or Unblocked
    if (user.block) {

        const storeData = await userData.findOneAndUpdate(
            { _id: id },
            { $set: { block: false, block_date: new Date() } },
            { new: true });

        // Store Data True Then send result Used is Blocked
        if (storeData) {

            res.json({ 'user': false });

        } else {
            res.status(500).render('partials/error-500')
        }

    } else {

        const storeData = await userData.findOneAndUpdate(
            { _id: id },
            { $set: { block: true, block_date: new Date() } },
            { new: true });

        // Store Data True Then send result Used is UnBlocked
        if (storeData) {

            res.json({ 'user': true });

        } else {
            res.status(500).render('partials/error-500')
        }
    }
}

// User Search
const searchUser = async (req, res) => {
    const search = req.query.search;
    const regex = new RegExp(`^${search}.*`, 'i');

    const searchData = await userData.find({ username: { $regex: regex } });

    res.render('admin/viewUsers', { admin: true, data: searchData, title: 'Users' });
}



/*################################################################ PRODUCT SECTION #####################################################################*/


// Load Product List Window
const loadProductList = async (req, res) => {

    const product = await productInfo.find({}).sort({_id:-1});
    res.render('admin/viewProducts', { admin: true, productData: product });

}


// Load Product More Data and view in a modal
const loadProductMoreData = async (req, res) => {
    const id = req.params.id
    console.log(id)
    const data = await productInfo.findOne({ _id: id });
    if (data) {
        res.status(200).render('admin/productDetailModal', { modaldata: data });

    } else {
        res.status(500).redirect('/admin/error500');
    }
}

const searchProduct = async (req, res) => {
    try {
        const search = req.params.data;
        const Regex = new RegExp(`^${search}.*`, 'i');
        const productData = await productInfo.find({ productName: { $regex: Regex } });
        console.log(search, productData);
        res.render('admin/viewProducts', { admin: true, productData: productData });
    } catch (error) {
        console.log(error.meassge);
        res.redirect('/admin/error500', { admin: '/admin' });
    }

}

// Product Staus Update and show list and unlist button
const productStatusUpdate = async (req, res) => {

    const id = req.params.id;
    const data = await productInfo.findOne({ _id: id });

    if (data.status) {

        const update = await productInfo.updateOne({ _id: id }, { $set: { status: false } });

        if (update.acknowledged) {
            res.status(200).json({ message: false, id: data._id });

        } else {
            res.redirect('/admin/error404');
        }

    } else {

        const update = await productInfo.updateOne({ _id: id }, { $set: { status: true, listDate: new Date() } }, { upsert: true });

        if (update.acknowledged) {
            res.status(200).json({ message: true, id: data._id });

        } else {
            res.redirect('/admin/error404');
        }
    }
}




// Load Add Product page 
const loadAddProductPage = async (req, res) => {

    const categoryData = await category.find({ list: true }, { categoryname: 1 });
    // console.log(categoryData)
    const brandData = await brandInfo.find({},{brand_name:1});
    // console.log(brandData)

    res.render('admin/addProduct', { admin: true, categorydata: categoryData ,branddata:brandData});
}



// Adding the Product Data into Database
const productAdd = async (req, res) => {

    try {

        // Taken Data Come Form Clent 
        const data = req.body;
        console.log(data);
        const images = [];
        req.files.forEach((file) => {
            images.push(file.filename)
        });


        let condition = (data.productName !== '' && data.productCategory !== '' && data.productDescription !== '' && data.productBrandName !== '' && data.productStock !== '' && data.productPrice !== '' && data.productSize !== '' && data.productMaterial !== '' && data.productColor !== '' && data.productSpecification !== '');
        // checking All Field entered or not 
        if (condition && images.length > 1 ) {

            const productData = productInfo({
                productName: data.productName,
                categoryIds: data.productCategory,
                description: data.productDescription,
                brandname: data.productBrandName,
                stock: data.productStock,
                price: data.productPrice,
                size: data.productSize,
                material: data.productMaterial,
                color: data.productColor,
                productImages: images,
                specifications: data.productSpecification,
                addDate: new Date(),
            })
            console.log(productData)
            const product = await productData.save();

            // Sucess result Checking
            if (product) {
                res.json({ status: true, message: '&#9989; Succesfully Added Product' });
            } else {
                res.render('/admin/error500');
            }

        } else {

            const filePath = '../public/admin/assets/productImages';
            fs.unlink(filePath, (error) =>{

                if(error){
                    console.log(`Error deleting the file: ${error.message}`)
                }else{
                    console.log(`File ${filePath} has been deleted.`);
                }

            })

            res.json({ status: false, message: '&#10071; Enter All Field' });
        }

    } catch (error) {
        console.log(error.meassge);
    }



}



// Load Edit Product page 
const loadEditProductPage = async (req, res) => {

    try {
        const id = req.params.id;
        const productData = await productInfo.findOne({ _id: id });

        const Data = await category.find({}, { categoryname: 1 });
        res.render('admin/editProduct', { admin: true, dataCategory: Data, dataProduct: productData });

    } catch (error) {
        console.log(error.message)
    }


}



const editProduct = async (req, res) => {

    try {
        const data = req.body;
        const file = req.files;

        console.log(data);


        // *** Finding The Length Of The ProductImage ***
        let incomeProductImageLength;
        if(data.productImage){
            incomeProductImageLength = typeof data.productImage == 'string' ? 1 : data.productImage.length ;
        }else{
            incomeProductImageLength = 0;
        }
        

        //*** Updating the Images Length Setting ***
        let productImages = [];
        if(incomeProductImageLength == 1){

            productImages[0] = data.productImage;

        }else if(incomeProductImageLength > 1){

            productImages = [...data.productImage];

        }
       
        
        //*** Updating the Images  ***
        let length = incomeProductImageLength;
        if(file.length > 0){
            file.forEach(val => productImages[length++] =  val.filename);
        }

     
       

        //*** Deleting the old images ***
        let removeImages = [];
        let removeImagesLength ;
        if(data.removeImage){

            removeImagesLength = typeof data.removeImage == 'string' ? 1 : data.removeImage.length ;

        }else{

            removeImagesLength = 0;

        }

        if(removeImagesLength == 1){

            removeImages[0] = data.removeImage;

        }else if(removeImagesLength > 1){

            removeImages = [...data.removeImage];

        }

        for(let i = 0; i < removeImagesLength ;i++){
            let filePath = `../public/admin/assets/productImages/${removeImages[i]}`;
            console.log(filePath)  
        }
       
        


        const updateProduct = await productInfo.updateOne({ _id: data.productId }, {
            productName: data.editProductName,
            categoryIds: data.productCategory,
            description: data.productDescription,
            brandname: data.productBrandName,
            stock: data.productStock,
            price: data.productPrice,
            size: data.productSize,
            material: data.productMaterial,
            color: data.productColor,
            productImages: productImages,
            specifications: data.productSpecification,
            updateDate: new Date()

        })
        console.log(updateProduct)
        if (updateProduct.acknowledged) {

            res.json({ status: true, message: '&#9989; Succesfully edit Product' });

        } else {

            res.status(500).redirect('/admin/error500');

        }


    } catch (error) {
        console.log(error.message)
    }


}






/*####################################################### CATEGORY SECTION ROUTER FUNCTIONS ################################################*/

//***** View Categorys ***** 
const loadCategoryList = async (req, res) => {
    try {

        const categoryData = await category.find({}).sort({ list: -1,_id:-1 });
        res.render('admin/viewCategorys', { admin: true, data: categoryData, title: 'Categorylist' });

    } catch (error) {

        console.log(error.message);

    }
}


//***** Searching Category Using Category Name *****
const searchCategory = async (req, res) => {

    const search = req.body.search;
    const regex = new RegExp(`^${search}`, 'i');
    const searchData = await category.find({ categoryname: { $regex: regex } });
    res.render('admin/viewCategorys', { admin: true, data: searchData, title: 'Categorylist' });

}


//***** List/Unlist The Category Functionality and Change the CAtegoroy field "list" then Provide a message *****
const categorySatusUpdate = async (req, res) => {

    try {

        const id = req.body.categoryId;
        const categoryData = await category.findOne({_id:id});


        //*** Checking The Category State Listed / UNListed
        if (categoryData.list) {

            //*** Update DATA ***
            const storeData = await category.findOneAndUpdate(
                { _id: id },
                { $set: { list: false, listedDate: new Date() } },
                { new: true });


            //*** Send The Operation Status ***
            if (storeData) {

                res.json({ 'list': false });

            } else {
                res.status(500).render('partials/error-500')
            }

        } else {

            //*** Update DATA ***
            const storeData = await category.findOneAndUpdate(
                { _id: id },
                { $set: { list: true, listedDate: new Date() } },
                { new: true });

            //*** Send The Operation Status ***
            if (storeData) {

                res.json({ 'list': true });

            } else {

                res.status(500).render('partials/error-500')
            }

        }
        
    } catch (error) {

        console.log(error.message);

    }
}


//***** View the Add Category Page *****
const loadAddCategoryPage = (req, res) => {
    res.render('admin/addCategory', { admin: true, title: 'AddCategory' });
}


//***** Add Category Page to Retrive Data And Store to The Database and provide the message *****
const addCategory = async (req, res) => {

    try {
        const name = req.body.categoryname;
        const description = req.body.description;
        const image = req.file.filename;

        // Checking name & description is present
        if (name !='' && description != '' && image) {

            const checkData = await category.findOne({ categoryname: { $regex: new RegExp(`^${name}`, 'i') } });

            // Checking edit Category name is present in the Category database
            if (!checkData) {

                const categoryData = category({
                    categoryname: name,
                    description: description,
                    category_image: image
                });

                const dataSend = await categoryData.save();

                if (dataSend) {

                    res.json({'status':true,'message': '&#9989; Category Sucessfullly Added'});

                } else {

                    res.json({'status':false,'message': '&#10071; Category is not added try again' });

                }

            } else {

                res.json({'status':false,'message': '&#10071; Category is Already Exist' });
            }
        } else {

            res.json({'status':false,'message': '&#10071; Please Enter the Category and Description' });

        }
    } catch (error) {

        console.log(error.message);
    }
}

//***** View the Edit Page and Load the Details *****
const loadEditCategoryPage = async (req, res) => {
    
    try{

        const id = req.params.id;
        const categoryData = await category.findOne({_id:id});
        res.render('admin/editCategory', { admin: true, data: categoryData });

    }catch(error){

        console.log(error.message);
        res.redirect('admin/error500');

    }

}


//***** Update Category Values *****
const editCategory = async (req, res) => {

    try {

        console.log(req.body,req.file)
        // *** Retrieve Data Form the Body
        const name = req.body.categoryname;
        const oldName = req.body.oldCategoryName;
        const description = req.body.categoryDescription;
        const id = req.body.categoryid;
        const file = req.file;

        let image;
        if(file){
            image = req.file.filename;
        }else{
            image = req.body.oldImage;
        }
        

        //*** Check All Fields Are Exist ***
        if (name && description) {

            const dataCheck = await category.findOne({ categoryname: name });

            //*** Check The Category id Added New Name is Existing Or Not
            if (dataCheck && name != oldName) {

                res.json({'status':false, 'message': '&#10071; Edit New Category Name is Already Exist' });

            } else {

                //*** Update Category Data ***
                const dataSend = await category.updateOne({ _id: id }, { $set: { categoryname: name, category_image: image, description: description } },{upsert:true});

                //*** Check Sucess Or Not ***
                if (dataSend) {

                    res.json({'status':true,'message': '&#9989; Category Sucessfullly Updated'});

                } else {

                    res.json({'status':false, 'message': '&#10071; Category is not Updated try again' });

                }
            }

        } else {

            res.json({'status':false,'message': '&#10071; Please Enter the Category and Description' });

        }

    } catch (error) {

        console.log(error.message);

    }
}

/*================================================== END OF THE CATEGORY SECTION ROUTING FUNCTIONS ===========================================*/




/*#################################################### View New Brand & Functionality Working Routes ######################################## */

//***** View Brand Data Into a Table *****
const loadBrandViewPage = async (req, res) => {

    const brandData = await brandInfo.find({}).sort({_id:-1});
    res.render('admin/viewBrand', { admin: true, title: 'Brand Data', data:brandData});

}


//****** View New Brand Add Page *****
const loadBrandAddPage = async (req, res) => {
    res.render('admin/addBrand', { admin: true,title:'Add Brand'});
}



//******* Add Brand Data Into DataBase ******
const addBrandDetails = async(req,res) => {

    console.log('sucess')
    try{
        const name = req.body.brandName;
        const img = req.file.filename;

        if(name && img){

            const brands = await brandInfo.findOne({brand_name:name});
            console.log(brands)

            if(!brands){
                console.log('hello')
                const brandData = brandInfo({
                    brand_name: name,
                    brand_logo: img,
                    brand_addDate: new Date()
                });
                console.log(brandData)

                const sendData = await brandData.save();
                
                if(sendData){
                    res.json({'status':true,'message': '&#9989; Brand Sucessfullly Added'});

                }else{
                    res.json({'status':false,'message': '&#10071; Brand Added Failed, Try Again'});

                }

            }else{
                res.json({'status':false,'message': '&#10071; Brand is Already Exist' });

            }

        }else{
            res.json({'status':false,'message': '&#10071; Enter All Fields Then Submit' });

        }   

    }catch(error){
        console.log(error.message);
        res.redirect('adimin/error500')

    }
       

};


//***** Load Edit Brand Page ******
const loadEditBrandPage = async(req,res) =>{
    try{
        const id = req.params.id;
       
        const brandData = await brandInfo.findOne({_id:id});

        res.render('admin/editBrand',{data:brandData})
    }catch(error){

    }
}



//****** Edit Brand Details *******
const editBrandDetails = async(req,res) => {
    
    try{
        const data = req.body;
        const file = req.file;
        // console.log(data,file);

        let logoImg;
        if(file){
            logoImg = file.filename;
        }else{
            logoImg =data.brandImage;
        }

        if(file && data.brandName){

            const oldData = await brandInfo.findOne({_id:data.brandId});
            
            if(oldData && data.oldBrandName != data.brandName){
                res.json({'status':false,'message': '&#10071; Brand is Already Exist' });

            }else{
                const brandData = brandInfo({
                    brand_name: data.brandName,
                    brand_logo: file.filename,
                    brandDataUpdate_Date: new Date()
                })

                const sendData = await brandData.save();

                if(sendData){
                    res.json({'status':true,'message': '&#9989; Brand Sucessfullly Added'});
                    
                }else{
                    res.json({'status':false,'message': '&#10071; Brand Added Failed, Try Again'});
                }
            }

        }else{
            res.json({'status':false,'message': '&#10071; Enter All Fields Then Submit' });
        }

    }catch(error){
        console.log(error.message);
        res.redirect('/admin/error500')
    }
}



//****** Brand Status Update ******
const brandStatusUpdate = async(req,res) =>{
    try{
        const id = req.params.id;

        console.log(id)
        
        const brandData = await brandInfo.findOne({_id:id});
        
        if(brandData.status){

            const update = await brandInfo.updateOne({_id:id},{$set:{status:false,brand_unlistDate:new Date()}},{upsert:true});
            
            if(update.acknowledged){
                res.json({'status':false});
            }else{
                res.redirect('/admin/error500');
            }

        }else{

            const update = await brandInfo.updateOne({_id:id},{$set:{status:true,brand_unlistDate:new Date()}},{upsert:true});
            
            console.log(update)
            if(update.acknowledged){
                res.json({'status':true});
            }else{
                res.redirect('/admin/error500');
            }

        }

    }catch(error){
        console.log(error.message);
    }
}



//***** Brand Search Data ****
const searchBrandData = async(req,res) =>{

    const search = req.query.search;
    const regex = new RegExp(`^${search}.*`, 'i');

    const searchData = await brandInfo.find({ brand_name: { $regex: regex } });

    res.render('admin/viewBrand', { admin: true, title: 'Brand Data', data:searchData});
}

/*========================================================= End Of The Brand Routing ================================================= */



/*################################################### Banner Routing Functions ####################################################### */

// Load Add Banner page 
const loadAddBannerPage = (req, res) => {
    res.render('admin/addBanner', { admin: true });
}

/*========================================================= End Of The Banner Routing ================================================= */

// Load  Coupon List Window
const loadCouponList = (req, res) => {
    res.render('admin/viewCoupons', { admin: true });
}

// Load Add Coupon page 
const loadAddCouponPage = (req, res) => {
    res.render('admin/addCoupon', { admin: true });
}


// Load  Order List Window
const loadOrderList = (req, res) => {
    res.render('admin/viewOrders', { admin: true })
}



const logoutAdmin = (req, res) => {
    try {
        req.session.destroy((error) => {
            if (error) {
                console.error(message.error);
            } else {
                res.redirect('/admin/');
            }
        })
    } catch (error) {
        console.error(error.message);
    }

}


// ERROR Page Loading 
const load500ErrorPage = (req, res) => {
    res.render('partials/error-500', { link: '/admin' })
}

const load404ErrorPage = (req, res) => {
    res.render('partials/error-404', { link: '/admin' })
}

module.exports = {
    loadAdminLogin,
    verifyLogin,
    loadAdminHomepage,
    loadUserList,
    searchUser,
    blockUser,
    loadProductList,
    searchProduct,
    loadProductMoreData,
    productStatusUpdate,
    editProduct,
    loadAddProductPage,
    productAdd,
    loadEditProductPage,
    loadCategoryList,
    searchCategory,
    categorySatusUpdate,
    loadAddCategoryPage,
    loadEditCategoryPage,
    editCategory,
    loadBrandViewPage,
    loadBrandAddPage,
    addBrandDetails,
    editBrandDetails,
    loadEditBrandPage,
    brandStatusUpdate,
    searchBrandData,
    loadAddBannerPage,
    loadCouponList,
    loadAddCouponPage,
    loadOrderList,
    logoutAdmin,
    addCategory,
    load500ErrorPage,
    load404ErrorPage
}