'use strict'

const express= require('express')
const router= express.Router()
const auth= require('../../middlewares/authorization')
const jobsController= require('../../controllers/jobsController')
const applicationController= require('../../controllers/applicationController')
const validator= require('express-validator')
const recommendationCache= require('../../middlewares/recommendationCache')
const {jobId} = require('../../validations/commonValidation')
const {create, update, apply, easyApply}= require('../../validations/JobsValidation')

// router.get('/applied/count', auth(['applicant']), applicationController.fetchAppliedCount)
// router.get('/applied', auth(['applicant']), applicationController.fetchApplied)
// router.get('/saved/count', auth(['applicant']), applicationController.fetchSavedCount)
// router.get('/saved', auth(['applicant']), applicationController.fetchSaved)
// router.get('/', auth(), jobsController.get)
// router.post('/', auth(['recruiter']),validator(create), jobsController.post )

// router.get('/recommendation', auth(['applicant']), recommendationCache, jobsController.recommendation)
// router.get('/findByRecruiter', auth(['recruiter']), jobsController.jobsByRecruiter)
// router.get('/:jobId', auth(), validator(jobId), jobsController.getOne)
// router.get('/:jobId/details', auth(['recruiter']), validator(jobId),applicationController.getApplicationDetails )

// router.put('/:jobId', auth(['recruiter']), validator(jobId),validator(update), jobsController.putOne)
// router.delete('/:jobId', auth(['recruiter']), validator(jobId), jobsController.deleteOne)
// router.post('/:jobId/save', auth(['applicant']), validator(jobId), applicationController.save)
// router.post('/:jobId/unsave', auth(['applicant']), validator(jobId), applicationController.unsave )
// router.post('/:jobId/apply', auth(['applicant']), validator(jobId), validator(apply), applicationController.apply)
// router.post('/:jobId/easyApply', auth(['applicant']), validator(jobId),validator(easyApply),applicationController.easyApply  )

module.exports= router;