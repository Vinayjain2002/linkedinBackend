const config= require('../config/index')
const mongoose= require('mongoose')
// used for handling out the Promises
mongoose.Promise= require('bluebird')

mongoose.connection.on('connected', ()=>{
    console.log('MongoDB is connected')
})

mongoose.connection.on('error', (err)=>{
    console.log('could not connect to MongoDB',err)
    process.exit(-1);
})

if(config.env==='dev'){
    mongoose.set('debug', true);
}

exports.connect= ()=>{
    var mognoURI= config.mongo.uri;

    mongoose.connect(mognoURI);
    console.log('MongoDB is connected')
    return mongoose.connection;
}