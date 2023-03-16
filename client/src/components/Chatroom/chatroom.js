import React, { useContext, useState, useEffect, createRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import moment from 'moment'

import AuthContext from '../../hoc/auth';
import SocketContext from '../../hoc/setupSocket';
import axios from 'axios';
import makeToast from '../../Toaster';

const Chatroom = () => {
    const {socket} = useContext(SocketContext)
    const {getLoggedIn} = useContext(AuthContext)

    const m = moment()

    const { id } = useParams()

    const [messages,setMessages] = useState({
        message:'',
        timestamp:''
    })

    const [messagesSent,setMessagesSent] = useState([])

    const [chatroom,setChatroom] = useState('')

    const [payloadId,setPayloadId] = useState('')

    const messagesEndRef = createRef()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior:'smooth'})
    }

    function sentMessages(){
        return messagesSent.map((item,i)=>{
            return(
                <div key={i}>
                {item.userId ===payloadId?
                <div key={i} className='flex justify-end p-2'>
                    <div className='grid grid-cols-12'>
                        <div className='col-start-5 col-end-13'>
                            <div className='text-right text-slate-400 font-spectral text-xs'>You:</div>
                            <div className='bg-gradient-to-tr from-cyan-500 to-blue-700 text-slate-300 px-3 py-2 rounded-xl'>
                                <div>{item.message}</div>
                            </div>
                            <div className='flex justify-end text-slate-400 text-sm' >
                                {item.timestamp}
                            </div>
                        </div>
                    </div>
                </div>:
                <div key={i} className='flex justify-start p-2'>
                    <div className='grid grid-cols-12'>
                        <div className='col-start-1 col-end-9'>
                            <div className='text-slate-400 font-spectral text-xs'>{item.name}:</div>
                            <div className='bg-gradient-to-tr from-purple-800 to-violet-500 text-slate-300 px-3 py-2 rounded-xl'>
                                <div>{item.message}</div>
                            </div>
                            <div className='flex justify-start text-slate-400 text-sm' >
                                {item.timestamp}
                            </div>
                        </div>
                    </div>
                </div>
                }
                </div>
            )
        })
    }
    
    const clear = ()=>{
        setMessages({...messages,message:''})
    }

    const sendMessage = (e) => {
        e.preventDefault()
        setMessages({...messages,timestamp:m.format('L HH:mm')})
        if(socket){
            socket.emit('chatroomMessage',{
                id,
                message:messages.message,
                timestamp:m.format('L HH:mm')
            })
        }
        clear()
    }

    const navigate = useNavigate()

    const logout= (e)=>{
        e.preventDefault()
        navigate('/')
        localStorage.clear()
        getLoggedIn()
    }

    async function getChatroomTitle(){
        try{
            const response = await axios.get(`https://chats-and-vibes.onrender.com/${id}`,{
                headers:{
                    Authorization:"Bearer " + localStorage.getItem('CC_Token')
                }
            })
            setChatroom(response.data)
        }catch(err){
            console.log(err.response.data)
        }
    }

    async function getMessages(){
        try{
            const response = await axios.get(`https://chats-and-vibes.onrender.com/messages/${id}`,{
                headers:{
                    Authorization:"Bearer " + localStorage.getItem('CC_Token')
                }
            })
            setMessagesSent(response.data)
            scrollToBottom()
        }catch(err){
            console.log(err.response.data)
        }
    }

    useEffect(()=>{
        getMessages()
        getChatroomTitle()
    },[])

    useEffect(()=>{
        const token = localStorage.getItem('CC_Token')
        if(token){
            const payload = JSON.parse(atob(token.split(".")[1]))
            setPayloadId(payload.id)
        }

        if(socket){
            socket.on('newMessage',(message)=>{
                const newMessages = [...messagesSent,message]
                setMessagesSent(newMessages)
            })

            socket.on('getChatroom',(chatroom)=>{
                
            })
        }

    },[messagesSent,socket])

    useEffect(()=>{
        if(socket){
            socket.emit('joinRoom',{
                id
            })

            socket.on('usersPresent',(user)=>{
                makeToast('success',`${user.name} has joined the chat`)
            })
        }

        return ()=>{
            //Unmount Component
            if(socket){
                socket.emit('leaveRoom',{
                    id
                })

                socket.on('usersAbsent',(user)=>{
                    makeToast('error',`${user.name} has left the chat`)
                })
            }
        }
    },[id,socket])

    useEffect(()=>{
        scrollToBottom()
    },[messagesSent])

    return (
        <div className='grid grid-rows-[50px_minmax(0,_0.96fr)] height shadow-2xl w-80 md:w-96'>
            <div className='text-slate-300 uppercase bg-blue-800 rounded-t-md p-2.5'>
                <div className='flex justify-between'>
                <span>
                    <Link to='/dashboard'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pt-1 hover:text-slate-500 active:text-slate-700 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
                    </Link>
                </span>
                <span className='pb-1'>{chatroom.name}</span>
                <span className='pt-1/2' onClick={logout}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pt-1 hover:text-slate-500 active:text-slate-700 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </span>
                </div>
            </div>
            <div className='bg-slate-200 border font-cormorant text-sm border-b-blue-800 overflow-y-scroll'>
                <div className='flex flex-col'>
                    {sentMessages()}
                    <div ref={messagesEndRef}/>
                </div>            
            </div>
            <form className='grid grid-cols-10'>
                <div className='col-span-8 flex bg-white'>
                    <input type='text'
                    className='px-3 bg-white text-lg w-full outline-none transition-ease-in-out placeholder:font-spectral placeholder:text-sm placeholder:text-slate-400'
                    placeholder='Type a message...'
                    value={messages.message}
                    onChange={(e)=>setMessages({...messages,message:e.target.value})}
                    />
                </div>
                <button onClick={sendMessage} 
                className='select-none col-span-2 flex justify-center items-center bg-blue-800 hover:bg-blue-700 active:bg-blue-600'>
                    <div className='pr-0 pb-1/2 font-spectral text-slate-300 uppercase'>
                        Send
                    </div>
                </button>
            </form>
        </div>
    );
};

export default Chatroom;