'use strict'

const httpStatus= require('http-status')
const APIError= require('../utils/APIError')

exports.upload= async(req,res,next)=>{
    try{    
        if(!req.files){
            throw new APIError('File is not recieved')
        }
        const response= {payload: []}
        for(let index=0;index < req.filess.length;index++){
            const element= req.files[index]
            response.payload.push(element.key)
        }
        res.status(httpStatus.CREATED)
        res.send(response);
    }   
    catch(err){
        next(err);
    }
}