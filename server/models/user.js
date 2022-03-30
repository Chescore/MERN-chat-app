const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        lowercase:true,
        required: true
    }
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({id:this._id,name:this.name},process.env.TOKEN_KEY);
    return token;
}

const User = mongoose.model("User", userSchema);

exports.User = User;