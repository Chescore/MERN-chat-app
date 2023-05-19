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
        <div className='border p-8 shadow w-80 md:w-96'>
            <div className='text-center text-2xl text-blue-800'>
                MEMBER
            </div>
            <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <div className='py-6'>
                <div>
                    <div className='mb-3'>
                        <label className='text-blue-800'>Please state your username if you already a member of the group:</label><br/>
                    </div>
                    <div>
                        <input type='text' 
                        {...register("name",{required:{
                            value:true,message:'Your username is required'
                        }})}
                        className=' w-full px-3 py-1 border-b border-blue-800 outline-none transition-ease-in-out m-0'
                        id='name'
                        onChange={(e)=>setAuthDetails({...authDetails,name:e.target.value})}
                        value={authDetails.name}
                        /><br/>
                    </div>
                </div>
                <div className='text-red-700'>
                    {errors?.name?.message}
                    {error? <div>No such user exists</div>:null }
                </div>
            </div>
            
            <div className='flex flex-col justify-center items-center pb-4'> 
                <Link to='/register' className='text-sm text-blue-400 tracking-wider cursor-pointer hover:text-blue-600'>Newcomer to the group? Click here</Link><br/>
                <button className='select-none border-blue-800 hover:bg-blue-800 
                            hover:text-white border text-blue-800 text-sm cursor-pointer 
                            text-center py-2 px-4 rounded'>
                                SUBMIT
                </button>
                </div>
            </form>
        </div>
    );
};

export default Login;