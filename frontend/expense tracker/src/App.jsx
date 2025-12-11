import React from 'react'
import {BrowserRouter as Router, Routes, Route,Navigate} from 'react-router-dom'
import Login from './pages/Auth/Login.jsx'
import SignUp from './pages/Auth/SignUp.jsx'
import Home from './pages/Dashboard/Home.jsx'
import Income from './pages/Dashboard/Income.jsx'
import Expence from './pages/Dashboard/Expence.jsx'
import UserProvider from './context/UserContext.jsx'
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root/>} />
          <Route path="/login" exact element={<Login/>} />
          <Route path="/signup" exact element={<SignUp/>}/>
          <Route path="/dashboard" exact element={<Home/>}/>
          <Route path="/income" exact element={<Income/>}/>
          <Route path="/expence" exact element={<Expence/>}/>
        </Routes>
      </Router>
    </div>
    <Toaster 
       toastOptions={{
        className: '',
        style: {
          fontSize: '16px',
        },
      }}
    />
    </UserProvider>
  )
}

export default App

const Root=()=>{
  //Check if the token is exist in localstorage
  const isAuthenticated=!!localStorage.getItem("token");

  //Redirect to dashboard if authenticated,otherwise to login
  return isAuthenticated ? (<Navigate to="/dashboard" />) : (<Navigate to="/login" />);
}