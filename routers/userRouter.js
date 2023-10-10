const express = require('express');
const { models } = require('mongoose');
const userRouter = express();

userRouter.get('/',(req,res)=>{
    res.render('user/userSignup',{admin:false});
})


module.exports = userRouter;