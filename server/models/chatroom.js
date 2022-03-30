const mongoose = require('mongoose');

const chatroomSchema = new mongoose.Schema({
    name:{
        type: String,
        maxlength:20,
        required: true,
        uppercase:true
    }
})

const Chatroom = mongoose.model("Chatroom", chatroomSchema);

exports.Chatroom = Chatroom;