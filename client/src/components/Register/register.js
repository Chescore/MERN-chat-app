import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import AuthContext from '../../hoc/auth';
import makeToast from '../../Toaster';
import SocketContext from '../../hoc/setupSocket';

const Register = () => {
    const {getLoggedIn} = useContext(AuthContext);
    const {setMySocket} = useContext(SocketContext)

    const navigate = useNavigate();

    const [authDetails, setAuthDetails] = useState({
        name:'',
        email:''
    })

    const {register,handleSubmit, formState:{errors}} = useForm();

    const [error,setError] = useState(null)

    async function onSubmit(e){
        try{
            const response = await axios.post('https://chats-and-vibes.onrender.com/register',authDetails);
            localStorage.setItem("CC_Token",response.data.token)
            await getLoggedIn()
            makeToast('success','Account creation successful')
            navigate('/dashboard')
            setMySocket()
        }catch(err){
            setError(err.response.data);
        }
    }

    return (
        <div className='border p-8 shadow w-80 md:w-96'>
            <div className='text-center text-2xl text-blue-800'>
                NEWCOMER
            </div>
            <form className='pt-4' autoComplete='off' onSubmit={handleSubmit(onSubmit)} >
                <div className='py-4'>
                    <div>
                        <div className='mb-3'>
                            <label className='text-blue-800'>Create a new username that you will be going by:</label><br/>
                        </div>
                        <input type='text' 
                        className=' w-full px-3 py-1 border-b border-blue-800 outline-none transition-ease-in-out m-0'
                        {...register("name",{required:{
                            value:true,message:'Your username is required'
                        }})}
                        id='name'
                        onChange={(e)=>setAuthDetails({...authDetails,name:e.target.value})}
                        value={authDetails.name}
                        /><br/>
                    </div>
                    <div className='text-red-700'>
                        {errors?.name?.message}
                        {error? <div>Username already in use</div>:null }
                    </div>
                </div>
                <div className='pb-8 pt-2'>
                    <div>
                        <div class='mb-3'>
                            <label className='text-blue-800'>What is your email address:</label><br/>
                        </div>
                        <div>
                            <input type='text' 
                            className=' w-full px-3 py-1 border-b border-blue-800 outline-none transition-ease-in-out m-0'
                            {...register("email",{required:{
                                value:true,message:'Your email address is required'
                            },pattern:{
                                value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:'Invalid email address'
                            }})}
                            id='name'
                            onChange={(e)=>setAuthDetails({...authDetails,email:e.target.value})}
                            value={authDetails.email}
                            /><br/>
                        </div>
                    </div>
                    <div className='text-red-700'>
                        {errors?.email?.message}
                        {error? <div>Email already in use</div>:null }
                    </div>
                </div>            
                <div className='flex flex-col justify-center items-center pb-2'> 
                    <Link to='/login' className='text-sm text-blue-400 tracking-wider cursor-pointer hover:text-blue-600'> Already a member? Click here</Link><br/>
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

export default Register;