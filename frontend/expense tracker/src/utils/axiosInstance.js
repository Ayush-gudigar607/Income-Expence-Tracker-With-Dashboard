import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BASE_URL } from './apiPath';

const axiosInstance=axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json"
    }
});


//Request Interceptor
axiosInstance.interceptors.request.use((config)=>
{
    const accessToken=localStorage.getItem("token");

    if(accessToken)
    {
        config.headers.Authorization=`Bearer ${accessToken}`;

    }
    return config;

},
(error)=>
{
    return Promise.reject(error);
});

//Response Interceptor
axiosInstance.interceptors.response.use((response)=>
{
    return response;
},(error)=>
{

    //Handle common errors here
    if(error.response)
    {
        if(error.response.status===401)
        {
            //Redirect to login Page
            toast.error("Session expired. Please login again.");
            window.location.href="/login";
        }
        else if(error.response.status===500)
        {
            toast.error("Server error. Please try again later.");
            console.error("Server Error:", error.response.data);
        }
        else if(error.response.status===400)
        {
            toast.error(error.response.data?.message || "Bad request. Please check your input.");
        }
        else if(error.response.status===403)
        {
            toast.error("Access denied.");
        }
        
        return Promise.reject(error);
    }
    else if(error.code ==="ECONNABORTED")
    {
        toast.error("Request timeout. Please try again later.");
        return Promise.reject(error);
    }
    else if(!error.response)
    {
        toast.error("Network error. Please check your connection.");
        console.error("Network Error:", error);
    }

    return Promise.reject(error);
})


export default axiosInstance;
