'use strict'

const redisClient = require('../services/redis')
const httpStatus= require('http-status')

// checks for cache if not then pass on for fresh data and find data using the pagination
const cache= (req,res,next)=>{
    console.log('In Redis cache')
    const response= {payload: []}

    const page= req.body.page ? req.body.page : 1
    const criterion= req.body.criterion ? req.body.criterion : ' '
    const lat= null;
    const long= null;

    if(req.body.coordinates){
        lat= req.body.coordinates.latitude ? req.body.coordinates.latitude : null
        long= req.body.coordinates.longitude ? req.body.longitude : null

        var key= criterion.split(' ').join('_')+ '_'+ lat+ '_'+ long
        console.log('Key to check'+ key);

        redisClient.get(key, function(err, val){
            if(err){
                throw err;
            }

            if(val !=null){
                response.payload= pageinate(JSON.parse(val), page)
                res.status(httpStatus.OK)
                res.send(response)
            }
            else{
                next();
            }
        })
    }
}

const pageinate= (array, pageNumber)=>{
    --pageNumber
    return array.slice(pageNumber*10, (pageNumber+1)*10)
}

module.exports= cache
