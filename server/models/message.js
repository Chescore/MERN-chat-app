const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    chatroom:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'Chatroom'
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'User'
    },
    name:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    timestamp:{
        type:String
    }
})

const Message = mongoose.model("Message", messageSchema);

exports.Message = Message;