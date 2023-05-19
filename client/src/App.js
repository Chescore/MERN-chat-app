import React from 'react';
import Layout from './hoc/layout';
import Router from './Router';
import axios from 'axios';
import { AuthContextProvider } from './hoc/auth';
import  {SetUpSocket} from './hoc/setupSocket';

axios.defaults.withCredentials = true

function App() {
  return (
    <div className='font-spectral'>
      <AuthContextProvider>
        <SetUpSocket>
          <Layout>
            <Router/>
          </Layout>
        </SetUpSocket>
      </AuthContextProvider>
    </div>
  );
}

export default App;
