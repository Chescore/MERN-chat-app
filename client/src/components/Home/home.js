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
        <div className='p-8 border shadow w-80 md:w-96'>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col justify-center items-center pb-4'>
                <div className='text-blue-800 py-6'>
                    <div className='text-center'>WELCOME TO MY</div>
                    <div className='text-center'>WEB CHAT</div>
                    <div className='text-center'>APPLICATION</div>    
                </div> 
                <button className='select-none bg-blue-800 hover:bg-blue-600 text-sm 
                            cursor-pointer text-center py-2 text-white px-4 rounded'>
                            LET'S GET STARTED
                </button>
            </div>
            </form>
        </div>
    );
};

export default Home;