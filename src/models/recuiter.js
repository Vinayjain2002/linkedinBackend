'use strict'

const mongoose= require('mongoose')
const bcrypt= require('bcryptjs')
const httpStatus= require('http-status')
const APIError= require('../utils/APIError')
const User= require('../models/user')
const {addressSchema}= require('./address')
const {nameSchema} = require('./name')

const roles=[
    'recuiter', 'applicant'
]


const recuiterSchema= new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: nameSchema,
        requried: true
    },
    address: {
        type: addressSchema
    },
    phone_number: {
        type: String
    },
    headline: {
        type: String
    },
    company: {
        type: String
    },
    profile_image: {
        type: String,
        default: 'default-profile-image.jpg'
    },
    banner_image: {
        type: String
    }
}, {
    timestamps: true
});

recuiterSchema.method({
    // used to fetch the data from the db
    transform(){
        const transformed={}
        const fields= ['id', 'name', 'address', 'phone_number', 'company','profile_image', 'banner_image' ]
        fields.forEach((field)=>{
            transformed[field]= this[field]
        });
    },

    identifyTransform(){
        const transformed={}
        const fields= ['id', 'name', 'profile_image']
        fields.forEach((field)=>{
            transformed[field]= this[field]
        })
        return transformed
    }
})

const Recruiter= mongoose.model('Recruiter', recuiterSchema)
module.exports= Recruiter;