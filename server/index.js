const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {createLogger, transports} = require('winston');
const jwt = require('jsonwebtoken')

const errorHandlers = require('./middleware/errorHandler.js');
const users = require('./routes/user');
const chatroom = require('./routes/chatroom');
const messages = require('./routes/messages');

const { User } = require('./models/user.js');
const { Message } = require('./models/message');

createLogger({
    level: 'info',
    exceptionHandlers: [
        new transports.File({ filename: 'exceptions.log' })
    ],
    rejectionHandlers: [
        new transports.File({ filename: 'rejections.log' })
    ]
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin:["http://localhost:3000","https://chats-and-vibes.netlify.app"],
    credentials:true
}));

app.use('/',chatroom);
app.use('/',users);
app.use('/',messages)

app.use(errorHandlers.mongooseErrors);
if(process.env.ENV==='development'){
    app.use(errorHandlers.developmentErrors);
}else{
    app.use(errorHandlers.productionErrors);
}

mongoose.connect(process.env.MONGO_URI)
    .then(console.log('Connected to MongoDB'))

const PORT = process.env.PORT;

const server = app.listen(PORT||8000,()=>{
    console.log(`Server running at port ${PORT}...`)
})

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors: {
        origin:'http://localhost:3000',
        methods:['GET','POST'],
        credentials:true
    }
});

io.use((socket,next)=>{
    try{
        const token = socket.handshake.query.token;
        const payload = jwt.verify(token,process.env.TOKEN_KEY)
        socket.userId = payload.id;
        next()
    }catch(err){}
})

io.on('connection',(socket)=>{
    console.log('UserID:' + socket.userId + ' has connected')

    socket.on('disconnect',()=>{
        console.log('UserID:' + socket.userId + ' has disconnected')
    })

    socket.on('joinRoom',async ({id})=>{
        socket.join(id)
        console.log('A user joined the chatroom: ' + id)

        const user = await User.findOne({_id:socket.userId})
        socket.broadcast.to(id).emit('usersPresent',{name:user.name})
    })

    socket.on('leaveRoom',async ({id})=>{
        socket.leave(id)
        console.log('A user left the chatroom: ' + id)

        const user = await User.findOne({_id:socket.userId})
        socket.broadcast.to(id).emit('usersAbsent',{name:user.name})
    })

    socket.on('chatroomMessage',async ({id,message,timestamp})=>{
        try{
            if(message.trim().length>0){
                const user = await User.findOne({_id:socket.userId})
                const newMessage = new Message({
                    chatroom: id,
                    userId:socket.userId,
                    name:user.name,
                    message:message,
                    timestamp
                })
               
                io.to(id).emit('newMessage',{
                    message,
                    name:user.name,
                    timestamp,
                    userId:socket.userId
                })
                await newMessage.save()
            }
        }catch(err){
            console.log(err)
        }
    })
})
