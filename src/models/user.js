' use strict'

const mongoose= require('mongoose')
const bcrypt= require('bcryptjs')
const httpStatus= require('http-status')
const APIError= require('../utils/APIError')
const roles=['recruiter', 'applicant']

const userSchema= new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type:String,
        required: true,
        minLength: 6,
        maxLength: 128
    },
    role:{
        type: String,
        default: 'applicant',
        enum: roles
    }
},{
    timestamps: true
})

userSchema.pre('save', async function save(next){
    try{    
        if(!this.isModified('password')){
            return next();
        }
        // hashing the password
        this.password=  bcrypt.hashSync(this.password)
    }   
    catch(err){
        return next(err);
    }
})

// used to fetch the data from database instance
userSchema.method({
    // used to extract the specified fields from the database
    transform(){
        const transformed= {}
        const fields= ['id', 'email', 'createdAt', 'role'];
        fields.forEach((field) => {
            transformed[field]= this[field]
        });
        return transformed;
    },

    passwordMatches(password){
        return bcrypt.compareSync(password, this.password)
    }
})

// static method used to fetch data from the model
userSchema.statics={
    roles,
    checkDuplicateEmailError(err){
        if(err.code=== 11000){
            var error= new Error("Email Already taken")
            error.errors= [{
                field: 'email',
                location: 'body',
                messages: ['Email already taken']
            }]
            error.status= httpStatus.CONFLICT
            return error
        }
        return error
    },
    
    async findAndGenerateToken (payload){
        const {email, password}= payload;
        if(!email){
            throw new APIError('Email must be provided for login')
        }
        if(!password){
            throw new APIError('Password must be present for the Login')
        }
        const user= await this.findOne({email}).exec();
        if(!user){
            throw new APIError(`No user assosiated with ${email}`, httpStatus.UNAUTHORIZED)
        }  
        const passwordOK= await user.passwordMatches(password);
        if(!passwordOK){
            throw new APIError(`Email or Password Mismatch`, httpStatus.UNAUTHORIZED);
        }     
        return user;
    }
}

const User= mongoose.model('User', userSchema);
module.exports= User;