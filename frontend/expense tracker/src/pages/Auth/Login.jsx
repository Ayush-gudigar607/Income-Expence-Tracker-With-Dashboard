import { useState, useContext } from 'react';
import AuthLayout from '../../components/Layouts/AuthLayout.jsx'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../../components/inputes/Input.jsx'
import { validateEmail } from "../../utils/helper.js";
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPath.js';
import { UserContext } from '../../context/UserContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const {updateUser}=useContext(UserContext);

  const navigate = useNavigate()

  // Handle Login
  const HandleLogin = async (e) => {
    e.preventDefault()
    
   

    // Simple validation
    if (!email || !password) {
      setError("All fields are required!")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

     if(!validateEmail(email))
    {
      setError("Please enter a valid email address.");
      return;
    }

    setError("") // clear error

    // You can add API call here later

    try{
      const responce=await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password
      });

      const {token, ...user}=responce.data

      if(token)
      {
        localStorage.setItem("token",token);
        updateUser(user);
        navigate("/dashboard");
      }
      
    }
    catch(error)  
    {
      if(error.response && error.response.data && error.response.data.message)
      {
        console.log(error.response.data.message);
        setError(error.response.data.message);
      }
      else{
        setError("Something went wrong. Please try again later.");
      }
    }

   
 // redirect after login
  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        
        <h3 className='text-xl font-semibold text-purple-600/60 text-center'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[50px] mb-6'>
          Please Enter Your Details To Login
        </p>

        <form onSubmit={HandleLogin}>

          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            label="Email Address"
            placeholder="john@gmail.com"
          />

          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            label="Password"
            placeholder="Min 8 Character Password"
          />

          {error && (
            <p className="text-red-500 text-xs pb-2.5">{error}</p>
          )}

          <button type="submit" className="btn-primary">
            LOGIN
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              Signup
            </Link>
          </p>
        </form>

      </div>
    </AuthLayout>
  )
}

export default Login
