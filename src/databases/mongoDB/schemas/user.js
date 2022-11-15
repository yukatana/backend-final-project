const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
}, {timestamps: true})

const User = model('users', UserSchema)

module.exports = User