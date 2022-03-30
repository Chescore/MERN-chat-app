const { Message } = require("../models/message");

exports.getMessages = async(req,res)=>{
    try{
        const messages = await Message.find({chatroom:req.params.id});

        res.json(messages);
    }catch(err){
        res.status(404).json({message:err.message})
    }
}