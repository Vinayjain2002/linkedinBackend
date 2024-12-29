'use strict'

const Joi= require('joi')
const coordinates = require('../models/coordinates')

module.exports= {
    jobs: {
        body: {
            citerion: Joi.string(),
            coordinates: Joi.object().keys({
                latitude: Joi.number().min(-90).max(90),
                longitude: Joi.number().min(-180).max(180)
            }),
            page: Joi.number().min(1).default(1)
        }
    },
    users: {
        body: {
            name: Joi.string().required()
        }
    }
}