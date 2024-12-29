const aws= require('aws-sdk')
const multer= require('multer')
const multerS3= require('multer-s3')
// for the unique identifier
const uuidv4 = require('uuid')
const path= require('path')
const config= require('./../config/index')

// config the aws
aws.config.update(config.awsaccess)

var s3= new aws.S3()
var upload= multer({
    storage: multerS3({
        s3: s3,
        bucket: config.bucket,
        key: function(req,file,cb){
            console.log(file)
            // new file name contains a unique name and the file format 
            const newFileName= `${uuidv4()}${path.extname(file.originalname)}`
            cb(null,newFileName)
        }
    })
})
module.exports= upload;