import axios from 'axios';
import React, { useState,useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import SocketContext from '../../hoc/setupSocket';

const Dashboard = () => {
    const {setMySocket} = useContext(SocketContext)

    const {register,handleSubmit,formState:{errors}} = useForm()
    const [rooms,setRooms] = useState([])
    
    const navigate = useNavigate();
    
    const [error,setError] = useState(null);

    const [chatrooms, setChatrooms] = useState({
        name:''
    });

    async function getRooms(){
        try{
            const response = await axios.get('https://chats-and-vibes.onrender.com',{
                headers:{
                    Authorization: "Bearer " + localStorage.getItem("CC_Token")
                }
            });
            setRooms(response.data)
        }catch(err){
            console.log(err.response.data)
        }
    }

    useEffect(()=>{
        getRooms()
    },[])

    async function onSubmit(){
        try{
            await axios.post('https://chats-and-vibes.onrender.com/',chatrooms,{
                headers:{
                    Authorization: "Bearer " + localStorage.getItem("CC_Token")
                }
            });
            navigate('/dashboard');
            getRooms()
            setChatrooms({...chatrooms,name:''})
            setError(null)
            setMySocket()
        }catch(err){
            setError(err.response.data)
        }
    }

    return (
        <div className='max-height scroll-smooth overflow-y-scroll p-8 shadow border w-80 md:w-96'>
            <div className='text-center text-xl text-blue-800'>
                CHATROOM
            </div>
            <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <div className='py-6'>
                    <label className='text-blue-800'>Chatroom Name:</label><br/>
                    <input type='text' 
                    value={chatrooms.name}
                    {...register("name",{required:{
                        value:true,message:'Give the chatroom a name'
                    },maxLength:{
                        value:20,message:'Should contain a maximum of 20 characters'
                    }})}
                    onChange={(e)=>setChatrooms({...chatrooms,name:e.target.value})}
                    id='chatroom'
                    className=' w-full px-3 py-1 text-base border-b border-blue-900 outline-none transition-ease-in-out m-0'/><br/>
                    <div className='text-red-700'>
                        {errors?.name?.message}
                        {error? <div>{error}</div>:null }
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center pb-4'> 
                    <button className='select-none border-blue-800 border text-blue-900 text-sm 
                                    cursor-pointer outline-none text-center py-2 px-4 rounded
                                    hover:bg-blue-800 hover:text-white'>
                        CREATE CHATROOM
                    </button>
                </div>
            </form>
            <div>
                {rooms.map((item,i)=>{
                    return(
                        <div key={i} className='flex justify-between my-4'>
                            <span className='py-2'>{item.name}</span>
                            <span>                  
                                <Link to={`/chatroom/${item._id}`}>
                                    <button className='select-none border-blue-800 hover:bg-blue-800 
                                                hover:text-white border text-blue-800 font-bold outline-none
                                                 text-sm cursor-pointer text-center py-2 px-4 rounded-full'>
                                        JOIN
                                    </button>
                                </Link>
                            </span>
                        </div>                
                    )
                })}
            </div>
        </div>
    );
};

export default Dashboard;