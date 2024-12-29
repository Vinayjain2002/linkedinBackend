'use strict'

const httpStatus= require('http-status')
const sql= require('../services/sql')
const mongoose= require('mongoose')
const APIError= require('../utils/APIError')
const Job= require('../models/job')

exports.click= async(req,res,next)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.jobId)){
            throw new APIError('Invalid JobId', httpStatus.BAD_REQUEST,'Invalid JobId')
        }
        const response= {payload: {}, message : ''}
        const recuiterId= await recruiterByJobid(req.params.jobId)
        const saveJobClickPointers= {
            'jobId': req.params.jobId,
            'userId': req.user._id,
            'recuiterId': recuiterId,
            'time': new Date()
        }

        await sql.query('Insert into job_click set ?', saveJobClickPointers)
        response.message= "SUCCESS"
        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){
        next(err);
    }
}

exports.startApplication= async(req,res,next)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.jobId)){
            throw new APIError('Invalid JobId', httpStatus.BAD_REQUEST)
        }
        const response= {payload: {}, message: ''}
        const saveIncompleteJobPointers={
            'jobId': req.params.jobId,
            'userId': req.user._id,
            'time': new Date()
        }

        await sql.query('Insert into incomplete_application set ?', saveIncompleteJobPointers)
        response.message="SUCCES"
        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){
        next(err);
    }
}       

exports.profileView= async(req, res,next)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.userId)){
            throw new APIError('Invalid userId', httpStatus.BAD_REQUEST)
        }
        const response= {payload: {}, message: ''}
        const saveProfileViewPointers= {
            'viewedUserId': req.params.userId,
            'userId': req.user._id,
            'time': new Date()
        }
        await sql.query('Insert Into profile_view set ?', saveProfileViewPointers)
        response.message="SUCCESS"
        res.status(httpStatus.OK)
        res.send(response)
    
    }
    catch(err){
        next(err);
    }
}

const recruiterByJobid= async(req,res,next)=>{
    const job= await Job.findById(jobId).exec()
    return job.recruiter;
}