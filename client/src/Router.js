import React, { useContext } from 'react';
import {Routes,Route} from 'react-router-dom';
import Chatroom from './components/Chatroom/chatroom';
import Dashboard from './components/Dashboard/dashboard';
import Home from './components/Home/home';
import Login from './components/Login/login';
import Register from './components/Register/register';
import AuthContext from './hoc/auth';

const Router = () => {
    const {loggedIn} = useContext(AuthContext)

    return (
        <div>
            <Routes>
                <Route path='/' element={<Home/>}></Route>
                {loggedIn===false?
                    <>
                    <Route path='/login' element={<Login/>}></Route>
                    <Route path='/register' element={<Register/>}></Route>
                    </>   
                :
                <>
                    <Route path='/dashboard' element={<Dashboard/>}></Route>
                    <Route path='/chatroom/:id' element={<Chatroom/>}></Route>
                    </>
                }
            </Routes>
        </div>
    );
};

export default Router;