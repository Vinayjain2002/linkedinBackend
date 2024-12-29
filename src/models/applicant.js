'use strict'

const mongoose= require('mongoose')
const {Experience, experienceSchema}= require('./experience')
const {Education, educationSchema}= require('./education')
const { addressSchema } = require('./address')
const { nameSchema } = require('./name')

const applicantSchema= new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: nameSchema,
        required: true
    },
    address: {
        type: addressSchema
    },
    experience: {
        type: [experienceSchema]
    },
    education: {
        type: [educationSchema]
    },
    skills: {
        type: [String]
    },
    summary: {
        type: String
    },
    resume: {
         type: String
    },
    profile_image: {
        type: String,
        default: 'default-profile-image.jpg'
    },
    banner_image: {
        type: String
    }
},{
    timestamps: true
});

applicantSchema.method({
    transform(){
        const transformed={}
        const fields= ['id', 'name', 'address','experience','education', 'skills', 'summary', 'resume', 'profile_image','banner_image']
        fields.forEach((field)=>{
            transformed[field]= this[field]
        })
        return transformed;
    },

    identityTransform(){
        const transformed={}
        const fields= ['id', 'name', 'profile_image']
        fields.forEach((field)=>{
            transformed[field]= this[field]
        })

        return transformed;
    }   
})
const Applicant= mongoose.model('Applicant', applicantSchema)
module.exports= Applicant;