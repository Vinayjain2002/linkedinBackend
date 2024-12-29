'use strict'

const httpStatus= require('http-status')
const sql= require('../services/sql')
const mongoose= require('mongoose')
const Job= require('../models/job')


exports.generateDashBoardData= async(req,res,next)=>{
    try{
        const response= {payload: {}, message: ""}
        if(req.user.role==="applicant"){
            response.payload= {
                profileViewGraph: await profileViewGraph(req.user._id),
                appliedCount: await appliedCount(req.user._id),
                savedCount: await savedCount(req.user._id),
                viewedCount: await viewedCount(req.user._id)
            };
        }
        // the person is a recuiter and generating the dashboard repot for the Recruiter
        else{
            response.payload= {
                // hotJovGraph: these are the most applied 5 jobs
                hotJobGraph: await hotJobGraph(req.user._id),
                // these are the least applied 5 jobs
                coldJobGraph: await coldJobGraph(req.user._id),
                cityHotJobGraph: await getCityHotJobGraph(req.user._id),
                clickOnJobGraph: await clickOnJobGraph(req.user._id),
                savedCount: await savedCountRecruiter(req.user._id),
                incompleteCount: await incompleteCountRecruiter(req.user._id),
                totalCount: 0
            }
            response.payload.totalCount= response.payload.savedCount + response.payload.incompleteCount;
        }

        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){
        next(err);
    }
}

exports.getCityHotJobGraph= async(req,res,next)=>{
    const objecID= mongoose.Types.ObjectId;
    var query= {
        'recruiter': new objecID(recruiter_id)
    }
    const jobsOfRecuiter= await Job.find(query)
    var result={}
    for(let index=0;index < jobsOfRecuiter.length; index++){
        var job_id= jobsOfRecuiter[index]['_id']
        var job_title= jobsOfRecuiter[index]['title']
        var noOfApplications= await sql.query(`Select count(*) as count from job_application where job_id= ${job_id}`)
        console.log(noOfApplications)
        if(result.hasOwnProperty(jobsOfRecuiter[index].address.city)){
            result[jobsOfRecuiter[index].address.city].push([job_id, job_title, noOfApplications[0].count])
        }
        else{
            result[jobsOfRecuiter[index].address.city]= [[job_id, job_title, noOfApplications[0].count]]

        }
    }
    function Comparator(a, b){
        if(a[2] < b[2]){
            return 1;
        }
        if(a[2] > b[2]){
            return -1;
        }
        return 0;
    }

    for(let key in result){
        result[key]= result[key].sort(Comparator);
    }
    return result;
}

// jobs applied by the user
const appliedCount= async(applicantId)=>{
    const applied= await sql.query(`SELECT count(*) as count from job_application where applicant_id = ${applicantId}`)
    return applied[0].count;
}

const savedCount= async(applicantId)=>{
    const saved= await sql.query(`SELECT count(*) as count from saved_jobs where applicant_id= ${applicantId}`)
    return saved[0].count;
}

const viewedCount= async(applicantId)=>{
    const viewed= await sql.query(`SELECT count(*) as count from profile_view where viewedUserId = ${applicantId}`)
    return viewed[0].count;
}

const profileViewGraph= async(applicantId)=>{
    const viewsVsDate = await sql.query(`SELECT COUNT(*) as count, DATE(profile_view.time) as datetime FROM profile_view WHERE viewedUserId = '${applicantId}' AND time BETWEEN NOW() - INTERVAL 30 DAY AND NOW() GROUP BY datetime`)
    return viewsVsDate;
}

// 5 most applied jobs by a recruiter
const hotJobGraph= async(recruiterId)=>{
    const hotJob = await sql.query(`SELECT job_id as jobId, COUNT(DISTINCT application_id) as count FROM job_application where recruiter_id = '${recruiterId}' group by job_id order by count desc LIMIT 10;`)
    for(let index=0;index < hotJob.length;index++){
        const element= hotJob[index]
        hotJob[index].jobTitle= await getJobTitleById(element.jobId)
    }
    return hotJob;
}   

// this is gonna to be 5 least common Jobs
const coldJobGraph= async(recruiterId)=>{
    const coldJob= await sql.query(`SELECT job_id as jobId, count(DISTINCT application_id) as count from job_application where recruiter_id= ${recruiterId}  group by job_id order by count asc LIMIT 5;`)
    for(let index=0;index < coldJob.length;index++){
        const element= coldJob[index]
        coldJob[index].jobTitle= await getJobTitleById(element.jobId)
    }
    return coldJob;
}

const clickOnJobGraph= async(recruiterId)=>{
    const clickOnJob = await sql.query(`SELECT COUNT(*) as count, DATE(job_click.time) as datetime FROM job_click WHERE recruiterId = '${recruiterId}' AND time BETWEEN NOW() - INTERVAL 30 DAY AND NOW() GROUP BY datetime`)
    return clickOnJob;
}

const jobsByRecruiter= async(recruiterId)=>{
    const jobList= await Job.find({recruiter: recruiterId}).exec()
    const jobIdList=[]
    for(let index=0;index < jobList.length; index++){
        const element= jobList[index]
        jobIdList.push(element._id)
    }
    return jobIdList;
}

const savedCountRecruiter= async(recruiterId)=>{
    let count=0;
    let jobIdList= await jobsByRecruiter(recruiterId);
    for(let index=0;index < jobIdList.length; index++){
        const jobId= jobIdList[index]
        const saved= await sql.query(`Select count(*) as count from saved_jobs where job_id= ${jobId}`)
        count += saved[0].count;
    }
}

// find count of all incomplete jobs by recruiter
const incompleteCountRecruiter= async(recruiterId)=>{
    let count =0;
    let jobIdList= await jobsByRecruiter(recruiterId)
    for(let index=0;index < jobIdList.length; index++){
        const jobId= jobIdList[index]
        const saved= await sql.query(`Select count(*) as count from incomplete_application where jobId= ${jobId}`)
        count +=saved[0].count;
    }
    return count;
}

const getJobTitleById= async(jobId)=>{
    const job= await Job.findById(jobId).exec()
    return job ? job.title : ""
}