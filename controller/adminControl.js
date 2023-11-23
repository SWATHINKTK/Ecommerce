const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path')
const { loginData } = require('../models/adminModel');
const { productInfo } = require('../models/productModel');
const { brandInfo } = require('../models/brandModel');
const { category } = require('../models/categoryModel');
const { userData } = require('../models/userModal');
const { query } = require('express');
const { connected, nextTick } = require('process');
const { error } = require('console');
const session = require('express-session');
const helper = require('../controller/helper')


/*---------------------------------------ADMIN ROUTER ACCESSING FUNCTIONS----------------------------------------------------------*/
async function strong(pass) {
    try {
        const x = await bcrypt.hash(pass, 10)
        return x;
    } catch (err) {
        console.log(err)
    }

}

// *** Deleting Files ***
const publicFile = path.join(__dirname, '..', 'public', 'admin', 'assets');
async function deleteFile(filePath){

    fs.unlink(filePath,(error) => {

        if(error){
            console.error(error.code);
        }else{
            console.log('Previous Image Delete Sucess');
        }

    })
}

/*---------------------------------------ADMIN LOGIN & HOME PAGE LOAD FUNTIONS---------------------------------------------------------*/

// VIEW Admin Login Page 
const loadAdminLogin = (req, res,next) => {

    try {
        if(req.query.authFailed){
            res.status(401).render('admin/login', { admin: false, style: true, title: 'Admin Login' });
            return;
        }

        res.render('admin/login', { admin: false, style: true, title: 'Admin Login' });    
    } catch (error) {    
        next(error);
    }

}

// Verify the Admin Credential and Redirect Admin Homepage
const verifyLogin = async (req, res,next) => {

    try {
        const username = req.body.username;
        const password = req.body.password;
        const adminData = await loginData.findOne({ username: username });
        if (adminData) {
            const passwordMatch = await bcrypt.compare(password, adminData.password)
            if (passwordMatch) {
                req.session.name = adminData.adminname;
                req.session.adminId = adminData._id;
                res.redirect('admin/home');
            } else {
                res.render('admin/login', { admin: false, style: true, title: 'Admin Login',message:'Enter Proper Password' });
            }
        }else{
            res.render('admin/login', { admin: false, style: true, title: 'Admin Login',message:'Enter Valid Username & Password' });
        }
    } catch (error) {
        
        next(error);
    }

}

// VIEW Admin Home Window 
const loadAdminHomepage = async(req, res, next) => {

   try {
        const sendReport = await helper.paidiagram();

        const leastProduct = await helper.leastSellingProduct();

        const pendingProduct = await helper.pendingProduct();

        const totalDataForFirstRow = await helper.totalDataFirstSection();

        const salesChart = await helper.salesChart();

        const categoryReport = await helper.totalCategorySale();

    
        res.render('admin/main', { admin: true, name: req.session.name, title: 'AdminHome' ,totalRevenue:sendReport ,pendingProduct:pendingProduct, mostSelling:leastProduct, totalData:totalDataForFirstRow ,salesChart, categoryReport});  
   } catch (error) {
        next(error);
   }
    
}






/*============================================ ADMIN USER MANAGE ROUTE FUNCTIONS =================================================*/

// ***VIEW User List Window***
const loadUserList = async (req, res, next) => {

    try {
        const user = await userData.find({}).sort({ block: 1,_id:-1 });
        res.render('admin/viewUsers', { admin: true, title: 'User Data', data: user });
    } catch (error) {
        next(error);
    }

}


// ***USER BLOCK / UNBLOCK FEATURE***
const blockUser = async (req, res, next) => {

    try {
        
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

                if(req.session.userId == id){
                    req.session.userId = null;
                }
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
                
                if(req.session.userId == id){
                    req.session.userId = null;
                }
                res.json({ 'user': true });

            } else {
                throw new Error('Updation is Not Working');
            }
        }

    } catch (error) {
        next(error);        
    }
}

// User Search
const searchUser = async (req, res, next) => {

    try {
        const search = req.query.search;
        const regex = new RegExp(`^${search}.*`, 'i');

        const searchData = await userData.find({ username: { $regex: regex } });

        res.render('admin/viewUsers', { admin: true, data: searchData, title: 'Users' });
        
    } catch (error) {
        next(error);
    }

}



