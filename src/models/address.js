'use strict';

const mongoose = require('mongoose');

const coordinateSchema = mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});

const addressSchema = new mongoose.Schema({
    street: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    zipcode: {
        type: String
    },
    coordinates: {  
        type: coordinateSchema, // Correctly defining coordinates as an embedded schema
        required: true // Ensure that coordinates is required if necessary
      
    }
});

const Address = mongoose.model('Address', addressSchema);
module.exports = {
    Address,
    addressSchema
};
