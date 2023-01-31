import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../hoc/auth';

const Home = () => {
    const {loggedIn} = useContext(AuthContext);

    const {handleSubmit} = useForm();
    const navigate = useNavigate()

    function onSubmit(){
        loggedIn?navigate('/dashboard'):navigate('/login')
    }

    return (
        <div className='bg-slate-300 rounded p-8 shadow-xl w-80 md:w-96'>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col justify-center items-center pb-4'>
                <div className='text-blue-800 py-6'>
                    <div className='text-center'>YOOO! </div>
                    <div className='text-center'>WELCOME TO MY CHAT APPLICATION</div>    
                </div> 
                <button className='select-none border-purple-900 hover:bg-purple-900 hover:text-slate-200 border-2 text-purple-900 font-spectral active:bg-purple-800 font-bold text-sm cursor-pointer text-center py-2 px-4 rounded-full'>
                    LET'S GET STARTED
                </button>
            </div>
            </form>
        </div>
    );
};

export default Home;