'use strict'

const mongoose= require('mongoose')

const nameSchema= mongoose.Schema({
    first: {
        type: String,
        required: true
    },
    last: {
        type: String,
        required: true
    }
})

const Name= mongoose.model('Name', nameSchema)
module.exports= {
    Name,
    nameSchema
}