/*################################################################ PRODUCT SECTION #####################################################################*/


// Load Product List Window
const loadProductList = async (req, res, next) => {

    try {
        const products = await productInfo.find({}).sort({_id:-1});
        const brandData = await brandInfo.find({},{brand_name:1});

        // console.log(products,brandData)
        // for(let brand of brandData){
        //     // if(brand._id.equals(products.brandname))
        //     //     brandData = brand.brand_name
        //     // console.log(brand.brand_name)
        // }
        
        //    for(let product of productData){
        //         for(let brand of dataBrand){
        //             if(product.brandname.equals(brand._id)){
        //                 console.log(product.productName,brand.brand_name)
        //             }
        //         }
        //     }
    
        res.render('admin/viewProducts', { admin: true, productData: products ,dataBrand:brandData});
        
    } catch (error) {
        next();
    }
}


// Load Product More Data and view in a modal
const loadProductMoreData = async (req, res, next) => {

    try {
        const id = req.params.id

        const data = await productInfo.findOne({ _id: id });
        if (data) {
            res.status(200).render('admin/productDetailModal', { modaldata: data });

        } else {
            // res.status(500).redirect('/admin/error500');
            throw new Error('Product Id Error')
        }
    } catch (error) {
        next(error);
    }


}

const searchProduct = async (req, res, next) => {
    try {
        const search = req.params.data;
        const Regex = new RegExp(`^${search}.*`, 'i');
        const productData = await productInfo.find({ productName: { $regex: Regex } });

        res.render('admin/viewProducts', { admin: true, productData: productData });
    } catch (error) {
        next(error);
    }

}

// Product Staus Update and show list and unlist button
const productStatusUpdate = async (req, res, next) => {

    try {
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
                // res.redirect('/admin/error404');
                throw new Error('Data NOt Found')
            }
        }
    } catch (error) {
        next(error);
    }
}




// Load Add Product page 
const loadAddProductPage = async (req, res, next) => {
    try {
        const categoryData = await category.find({ list: true }, { categoryname: 1 });
        const brandData = await brandInfo.find({},{brand_name:1});

        res.render('admin/addProduct', { admin: true, categorydata: categoryData ,branddata:brandData});
    } catch (error) {
        next(error)
    }
}



// Adding the Product Data into Database
const productAdd = async (req, res, next) => {

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
            // console.log(productData)
            const product = await productData.save();

            // Sucess result Checking
            if (product) {

                res.json({ status: true, message: '&#9989; Succesfully Added Product' });

            } else {

                images.forEach((file)=>{
                    let filename = file;
                    let filePath = path.join(__dirname, '..', 'public', 'admin', 'assets', 'productImages', filename);
                    deleteFile(filePath)
                })

                // res.render('/admin/error500');
                throw new Error('Server Error Data NOt Inserted')
            }

        } else {

            images.forEach((file)=>{
                let filename = file;
                let filePath = path.join(__dirname, '..', 'public', 'admin', 'assets', 'productImages', filename);
                deleteFile(filePath)
            })
            
            res.json({ status: false, message: '&#10071; Enter All Field' });
        }

    } catch (error) {
        next(error);
    }



}



// Load Edit Product page 
const loadEditProductPage = async (req, res, next) => {

    try {
        const id = req.params.id;
        const productData = await productInfo.findOne({ _id: id });

        const brandData = await brandInfo.find({},{brand_name:1})

        const categoryData = await category.find({}, { categoryname: 1 });
        res.render('admin/editProduct', { admin: true, dataCategory: categoryData, dataProduct: productData ,dataBrand:brandData });

    } catch (error) {
        next(error);
    }


}



const editProduct = async (req, res, next) => {

    try {
        const data = req.body;
        const file = req.files;


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

        // LENGTH OF THE REMOVE IMAGE
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
            deleteFile(filePath);

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
        // console.log(updateProduct)
        if (updateProduct.acknowledged) {

            res.json({ status: true, message: '&#9989; Succesfully edit Product' });

        } else {

            // res.status(500).redirect('/admin/error500');
            throw new Error('Server Error');

        }


    } catch (error) {
        next(error);
    }


}






/*####################################################### CATEGORY SECTION ROUTER FUNCTIONS ################################################*/

