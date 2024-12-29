'use strict'

const mongoose= require('mongoose')
const {dateSchema} = require('./date')

const experienceSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    headline: {
        type: String,
        required: true
    },
    description: {
        type: String,
        requried: true
    },
    date: {
        type: dateSchema,
        required: true
    }
},{
    timestamps: true
});

const Experience= mongoose.model('Experience', experienceSchema)
module.exports= {
    Experience,
    experienceSchema
};