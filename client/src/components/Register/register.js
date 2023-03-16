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
        <div className='bg-slate-200 rounded p-8 shadow-xl w-80 md:w-96'>
            <div className='text-center text-2xl text-blue-800 font-bold tracking-widest'>
                NEWCOMER
            </div>
            <form className='pt-4' autoComplete='off' onSubmit={handleSubmit(onSubmit)} >
                <div className='py-4'>
                    <div>
                        <label className='text-purple-800'>Username:</label><br/>
                        <input type='text' 
                        className='font-spectral w-full bg-slate-200 px-3 py-1 text-base border-b-2 border-cyan-900 outline-none transition-ease-in-out m-0'
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
                        <label className='text-purple-800'>Email address:</label><br/>
                        <input type='text' 
                        className='font-spectral w-full bg-slate-200 px-3 py-1 text-base border-b-2 border-cyan-900 outline-none transition-ease-in-out m-0'
                        {...register("email",{required:{
                            value:true,message:'Your email address is required'
                        },pattern:{
                            value:/@gmail.com|@yahoo.com|@hotmail.com|@live.com/,message:'Invalid email address'
                        }})}
                        id='name'
                        onChange={(e)=>setAuthDetails({...authDetails,email:e.target.value})}
                        value={authDetails.email}
                        /><br/>
                    </div>
                    <div className='text-red-700'>
                        {errors?.email?.message}
                        {error? <div>Email already in use</div>:null }
                    </div>
                </div>            
                <div className='flex flex-col justify-center items-center pb-2'> 
                    <Link to='/login' className='text-sm text-violet-400 tracking-wider cursor-pointer hover:text-violet-600 active:text-purple-800'> Already a member? Click here</Link><br/>
                    <button className='select-none border-purple-900 hover:bg-purple-900 hover:text-slate-200 border-2 text-purple-900 font-spectral active:bg-purple-800 font-bold text-sm cursor-pointer text-center py-2 px-4 rounded-full'>
                        SUBMIT
                    </button>
                </div>
            </form>
        </div>
    ); 
};

export default Register;