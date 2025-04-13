const express=require('express');
const Router=express.Router();
const jsonwebtoken=require('jsonwebtoken');
const User=require('../models/UserModel');

Router.get('/check',async(req,res)=>{
    const token=req.cookies?.jwt;
    // console.log(token);
    
    if(!token){
        return res.status(401).json({authenticated:false});
    }
    try{
        const decoded=jsonwebtoken.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded._id);
        if(!user){
            return res.status(401).json({authenticated:false});
        }
        res.status(200).json({authenticated:true});
    }catch(err){
        console.error(err);
        res.status(401).json({authenticated:false});
    }


});

module.exports=Router;