//***** View Categorys ***** 
const loadCategoryList = async (req, res, next) => {
    try {

        const categoryData = await category.find({}).sort({ list: -1,_id:-1 });
        res.render('admin/viewCategorys', { admin: true, data: categoryData, title: 'Categorylist' });

    } catch (error) {
            next(error)
    }
}


//***** Searching Category Using Category Name *****
const searchCategory = async (req, res, next) => {

    try {

        const search = req.body.search;
        const regex = new RegExp(`^${search}`, 'i');
        const searchData = await category.find({ categoryname: { $regex: regex } });
        res.render('admin/viewCategorys', { admin: true, data: searchData, title: 'Categorylist' });
   
    } catch (error) {
        next(error);
    }

    
}


//***** List/Unlist The Category Functionality and Change the CAtegoroy field "list" then Provide a message *****
const categorySatusUpdate = async (req, res, next) => {

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

        next(error);

    }
}


//***** View the Add Category Page *****
const loadAddCategoryPage = (req, res, next) => {
    try{
        res.render('admin/addCategory', { admin: true, title: 'AddCategory' });
    }catch(error){
        next(error);
    }
}


//***** Add Category Page to Retrive Data And Store to The Database and provide the message *****
const addCategory = async (req, res, next) => {

    try {
        const name = req.body.categoryname;
        const description = req.body.description;
        const image = req.file.filename;

        let update = true;

        // Checking name & description is present
        if (name !='' && description != '' && image) {

            const Regex = new RegExp(`^${name}$`, 'i') ;
            const checkData = await category.findOne({ categoryname: { $regex: Regex } });

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

                    update = false;

                }

            } else {

                res.json({'status':false,'message': '&#10071; Category is Already Exist' });

                update = false;
            }
        } else {

            res.json({'status':false,'message': '&#10071; Please Enter the Category and Description' });

            update = false;

        }

        // *** NOT UPDATED DELETE MULTER UPLOAD IMAGE ***
        if(!update){

            const filename = image;
            const filePath = path.join(__dirname, '..', 'public', 'admin', 'assets', 'categoryImages', filename);
            deleteFile(filePath);
        }

    } catch (error) {
        next(error);
    }
}

//***** View the Edit Page and Load the Details *****
const loadEditCategoryPage = async (req, res, next) => {
    
    try{

        const id = req.params.id;
        const categoryData = await category.findOne({_id:id});
        res.render('admin/editCategory', { admin: true, data: categoryData });

    }catch(error){
        next(error);
    }

}


