'use strict'

const express= require('express')
const router= express.Router()
const authRouter= require('./auth')
const userRouter= require('./users')
const jobsRouter= require('./jobs')
const messageRouter= require('./message')
const searchRouter= require('./search')
const logRouter= require('./log')
const documentRouter= require('./document')

router.get('/status', (req,res)=>{
    res.send({"status": 'OK'})
})

// router.use('/status', authRouter)
router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/jobs', jobsRouter)
router.use('/search', searchRouter)
router.use('/message', messageRouter)
router.use('/log', logRouter)
router.use('/document', documentRouter)

module.exports= router;