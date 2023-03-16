import React,{useContext, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useForm} from 'react-hook-form'
import axios from 'axios';
import AuthContext from '../../hoc/auth';
import SocketContext from '../../hoc/setupSocket';
import makeToast from '../../Toaster';

const Login = () => {
    const {setMySocket} = useContext(SocketContext)
    const {getLoggedIn} = useContext(AuthContext);

    const navigate = useNavigate();

    const [authDetails, setAuthDetails] = useState({
        name:''
    })
    
    const {register,handleSubmit,formState:{errors}} = useForm();

    const [error,setError] = useState(null);

    async function onSubmit(){
        try{
            const response = await axios.post("https://chats-and-vibes.onrender.com/login",authDetails);
            localStorage.setItem('CC_Token', response.data.token)
            await getLoggedIn();
            makeToast('success','Logged in successfully')
            navigate('/dashboard');
            setMySocket()   
        }catch(err){
            setError(err.response.data)
        }
    }

    return (
        <div className='bg-slate-200 rounded p-8 shadow-xl w-80 md:w-96'>
            <div className='text-center text-2xl text-blue-800 font-bold'>
                MEMBER
            </div>
            <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <div className='py-6'>
                <div>
                    <label className='text-purple-800'>Username:</label><br/>
                    <input type='text' 
                    {...register("name",{required:{
                        value:true,message:'Your username is required'
                    }})}
                    className='font-spectral w-full bg-slate-200 px-3 py-1 text-base border-b-2 border-cyan-900 outline-none transition-ease-in-out m-0'
                    id='name'
                    onChange={(e)=>setAuthDetails({...authDetails,name:e.target.value})}
                    value={authDetails.name}
                    /><br/>
                </div>
                <div className='text-red-700'>
                    {errors?.name?.message}
                    {error? <div>No such user exists</div>:null }
                </div>
            </div>
            
            <div className='flex flex-col justify-center items-center pb-4'> 
                <Link to='/register' className='text-sm text-violet-400 tracking-wider cursor-pointer hover:text-violet-600 active:text-purple-800'>Newcomer to the group? Click here</Link><br/>
                <button className='select-none border-purple-900 hover:bg-purple-900 hover:text-slate-200 border-2 text-purple-900 font-spectral active:bg-purple-800 font-bold text-sm cursor-pointer text-center py-2 px-4 rounded-full'>
                    SUBMIT
                </button>
                </div>
            </form>
        </div>
    );
};

export default Login;