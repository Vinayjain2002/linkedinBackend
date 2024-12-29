'use strict'

const express= require('express')
const router= express.Router()
const auth= require('../../middlewares/authorization')
const messagesController= require('../../controllers/messageController')
const validator= require('express-validator')

const {fetch, send}= require('../../validations/messageValidation')
const {threadId}= require('../../validations/commonValidation')

// router.post('/', auth, validator(fetch), messagesController.newThread)
// router.get('/findByUser', auth(), messageController.getInbox)
// router.get('/:threadId', auth(), validator(threadId), messagesController.getOne)
// router.put('/:threadId', auth(), validator(threadId), validator(send), messagesController.putOne)

module.exports= router;