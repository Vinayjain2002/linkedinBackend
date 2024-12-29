'use strict'

const express= require('express')
const router= express.Router()
const auth= require('../../middlewares/authorization')
const logController= require('../../controllers/logController')
const validator= require('express-validator')
const {userId, jobId}= require('../../validations/commonValidation')

// router.put('/click/:jobId', auth(), validator(jobId), logController.click)
// router.put('/startApplication/:jobId', auth(), validator(jobId), logController.startApplication)
// router.put('/profileView/:userId', auth(), validator(userId), logController.profileView)

module.exports= router;