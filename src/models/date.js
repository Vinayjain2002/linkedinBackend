'use strict'

const mongoose= require('mongoose')

const dateSchema= new mongoose.Schema({
    startDate: {
        type: Date,
        requried: true
    },
    endDate: {
        type: Date
    }
});

const DateModel= mongoose.model('Date', dateSchema)
module.exports= {
    DateModel,
    dateSchema
};