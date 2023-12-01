const mongoose = require('mongoose');
const validator = require("validator")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is Require"]
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:[true,"Email is Require"],
        unique:true,
        validate:validator.isEmail,
    },
    password:{
        type:String,
        required:[true,"Password is require"],
        minlength:[6,"Password length should be greater than 6 characters."],
        select:true,
    },
    location:{
        type:String,
        default:"India",
    },
},{
    timestamps:true
});
userSchema.pre("save",async function(){
    if(!this.isModified) return ;
    const salt = await bcrypt.genSalt(1);
    this.password =  await bcrypt.hash(this.password,salt);
})

userSchema.methods.comparePassword = async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword,this.password)
    return isMatch;
}

userSchema.methods.createJWT = function(){
    return JWT.sign({userId:this._id},process.env.SECRET_KEY,{expiresIn:"1d"})
}

module.exports = mongoose.model("User",userSchema);