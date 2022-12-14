// Passport import, initialization, and configuration
const passport = require('passport')
const { loginStrategy, signupStrategy, jwtStrategy } = require('../../middlewares/auth/passportStrategies')
const LocalStrategy = require('passport-local').Strategy
passport.use('login', new LocalStrategy(loginStrategy))
passport.use('signup', new LocalStrategy({passReqToCallback: true}, signupStrategy))
passport.use(jwtStrategy)

// Types and User schema to be used by deserialize
const { Types } = require('mongoose')
const User = require('../../databases/mongoDB/schemas/user')
passport.serializeUser((user, done) => {
    done(null, user._id)
})
passport.deserializeUser(async (id, done) => {
    id = Types.ObjectId(id)
    const user = await User.findById(id)
    done(null, user)
})

const passportSignup = passport.authenticate('signup',
    {failureRedirect: '/auth/signupError',
    session: false})

const passportLogin = passport.authenticate('login',
    {failureRedirect: '/auth/loginError',
    session: false})

const jwtValidation = passport.authenticate('jwt',
    {failureRedirect: '/auth/unauthorized',
    session: false})

module.exports = {
    passport,
    passportSignup,
    passportLogin,
    jwtValidation
}