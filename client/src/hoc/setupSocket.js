import React, { createContext, useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client'
import makeToast from '../Toaster';

const SocketContext = createContext()

const SetUpSocket = ({children}) => {
    const [socket,setSocket] = useState(null)
    const ENDPOINT = 'http://localhost:8000';
    
    const setMySocket = useCallback(()=>{
        const token = localStorage.getItem("CC_Token")
     
        if(token && !socket){
            const newSocket = io(ENDPOINT,{
              query:{
                  token:localStorage.getItem('CC_Token')
              }  
            })

            newSocket.on('disconnect',()=>{
                setSocket(null);
                makeToast('error', 'User Disconnected!')
            })
            
            newSocket.on('connect',()=>{
                makeToast('success', 'User is online')
            })

            setSocket(newSocket)
        }
    },[socket])

    useEffect(()=>{
        setMySocket()
    },[setMySocket])

    return (
        <SocketContext.Provider value={{socket,setMySocket}}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext
export {SetUpSocket}