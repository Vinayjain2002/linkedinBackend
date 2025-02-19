'use strict'

const express= require('express')
const router= express.Router()
const documentController= require('../../controllers/documentController')
const auth= require('../../middlewares/authorization')
const upload= require('../../middlewares/upload')

// using upload.any() to upload any file
router.post('/upload', auth(), upload.any(), documentController.upload)
module.exports= router;