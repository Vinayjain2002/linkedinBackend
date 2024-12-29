'use strict'

const mongoose= require('mongoose')
const {addressSchema} = require('./address')

const jobSchema= new mongoose.Schema({
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recruiter",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    address: {
        type: addressSchema,
        requried: true
    },
    function: {
        type: String,
        required: true
    },
    company_logo: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        requried: true
    },
    easy_apply: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

jobSchema.method({
    // used to get only required fields from the data
    transform(){
        const transformed= {}
        const fields= ['title', 'description','industry', 'type', 'function', 'company_logo', 'skills', 'easy_apply' ];
        fields.forEach((field)=>{
            transformed[field]= this[field];
        })
        return transformed;
    },

    titleTransform(){
        const transformed= {}
        const fields= ['title']
        fields.forEach((field)=>{
            transformed[field]= this[field]
        })
        return transformed
    }
});

const Job= mongoose.model('Job', jobSchema);
module.exports= Job;