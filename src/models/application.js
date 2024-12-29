'use strict'

const mongoose= require('mongoose')
const {nameSchema}= require('./name')
const {addressSchema}= require('./address')

const applicationSchema= new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        requried: true
    },
    name: {
        type: nameSchema,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type:addressSchema,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    cover_letter: {
        type: String
    },
    source: {
        type: String,
        required: true
    },
    diversity: {
        type: String,
        required: true
    },
    sponsorship: {
        type: String,
        required: true
    },
    disability: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);
module.exports= Application;