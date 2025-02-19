'use strict'

const config = require('../config/index')
const User = require('../models/user')
const passportJWT = require('passport-jwt')

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const jwtOptions = {
  secretOrKey: config.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

// defining the logic for the verification of the jwt and retrieving the user
const jwtStrategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  User.findById(jwtPayload.sub, (err, user) => {
    if (err) {
      return done(err, null)
    }

    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  })
})

exports.jwtOptions = jwtOptions
exports.jwt = jwtStrategy
