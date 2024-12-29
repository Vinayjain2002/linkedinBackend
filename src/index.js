'use strict'

const mongoose= require('./services/mongoose')
const app= require('./services/express')

// starting app and connecting with the database
app.start()
mongoose.connect();

module.exports= app;