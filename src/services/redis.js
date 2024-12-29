'use strict'

const redis= require('redis')
const config= require('../config/index')
const redisClient= redis.createClient(config.redisPort)

redisClient.on('connect', function(){
    console.log('redis client connected')
});

redisClient.on('error', function(err){
    console.log('Error in the redis Client Initialization', err)
    process.exit(-1)
})

module.exports= redisClient