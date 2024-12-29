'use strict'

const User= require('../models/user')
const passport= require('passport')
const bluebird= require('bluebird')
const httpStatus= require('http-status')
const APIError = require('../utils/APIError')

// handling the user login after Passport authentication

const handleJWT= (req, res, next, roles)=> async(err, user, info)=>{
    const error= err || info;
    // for login the user
    const logIn= bluebird(req.login);

    //Created a Centralised to handle any error during login and removed when user successfully login
    const apiError= new APIError(
        error ? error.message : 'Unauthorized',
        httpStatus.UNAUTHORIZED,
    )

    // trying to auth the user
    try{
        if(error || !user){
            throw error;
        }
        await logIn(user, {session: false})
    }
    catch(err){
        return next(apiError);
    }

    // checking the user allocated rules
    if(!roles.includes(user.role)){
        // not allowed as a recruiter
        return next(new APIError('Forbidden', httpStatus.FORBIDDEN))
    }

    req.user= user;
    return next();
}

function authorize(roles = User.roles) {
    // session:false to prevent passport to store the data
    return function (req, res, next) {
      passport.authenticate(
        'jwt',
        { session: false },
        handleJWT(req, res, next, roles)
      )(req, res, next);
    };
  }
  
  module.exports = authorize;
  