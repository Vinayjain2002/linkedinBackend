'use strict '

const httpStatus= require('http-status')
const mongoose= require('mongoose')
const sql = require('../services/sql')
const APIError= require('../utils/APIError')
const Job= require('../models/job')
const Applicant= require('../models/applicant')
const redisClient= require('../services/redis')


// finding all the jobs that are present
exports.get= async(req,res,next)=>{
    try{
        const response= {payload: {}}
        const jobs= await Job.find().exec()
        response.payload= jobs
        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){
        next(err);
    }
}

exports.post= async(req,res,next)=>{
    try{
        if(req.user.role !== 'recruiter'){
            throw new APIError('Unauthorized only Recruiter can create a job', httpStatus.UNAUTHORIZED)
        }
        const response= {payload: {}}
        req.body.recruiter= req.user._id
        const job= new Job(req.body)
        const createdJob= await job.save()
        if(!createdJob){
            throw new APIError('JOB not created', httpStatus.INTERNAL_SERVER_ERROR)
        }
        response.payload= createdJob
        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){
        next(err);
    }
}

//getting one of the Jobs using JobId
exports.getOne= async(req,res,next)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.jobId)){
            throw new APIError('Invalid Job Id', httpStatus.BAD_REQUEST)
        }
        const response= {payload: {}}
        const job= await Job.findById(req.params.jobId).exec()
        response.payload= job;
        res.status(httpStatus.OK)
        res.send(response);
    }
    catch(err){
        next(err);
    }
}

exports.jobsByRecruiter= async(req,res,next)=>{
    try{
        console.log(req.user._id)
        const response= {payload: []}
        const ObjectId= mongoose.Types.ObjectId;
        var query={
            "recruiter": new ObjectId(req.user._id)
        }
        const jobs= await Job.find(query)
        for(let index=0;index< jobs.length;index++){
            var job_id= jobs[index]['_id'];
            var application_count= await sql.query(`Select count(*) as count from job_application where job_id= ${job_id}`)
            var save_count= await sql.query(`Select count(*) as count from saved_job where job_id= ${job_id}`)

            var convertedJobJSON= JSON.parse(JSON.stringify(jobs[index]))
            convertedJobJSON.application_count= application_count[0].count;
            convertedJobJSON.save_count= save_count[0].count;
            response.payload.push(convertedJobJSON)
        }
        res.status(httpStatus.OK)
        res.send(response)
    }   
    catch(err){
        next(err);
    }
}

exports.putOne= async(req,res,next)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.jobId)){
            throw new APIError('Invalid Job Id', httpStatus.BAD_REQUEST)
        }
        const response= {payload: {}, message: ''}
        const jobId= req.params.jobId;
        const job= await Job.findById(jobId).exec()
        if(!job){
            throw new APIError( `No Job associated with id: ${jobId}`, httpStatus.NOT_FOUND)
        }
        for(const key in req.body){
            if(job.schema.obj.hasOwnProperty(key) && key!= 'id' && key!= '_id' && key!= 'recruiter'){
                job[key]= req.body[key]
            }
        }
        const updatedJob= await job.save();
        if(updatedJob){
            response.message= 'Job Updated Successfully'
            response.payload= updatedJob
        }else{
            throw new APIError(`Job with id: ${jobId} not updated`, httpStatus.NOT_FOUND)
        }
        res.status(httpStatus.OK)
        res.send(response)

    }
    catch(err){
        next(err);
    }
}

exports.deleteOne= async(req,res,next)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.jobId)){
            throw new APIError(`Invalid JobId`, httpStatus.BAD_REQUEST)
        }
        const response= {payload: {}, message: ''}
        const deleteJob= await Job.findByIdAndDelete(req.params.jobId).exec()
        if(deleteJob){
            response.message= 'Job Deleted Successfully'
            res.status(httpStatus.OK)
            res.send(response)
        }
        else{
            throw new APIError(`Job with id: ${req.params.jobId} not deleted`, httpStatus.NOT_FOUND)
        }
    }
    catch(err){
        next(err);
    }
}

// we only taking to store the 12 response in the recommendated Jobs
exports.recommendation= async(req,res,next)=>{
    try{
        const user= await Applicant.findOne({id: req.user._id}).exec()
        const skills= user.skills ? user.skills : []
        const response= {payload: []}
        const jobs= await Job.find().exec()
        let passesCriteria= false;
        for(let index=0, addCount=0; index< jobs.length ; index++){
            const element= jobs[index]
            if(skills.length > 0 && element.skills){
                passesCriteria= false;
                skills.forEach((skill)=>{
                    if(element.skills.includes(skill)){
                        passesCriteria= true;
                    }
                })
            }
            if(passesCriteria && addCount < 12){
                response.payload.push(element);
                jobs.slice(index, 1)
                addCount++;
            }
        }
        if(response.payload.length < 12){
            let lat= null;
            let long= null
            if(user.address){
                if(user.address.coordinates){
                    lat= user.address.coordinates.latitude ? user.address.coordinates.latitude : null
                    long= user.address.coordinates.longitude ? user.address.coordinates.longitude : null
                }
                for(let index=0;index < jobs.length ; index++){
                    const element= jobs[index]
                    passesCriteria= false;
                    if(lat && long && passesCriteria){
                        passesCriteria= distance(lat,long, element.address.coordinates.latitude, element.address.coordinates.longitude) < 50
                    }
                    if(passesCriteria){
                        response.payload.push(element);
                        jobs.slice(index, 1)
                    }
                }
            }
        }
        if(response.payload.length < 12){
            for(let index=0; index < jobs.length && index < 10; index++){
                const element= jobs[index]
                response.payload.push(element)
                jobs.splice(index, 1)
            }
        }

        redisClient.set(req.user._id, JSON.stringify(response.payload))
        res.status(httpStatus.OK)
        res.send(response)
    }catch(err){
        next(err);
    }
}

const distance= (lat1, lon1, lat2, lon2)=>{
    var radlat1 = Math.PI * lat1 / 180
  var radlat2 = Math.PI * lat2 / 180
  var theta = lon1 - lon2
  var radtheta = Math.PI * theta / 180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
  if (dist > 1) {
    dist = 1
  }
  dist = Math.acos(dist)
  dist = dist * 180 / Math.PI
  dist = dist * 60 * 1.1515
  return dist.toPrecision(2)
}