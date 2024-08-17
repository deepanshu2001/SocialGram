import bcrypt from 'bcrypt'
import mongoose from 'mongoose';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'
export const register=async(req,res)=>{
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
          }=req.body;
          const hash=await bcrypt.genSalt();
          const hashedPassword=await bcrypt.hash(password,hash);
          const saved_user=new User({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            picturePath,
            friends,
            location,
            occupation,
          })
          await saved_user.save();
          res.status(201).json(saved_user);
    }catch(err){
        res.status(500).json({msg:err.message})
    }
   

}

export const login=async(req,res)=>{
    try{
       const {email,password}=req.body;
       const user=await User.findOne({email});
       if(!user){
        return res.status(401).json({msg:'Email does not exits!!!'});
       }
       const hashedPassword=user.password;
       const match=await bcrypt.compare(password,hashedPassword);
       if(!match){
        return res.status(401).json({msg:'Passwords do not match!!!'});
       }
       const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
       const Obj= user.toObject()
       delete Obj.password
       return res.status(200).json({token,user:Obj})
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}