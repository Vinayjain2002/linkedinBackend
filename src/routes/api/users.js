'use strict'

const express= require('express')
const router= express.Router()
const auth= require('../../middlewares/authorization')
const userController= require('../../controllers/userController')
const dashboardController= require('../../controllers/dashboardController')
// const validator= require('express-validator')

const {update}= require('../../validations/userValidation')
const {userId}= require('../../validations/commonValidation')

// router.get('/', auth(), userController.getAll)
// router.get('/dashboard', auth(), dashboardController.generateDashBoardData)
// router.get('/:userId', auth(), validator(userId), userController.getOne)

// router.put('/:userId', auth(), validator(userId), validator(update), userController.putOne)
// router.delete('/:userId', auth(), validator(userId), userController.deleteOne)
// router.post('/:userId/connect', auth(), validator(userId) , userController.connect)

// router.get('/:userId/connections',auth(), validator(userId), userController.connections )
// router.get('/:userId/mutual', auth(), userController.mutual)

module.exports= router;
