'use strict'

const httpStatus= require('http-status')
const mongoose= require('mongoose')
const APIError= require('../utils/APIError')
const User= require('../models/user')
const Recruiter= require('../models/recuiter')
const Applicant= require('../models/applicant')
const neo4jSession= require('../services/graph')

exports.getAll= async(req,res,next)=>{
    // getting all the users
    try{
        const response= {payload: {}}
        const recruiter= await Recruiter.find().exec()
        const applicant= await Applicant.find().exec()
        response.payload={applicant, recruiter}
        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){
        next(err)
    }
}

exports.getOne= async(req,res,next)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.userId)){
            throw new APIError(`Invalid UserId`, httpStatus.BAD_REQUEST) 
        }
        const response= {payload: {}}
        let user= await Applicant.findOne({id: req.params.userId}).exec()
        if(!user){
            user= await Recruiter.findOne({id: req.params.userId}).exec();
            response.payload.role= 'recruiter'
        }
        else{
            response.payload.role= 'applicant'
        }
        response.payload.user= user;
        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){
        next(err);
    }
}

exports.putOne= async(req,res,next)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.userId)){
            throw new APIError(`Invalid UserId`, httpStatus.BAD_REQUEST)
        }
        const userId= req.params.userId;
        const response= {payload: {}, message: ''}
        const userAccount= await Applicant.findOne({id: userId}).exec()
        if(!userAccount){
            throw new APIError(`No user Associated with id: ${userId}`, httpStatus.NOT_FOUND)
        }
        const role= userAccount.role;
        const user= role === 'applicant' ? Applicant : Recruiter;
        let userDetails= await User.findOne({id: userId}).exec()
        for(const key in req.body){
            if(user.schema.obj.hasOwnProperty(key) && key!= 'id' && key!== '_id'){
                userDetails[key]= req.body[key]
            }
        }
        // updated the details of the user in the userDetails
        const updatedUserDetails= await userDetails.save()
        if(updatedUserDetails){
            response.message= `SUCCESS`
            response.payload= updatedUserDetails
            res.status(httpStatus.OK)
            res.send(response)
        }
        else{
            throw new APIError(`User with id: ${userId} not updated`, httpStatus.NOT_FOUND)
        }
    }
    catch(err){
        next(err);
    }
}

exports.deleteOne= async(req,res,next)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.userId)){
            throw new APIError('Invalid UserId', httpStatus.BAD_REQUEST)
        }
        const userId= req.params.userId;
        const response= {payload: {}, message: ''}
        const userAccount= await User.findById(userId).exec()
        if(!userAccount){
            throw new APIError(`No user associated with id: ${userId}`, httpStatus.NOT_FOUND)
        }

        const role= userAccount.role;
        const user= role=== 'applicant' ? Applicant : Recruiter;
        const deleteAccount=await User.findByIdAndDelete(userId).exec()
        const deleteResult= await user.findOneAndDelete({id: userId}).exec()

        if(deleteResult && deleteAccount){
            response.message=`Deleted Successfully`
            res.status(httpStatus.OK)
            res.send(response)
        }
        else{
            throw new APIError(`user with id: ${userId} not deleted`, httpStatus.NOT_FOUND)
        }
    }
    catch(err){
        next(err);
    }
}

// left till
exports.connections= async(req,res,next)=>{

}

exports.connect= async(req,res,next)=>{

}

exports.mutual= async (req,res,next)=>{

}