'use strict'

const mongoose= require('mongoose')
const {dateSchema}= require('./date')

const educationSchema= new mongoose.Schema({
    school: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    fields: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: dateSchema,
        requried: true
    }
}, {
    timestamps: true
});

const Education= mongoose.model('Education', educationSchema)
module.exports= {
    Education,
    educationSchema
};