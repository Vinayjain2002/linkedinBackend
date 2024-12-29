'use strict'

const httpStatus= require('http-status')
const sql= require('../services/sql')
const mongoose= require('mongoose')
const APIError= require('../utils/APIError')
const Job= require('../models/job')
const Applicant= require('../models/applicant')
const Application= require('../models/application')

exports.apply= async(req,res,next)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.jobId)){
            throw new APIError(`Invalid JobId`,httpStatus.BAD_REQUEST )
        }
        const response= {payload: {}}
        const applicationData= req.body;
        applicationData.jobId= req.params.jobId;
        const previouslyApplied= await sql.query(`Select count(*) as count from job_application where applicant_id= ${req.user._id} and job_id=${applicationData.jobId}`)
        if(previouslyApplied[0].count>0){
            throw new APIError(`User already applied for the job`, httpStatus.BAD_REQUEST)
        }
        const jobData= await Job.findById(req.params.jobId).exec()
        if(!jobData){
            throw new APIError(`Invalid JobId`,httpStatus.INTERNAL_SERVER_ERROR)
        }

        applicationData.recruiterId = jobData.recruiter;
        applicationData.applicantId= req.user._id;
        const application = new Application(applicationData)
        const savedApplication= await application.save()
        if(!savedApplication){
            throw new APIError(`Job not created`, httpStatus.INTERNAL_SERVER_ERROR)
        }
        const applicationPointers= {
            'job_id': savedApplication.jobId,
            'applicant_id': savedApplication.applicantId,
            'recruiter_id': savedApplication.recruiterId,
            'application_id': savedApplication._id
        }

        await sql.query('Insert into job_application set ?', applicationPointers)
        await deleteIncompleteApplicaiton(applicationPointers.applicant_id, applicationPointers.job_id);
        response.payload= savedApplication;
        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){
        next(err)
    }
}

exports.save= async(req,res,next)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.jobId)){
            throw new APIError(`Invalid JobId`, httpStatus.BAD_REQUEST)
        }
        const response= {payload: {}, message: ''}
        const saveJobPointers= {
            'job_id': req.params.jobId,
            'applicant_id': req.user._id,
        };
        const currentValues= await sql.query(`Select * from saved_job where applicant_id= ${saveJobPointers.applicant_id} and job_id=${saveJobClickPointers.job_id}`)
        if(currentValues.length > 0){
            throw new APIError('Job Already saved', httpStatus.INTERNAL_SERVER_ERROR)
        }
        const queryOutput= await sql.query('Insert into saved_job set ?', saveJobPointers)
        if(!queryOutput){
            throw new APIError(`Job not saved`, httpStatus.INTERNAL_SERVER_ERROR)
        }

        response.message= 'SUCCESS'
        res.status(httpStatus.OK)
        res.send(response)
    }catch(err){
        next(err)
    }
}

exports.unsave= async(req,res,next)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.jobId)){
            throw new APIError('Invalid jobId', httpStatus.BAD_REQUEST)
        }
        const response={payload: {}, message: ''}
        const saveJobPointers={
            'job_id': req.params.jobId,
            'applicant_id': req.user._id,
        }

        const currentValues= await sql.query(`Delete from saved_job where job_id= ${saveJobPointers.job_id} and applicant_id=${saveJobPointers.applicant_id}`)
        if(currentValues.affectedRows > 1){
            response.message= 'SUCCESS'
        }
        else{
            response.message= 'FAILED'
        }

        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){
        next(err);
    }
}

exports.fetchSavedCount= async(req,res,next)=>{
    try{
        const response= {payload: 0}
        const savedJobs= await sql.query(`Select * from saved_job where applicant_id= ${req.user._id}`)
        response.payload= savedJobs.length
        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){
        next(err);
    }
}

exports.getApplicationDetails= async(req,res,next)=>{
    try{    
        if(!mongoose.Type.ObjectId.isValid(req.params.jobId)){
            throw new APIError('Invalid jobId', httpStatus.BAD_REQUEST)
        }
        const response= {payload: []}
        const ObjectId= mongoose.Types.ObjectId
        var jobId= req.params.jobId;
        var query= {
            'jobId': new ObjectId(jobId)
        }

        var applications= await Application.find(query)
       
    }catch(err){
        next(err);
    }
}

exports.fetchSaved= async(req,res,next)=>{

}

exports.fetchAppliedCount= async(req,res,next)=>{

}

exports.fetchApplied= async(req,res,next)=>{

}

exports.easyApply= async(req,res,next)=>{

}

const deleteIncompleteApplicaiton= async(applicationId)=>{
    
}