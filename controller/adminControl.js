const bcrypt = require('bcrypt');
const fs = require('fs');
const { loginData, category, productInfo,brandInfo } = require('../models/adminModel');
const { userData } = require('../models/userModal');
const { query } = require('express');
const { connected } = require('process');


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
                res.send("Invalid Data");
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
    const user = await userData.find({}).sort({ block: 1 });
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



/*----------------------------------------- PRODUCT SECTION-----------------------------------------------------------*/


// Load Product List Window
const loadProductList = async (req, res) => {

    const product = await productInfo.find({});
    res.render('admin/viewProducts', { admin: true, data: product });

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
        res.render('admin/viewProducts', { admin: true, data: productData });
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
    res.render('admin/addProduct', { admin: true, data: categoryData });
}



// Adding the Product Data into Database
const productAdd = async (req, res) => {

    try {

        // Taken Data Come Form Clent 
        const data = req.body;

        const images = [];
        req.files.forEach((file) => {
            images.push(file.filename)
        });


        const length = Object.keys(data).length;

        let condition = (data.productname !== '' && data.categorys !== '' && data.description !== '' && data.brandname !== '' && data.stock !== '' && data.price !== '' && data.size !== '' && data.material !== '' && data.color !== '' && data.specification !== '');
        // checking All Field entered or not 
        if (condition && images.length == 4) {

            const productData = productInfo({
                productName: data.productname,
                categorys: data.categorys,
                description: data.description,
                brandname: data.brandname,
                stock: data.stock,
                price: data.price,
                size: data.size,
                material: data.material,
                color: data.color,
                productImages: images,
                specifications: data.specification,
                addDate: new Date(),
            })

            console.log(productData)
            const product = await productData.save();

            // Sucess result Checking
            if (product) {
                res.status(200).json({ status: true, message: 'Succesfully Added Product' });
            } else {
                res.status(500).render('/admin/error500');
            }

        } else {
            // Error message and Eror staus code
            if (!condition) {
                res.json({ status: false, message: 'Enter All Field' });

            } else {
                res.json({ status: false, message: 'Upload All Images' });
            }
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
        res.render('admin/editProduct', { admin: true, dataCategory: Data, data: productData });

    } catch (error) {
        console.log(error.message)
    }


}



const editProduct = async (req, res) => {

    try {
        const data = req.body;
        const file = req.files;

        console.log(data)

        // Updating the Images and Deleting the old images
        let image = [];
        let j = 0;

        // Admin Update the image it will be working other wise else to store the old image values.
        if (data.imageUpdatePosition) {

            data.imageOld.forEach((val, i) => {
                if (data.imageUpdatePosition.includes(i)) {

                    // Deleting the old images from my file.
                    let filePath = `../public/admin/assets/productImages/${image[i]}`;
                    fs.unlink(filePath, (error) => {
                        if (error) {
                            console.log(error.message);
                        } else {
                            console.log('sucess')
                        }
                    })

                    image[i] = file[j].filename
                    j++;

                } else {
                    image[i] = data.imageOld[i]
                }
            })
        } else {
            image = [...(data.imageOld)]
        }

        // Checking Length of the body data
        // const length =  Object.keys(data).length;
        // console.log(length);

        let condition = (data.productname !== '' && data.categorys !== '' && data.description !== '' && data.brandname !== '' && data.stock !== '' && data.price !== '' && data.size !== '' && data.material !== '' && data.color !== '' && data.specification !== '');


        // checking All Field entered or not 
        if (condition && image.length == 4) {

            const updateProduct = await productInfo.updateOne({ _id: data.id }, {
                productName: data.productname,
                categorys: data.categorys,
                description: data.description,
                brandname: data.brandname,
                stock: data.stock,
                price: data.price,
                size: data.size,
                material: data.material,
                color: data.color,
                productImages: image,
                specifications: data.specification,
                updateDate: new Date()

            })
            if (updateProduct.acknowledged) {
                res.status(200).json({ 'status': true });

            } else {
                res.status(500).redirect('/admin/error500');
            }

        } else {
            // Error message and Eror staus code
            res.json({ status: false });

        }

    } catch (error) {
        console.log(error.message)
    }


}






/*================================================ CATEGORY SECTION ROUTER FUNCTIONA==================================================*/

//***** View Categorys ***** 
const loadCategoryList = async (req, res) => {
    try {

        const categoryData = await category.find({}).sort({ list: -1 });
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

        // Checking name & description is present
        if (name && description) {

            const checkData = await category.findOne({ categoryname: { $regex: new RegExp(`^${name}`, 'i') } });

            // Checking edit Category name is present in the Category database
            if (!checkData) {

                const categoryData = category({
                    categoryname: name,
                    description: description
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

        // *** Retrieve Data Form the Body
        const name = req.body.categoryname;
        const oldName = req.body.oldCategoryName;
        const description = req.body.description;
        const id = req.body.categoryId;

        //*** Check All Fields Are Exist ***
        if (name && description) {

            const dataCheck = await category.findOne({ categoryname: name });

            //*** Check The Category id Added New Name is Existing Or Not
            if (dataCheck && name != oldName) {

                res.json({'status':false, 'message': '&#10071; Edit New Category Name is Already Exist' });

            } else {

                //*** Update Category Data ***
                const dataSend = await category.updateOne({ _id: id }, { $set: { categoryname: name, description: description } });

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



/*===============================================View New Brand & Functionality Working Routes=========================================== */
const loadBrandViewPage = async (req, res) => {
    res.render('admin/viewBrand', { admin: true, title: 'Brand Data' });
}

const loadBrandAddPage = async (req, res) => {
    res.render('admin/addBrand', { admin: true,title:'Add Brand'});
}

const addBrand = async(req,res) => {
    try{

        // console.log(req.body,req.file)
        const name = req.body.brandName;
        const img = req.file.filename;
        console.log(name,img)

        

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






// Load Add Banner page 
const loadAddBannerPage = (req, res) => {
    res.render('admin/addBanner', { admin: true });
}

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
    addBrand,
    loadAddBannerPage,
    loadCouponList,
    loadAddCouponPage,
    loadOrderList,
    logoutAdmin,
    addCategory,
    load500ErrorPage,
    load404ErrorPage
}