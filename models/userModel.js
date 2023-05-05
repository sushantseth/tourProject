const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const { appError } = require('../utils/appError');
//name
//email
//photo
//password
//password confirm
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, "Name not provided"]
    },
    email : {
        type : String,
        required : [true, "email not provided"],
        unique : true,
        lowercase : true,
        validate: [validateEmail, 'Please fill a valid email address']

    },
    role : {
        type :String,
        enum : ['user','admin']
    },
    photo : String,
    password : {
        type : String,
        required : [true, "password not provided"],
        minLength : 10
    },
    passwordConfirm : {
        type : String,
        required : [true, "password not provided"],
        validate : {
            validator : function(val){
                return val === this.password
            },
            message : "password verification error"
        }
    },
    passwordUpdateDate : Date
})


userSchema.pre('save', async function(next){
    //isModified method can be attached to the this doc and can we specified a field to check
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    // passwordconfirm set to undefined to prevent it to be stored in db
    this.passwordConfirm = undefined
      const User = mongoose.model('User',userSchema)
    User.findOne({email : this.email})
    .then((data)=>{
        if(data){
            console.log("inside this")
            return next(appError("user already exists",400))
        }
        next()
    })
    .catch(err => next(err));
    
  
})

const User = mongoose.model('user',userSchema)




module.exports = User;