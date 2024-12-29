'use strict'

const Joi= require('joi')

module.exports= {
    fetch: {
        body: {
            to: Joi.string().required()
        }
    },
    send: {
        body: {
            message: Joi.string().required()
        }
    }
}