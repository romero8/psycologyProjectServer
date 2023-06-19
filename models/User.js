const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email : {
        type: String,
        required: [true,'Please Enter An Email'],
        unique: true,
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


userSchema.statics.logIn = async function(email,password){
    const user = await this.findOne({email});
    if(user){
       const auth = await bcrypt.compare(password,user.password)
       if(auth){
        return user;
       }
       throw Error('incorrect password')
    }
    throw Error('incorrect email')
}

const User = mongoose.model('user',userSchema)
module.exports = User