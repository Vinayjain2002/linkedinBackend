'use strict'

const express= require('express')
const router= express.Router();

const auth= require('../../middlewares/authorization')
const cache= require('../../middlewares/cache')
const searchController= require('../../controllers/searchController')
const validator= require('express-validator')
const {jobs, users}= require('../../validations/searchValidations')

router.get('/', auth(), searchController.getAll)
router.get('/jobs', auth(), searchController.getJobs)
router.get('/users', auth(), searchController.getUsers)

// router.get('/jobs', auth(), validator(jobs), cache, searchController.getFilteredJobs)
// router.post('/users', auth(), validator(users), searchController.getFilteredUsers)

module.exports= router;