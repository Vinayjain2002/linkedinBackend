'use strict'

const mongoose= require('mongoose')

const coordinateSchema= mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
})

module.exports= mongoose.model('Coordinates', coordinateSchema);