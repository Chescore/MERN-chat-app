import React from 'react';

const Layout = ({children}) => {
    return (
        <div>
            <div className='flex justify-center items-center h-screen'>{children}</div>
        </div>
    );
};

export default Layout;