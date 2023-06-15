const mongoose = require('mongoose')
const {isEmail} = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email : {
        type: String,
        required: [true,'Please Enter An Email'],
        unique: [true,'This Email Already Exists'],
        lowerCase:true,
        validate:[isEmail, 'Please Enter A Valid Email']
    },
    password : {
        type: String,
        required: [true,'Please Enter A Password'],
        minlength: [6,'Minimum Password Length Is 6']
    },
    textArea : {
        type: String,
        required: true
    }
},{timestamps: true})

const User = mongoose.model('user',userSchema)
module.exports = User