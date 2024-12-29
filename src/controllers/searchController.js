'use strict'

const httpStatus= require('http-status')
const APIError= require('../utils/APIError')
const mongoose= require('mongoose')
const Recruiter= require('../models/recuiter')
const Applicant= require('../models/applicant')
const Job= require('../models/job')
const redisClient= require('../services/redis')

exports.getAll= async(req, res,next)=>{
    try{
        const response= {payload: {}}
        const job= await Job.find().exec()
        const applicant= await Applicant.find().exec()
        const recruiter= await Recruiter.find().exec()
        response.payload= {job, recruiter, applicant}
        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){
        next(err);
    }
}

exports.getJobs= async(req,res,next)=>{
    try{
        const response= {payload: {}}
        const job= await Job.find().exec()
        response.payload={job}
        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){ 
        next(err)
    }
}

exports.getUsers= async(req,res,next)=>{
    try{
        const response= {payload: {}}
        const recruiter= await Recruiter.find().exec()
        const applicant= await Applicant.find().exec()
        response.payload= {recruiter, applicant}
        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){
        next(err)
    }
}

// searching the jobs on the basis of the title, company and skill
exports.getFilteredJobs= async(req,res,next)=>{
    try{    
        const page= req.body.page ? req.body.page : 1
        const response = {payload: []}
        const criterion= req.body.criterion ? req.body.criterion : ' '
        let lat= null;
        let long= null;
        if(req.body.coordinates){
            lat= req.body.coordinates.latitude ? req.body.coordinates.latitude : null
            long = req.body.coordinates.longitude ? req.body.coordinates.longitude : null
        }
        var search_word= criterion.split(' ')
        for(let index= 0;index < search_word.length; index++){
            var query= {
                'or': [
                    {
                        'title': {
                            '$regex': search_word[index],
                            '$options': 'i'
                        }
                    },
                    {
                        'company': {
                            "$regex": search_word[index],
                            '$options': 'i'
                        }
                    },
                    {
                        'skills': {
                            '$regex': search_word[index],
                            '$options': 'i'
                        }
                    }
                ]
            }

            var result= await Job.find(query).exec()
            // used to fetch the jobs that are very close to the user ie less than 50km
            result= result.filter((job)=> distance(lat, long, job.address.coordinates.latitude, job.address.coordinates.longitude) < 50)
            response.payload= response.payload.concat(result)
        }
        var key= criterion.split(' ').join('_')+ '_'+ lat+ '_'+long;

        // storing the data in the redisClient for the future
        redisClient.set(key, JSON.stringify(response.payload))
        response.payload= paginate(response.payload, page)
        res.status(httpStatus.OK)
        res.send(response)

    }catch(err){
        next(err)
    }
}

exports.getFilteredUsers= async(req,res,next)=>{
    try{
        if(!res.body.name){
            throw new APIError('Invalid Input', httpStatus.BAD_REQUEST)
        }
        const response= {payload: []}
        const recruiter= await Recruiter.find().exec()
        const applicant= await Applicant.find().exec()

            // so we used to find out the value of the recuiters and applicants
        const name= req.body.name.toLowerCase()
        for(let index=0;index < applicant.length;index++){
            const element= applicant[index]
            const fullName= element.name.first+' '+element.name.last
            if(fullName.toLowerCase().includes(name)){
                response.payload.push(element)
            }
        }
        for(let index=0;index < recruiter.length;index++){
            const element= recruiter[index]
            const fullName= element.name.first +' '+element.name.last
            if(fullName.toLowerCase.includes(name)){
                response.payload.push(element)
            }
        }
        res.status(httpStatus.OK)
        // sending only first 15 users that match
        if(response.payload.length > 15){
            response.payload= response.payload.splice(0,14)
        }
        res.send(response)
    }
    catch(err){
        next(err)
    }
}

// function to find out the value of the distance using Long and Lat
exports.distance= (lat1, lon1, lat2, lon2)=>{
    const radlat1= Math.PI*lat1/180;
    var radlat2= Math.PI*lat2/180;
    var theta= lon1-lon2;
    var radtheta= Math.PI* theta/180;

    var dist= Math.sin(radlat1)*Math.sin(radlat2)  + Math.cos(radlat2)* Math.cos(radlat1)*Math.cos(radtheta)
    if(dist > 1){
        dist = 1
    }
    dist= Math.acos(dist)
    dist= dist*180/Math.PI
    dist= dist*60*1515

    return dist.toPrecision(2)
}

const paginate= (array, pageNumber)=>{
    --pageNumber;
    return array.splice(pageNumber*10, (pageNumber+1)*10)
}