//***** Update Category Values *****
const editCategory = async (req, res, next) => {

    try {

        // *** Retrieve Data Form the Body
        const name = req.body.categoryname;
        const oldName = req.body.oldCategoryName;
        const description = req.body.categoryDescription;
        const id = req.body.categoryid;
        const file = req.file;

        let image;
        if(file){
            image = req.file.filename;

            const filename = req.body.oldImage;
            const filePath = path.join(__dirname, '..', 'public', 'admin', 'assets', 'categoryImages', filename);
            deleteFile(filePath);

        }else{
            image = req.body.oldImage;
        }
        

        //*** Check All Fields Are Exist ***
        if (name && description) {
        
            const Regex = new RegExp(`^${name}$`, 'i') ;
            const dataCheck = await category.findOne({ categoryname: { $regex: Regex } });

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
        next(error);
    }
}

/*================================================== END OF THE CATEGORY SECTION ROUTING FUNCTIONS ===========================================*/




/*#################################################### View New Brand & Functionality Working Routes ######################################## */

//***** View Brand Data Into a Table *****
const loadBrandViewPage = async (req, res, next) => {
    try {
        const brandData = await brandInfo.find({}).sort({_id:-1});
        res.render('admin/viewBrand', { admin: true, title: 'Brand Data', data:brandData});

    } catch (error) {
        next(error);
    }
}


//****** View New Brand Add Page *****
const loadBrandAddPage = async (req, res, next) => {
    try {
        res.render('admin/addBrand', { admin: true,title:'Add Brand'});
    } catch (error) {
        next(error);
    }
}



//******* Add Brand Data Into DataBase ******
const addBrandDetails = async(req, res, next) => {

    try{
        const name = req.body.brandName;
        const img = req.file.filename;

        let update = true;

        if(name && img){

            const brands = await brandInfo.findOne({brand_name:{ $regex: new RegExp(`^${name}$`, 'i') }});

            if(!brands){
           
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

                update = false
                res.json({'status':false,'message': '&#10071; Brand is Already Exist' });

            }

        }else{

            update = false;
            res.json({'status':false,'message': '&#10071; Enter All Fields Then Submit' });

        }   

        if(!update){

            const filename = img;       
            const filePath = path.join(__dirname, '..', 'public', 'admin', 'assets', 'brandImages', filename); 
            deleteFile(filePath);
        }

    }catch(error){
        next(error);
    }
       

};


//***** Load Edit Brand Page ******
const loadEditBrandPage = async(req,res, next) =>{
    try{
        const id = req.params.id;
       
        const brandData = await brandInfo.findOne({_id:id});

        res.render('admin/editBrand',{data:brandData})
    }catch(error){
        next(error);
    }
}



//****** Edit Brand Details *******
const editBrandDetails = async(req, res, next) => {
    
    try{
        const data = req.body;
        const file = req.file;
        // console.log(data,file);

        let logoImg;
        if(typeof file == 'object'){

            logoImg = file.filename;

            const filename = data.brandImage;
            const filePath = path.join(__dirname, '..', 'public', 'admin', 'assets', 'brandImages', filename);
            deleteFile(filePath);

        }else{
            logoImg = data.brandImage;
        }

  
        if(logoImg && data.brandName){

            const brands = await brandInfo.findOne({brand_name:{ $regex:new RegExp(`^${data.brandName}$`, "i") }});
            
            if(brands && data.oldBrandName != data.brandName){
                res.json({'status':false,'message': '&#10071; Brand is Already Exist' });

            }else{

                const brandData = await brandInfo.updateOne({_id:data.brandId},
                    {$set:{
                        brand_name: data.brandName,
                        brand_logo: logoImg,
                        brandDataUpdate_Date: new Date()
                    }},{upsert:true})
                    
               

                if(brandData){
                    res.json({'status':true,'message': '&#9989; Brand Sucessfullly Added'});
                    
                }else{
                    res.json({'status':false,'message': '&#10071; Brand Added Failed, Try Again'});
                }
            }

        }else{
            res.json({'status':false,'message': '&#10071; Enter All Fields Then Submit' });
        }

    }catch(error){
        next(error);
    }
}



//****** Brand Status Update ******
const brandStatusUpdate = async(req, res, next) =>{
    try{
        const id = req.params.id;
        
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
            
            if(update.acknowledged){
                res.json({'status':true});
            }else{
                throw new Error('Server Error')
            }

        }

    }catch(error){
        next(error);
    }
}



//***** Brand Search Data ****
const searchBrandData = async(req, res, next) =>{

    try {
        const search = req.query.search;
        const regex = new RegExp(`^${search}.*`, 'i');

        const searchData = await brandInfo.find({ brand_name: { $regex: regex } });

        res.render('admin/viewBrand', { admin: true, title: 'Brand Data', data:searchData});
    } catch (error) {
        next(error);
    }
}

/*========================================================= End Of The Brand Routing ================================================= */





/*========================================================= End Of The Banner Routing ================================================= */

// Load  Coupon List Window
const loadCouponList = (req, res, next) => {
    try {
        res.render('admin/viewCoupons', { admin: true });
    } catch (error) {
        next(error);
    }
}

// Load Add Coupon page 
const loadAddCouponPage = (req, res, next) => {
    try {
        res.render('admin/addCoupon', { admin: true });   
    } catch (error) {
        next(error);
    }
}


// // Load  Order List Window
// const loadOrderList = (req, res) => {
//     res.render('admin/viewOrders', { admin: true })
// }



const logoutAdmin = (req, res, next) => {
    try {
        req.session.destroy((error) => {
            if (error) {
                console.error(message.error);
            } else {
                res.redirect('/admin/');
            }
        })
    } catch (error) {
        next(error);
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
    loadCouponList,
    loadAddCouponPage,
    // loadOrderList,
    logoutAdmin,
    addCategory,
    load500ErrorPage,
    load404ErrorPage
}