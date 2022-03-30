const {Chatroom} = require('../models/chatroom');

exports.createChatroom = async(req,res)=>{
    try{
        const {name} = req.body;

        // const nameRegex = /^[A-Za-z\s]+$/;
        
        // if(!nameRegex.test(name)) return res.status(400).send("Chatroom can only contain alphabets");

        const existingChatroom = await Chatroom.findOne({name});
        if(existingChatroom) return res.status(400).send('Chatroom already exists');

        const chatroom = new Chatroom({
            name
        })

        await chatroom.save();

        res.json({
            message:'Chatroom now in session'
        })
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

exports.getChatRooms = async(req,res)=>{
    try{
        const chatrooms = await Chatroom.find();

        res.json(chatrooms);
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

exports.getChatroomById = async(req,res)=>{
    try{
        const chatroom = await Chatroom.findById(req.params.id)

        res.json(chatroom)
    }catch(err){
        res.status(404).json({message:err.message})
    }
}