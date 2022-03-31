import React, { createContext,useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthContextProvider = ({children}) => {
    const [loggedIn,setLoggedIn] = useState(undefined);

    const getLoggedIn = () =>{
        const token = localStorage.getItem("CC_Token")
        if(!token) setLoggedIn(false)
        if(token) setLoggedIn(true)
    }

    useEffect(()=>{
        getLoggedIn()
    })   

    return (
        <AuthContext.Provider value={{loggedIn,getLoggedIn}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext
export {AuthContextProvider};