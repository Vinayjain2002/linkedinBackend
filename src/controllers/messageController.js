'use strict'
const httpStatus= require('http-status')
const mongoose= require('mongoose')
const APIError= require('../utils/APIError')
const Recruiter= require('../models/recuiter')
const Applicant= require('../models/applicant')
const Thread= require('../models/conversation')
const sql= require('../services/sql')

// creating a new message
exports.newThread= async(req,res,next)=>{
    try{
        const response= {payload: {}}
        if(!mongoose.Types.ObjectId.isValid(req.body.to)){
            throw new APIError('Invalid user id',httpStatus.BAD_REQUEST)
        }
        // name in the lexical order
        const first_participant= req.user._id > req.body.to ? req.user.to : req.body._id
        const second_participant= req.user._id > req.body.to ? req.user._id : req.body.to
        const result= await Thread.findOne({first_participant, second_participant}).exec()

        if(result){
            response.payload= result;
        }
        else{
            const thread= new Thread({first_participant, second_participant})
            const newThread= await thread.save()
            const conversationPointers= {
                'thread_id': newThread._id,
                'user_id': newThread.first_participant
            }

            await sql.query('INSERT INTO conversation SET ?', conversationPointers)
            newThread= newThread.second_participant;
            conversationPointers.user_id= newThread;
            await sql.query('INSERT INTO conversation SET ?', conversationPointers)
            response.payload= newThread
        }
        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){
        next(er);
    }
}

// getting all the chats of the users
exports.getInbox= async(req,res,next)=>{
    try{
        const response= {payload: []}
        const User= req.user.role === 'applicant' ? Applicant: Recruiter
        const currentUser= await User.findOne({id: req.user._id}).exec()
        // getting the list of all the chats
        const threadList= await sql.query(`Select * FROM conversation WHERE user_id= ${currentUser._id}`)
        for(let index= 0; index< threadList.length; index++){
            const element= threadList[index]
            const thread= await Thread.findById({id: element.thread_id}).exec()
            const recieverId= thread.first_participant +'' === req.user._id ? thread.second_participant : thread.first_participant
            const recieverApplicant= await Applicant.findOne({id: recieverId}).exec()
            const recieverRecruiter= await Recruiter.findOne({id: recieverId}).exec()
            
            const reciever= recieverApplicant === null ? recieverRecruiter : recieverApplicant
            const threadData= {
                thread,
                sender: currentUser.identityTransform(),
                reciever: reciever.identityTransform()
            }
            response.payload.push(threadData)
        }
        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){
        next(err);
    }
}

exports.getOne= async(req,res,next)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.threadId)){
            throw new APIError(`Invalid Credentials`,httpStatus.BAD_REQUEST);
        }
        const response= {payload: {}}
        const thread= await Thread.findById(req.params.threadId).exec()
        response.payload= thread;
        res.status(httpStatus.OK)
        res.send(response)
    }
    catch(err){
        next(err);
    }
}

// updating the data of the only one present message
exports.putOne= async(req,res,next)=>{
   try{
        if(!mongoose.Types.ObjectId.isValid(req.params.threadId)){
            throw new APIError(`Invalid ThreadId`, httpStatus.BAD_REQUEST)
        }
        const response= {payload: {}}
        const thread= await Thread.findById(req.params.threadId).exec()

        const message= {
            sender: req.user._id,
            body: req.body.message
        }
        thread.history.push(message)
        const newThread= await thread.save()
        response.payload = newThread;
        res.status(httpStatus.OK)
        res.send(response)
   }
   catch(err){
    next(err);
   }
}