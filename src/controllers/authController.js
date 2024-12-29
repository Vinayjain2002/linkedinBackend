'use strict'

const User= require('../models/user')
const Recruiter= require('../models/recuiter')
const Applicant= require('../models/applicant')
const jwt= require('jsonwebtoken')

const config= require('../config/index')
const httpStatus= require('http-status')

// creating the user as well as the applicant or the recruiter
exports.register= async(req,res,next)=>{
    try{
        const userData= req.body;
        const user= new User(userData)
        const savedUser= await user.save()
        userData.id= savedUser.id;
        const userDetails= savedUser.role=== 'recruiter'? new Recruiter(userData): new Applicant(userData)
        const savedUserDetails= await userDetails.save();
        // transform is used to fetch out the necessary data like except the password
        const response= {
            account: savedUser.transform(),
            details: savedUserDetails.transform()
        }
        res.status(httpStatus.CREATED)
        res.send(response)
    }
    catch(err){
        return next(User.checkDuplicateEmailError(error))
    }
}

exports.login= async(req,res,next)=>{
    try{
        const user= await User.findAndGenerateToken(req.body)
        const payload= {sub: user.id, role: user.role}
        const token= jwt.sign(payload, config.secret)
        return res.json({message: 'OK', token: token});
    }
    catch(err){
        next(err);
    }
}