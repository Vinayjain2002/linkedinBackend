'use strict'

const express= require('express')
const router= express.Router()
const authController= require('../../controllers/authController')
// const validator= require('express-validator')
const {login, create, update}= require('../../validations/userValidation')

// router.post('/login', validator(login), authController.login)
// router.post('/signup', validator(create), validator(update), authController.register)

module.exports= router