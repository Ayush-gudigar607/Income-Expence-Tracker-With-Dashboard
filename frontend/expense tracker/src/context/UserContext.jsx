import React, {createContext,useState, useEffect} from 'react'
import axiosInstance from '../utils/axiosInstance.js';
import { API_PATHS } from '../utils/apiPath.js';

export const UserContext=createContext()

const UserProvider=({children}) => {
    const [user, setUser] = useState(null)

    //Function to update user Data
    const updateUser=(userData)=>
    {
        setUser(userData);
    }

    //function to clear user data on logout

    const clearUser=()=>
    {
        setUser(null);
    }

    // Load user on mount if token exists
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // Fetch user info
            axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO)
                .then(response => {
                    updateUser(response.data.user);
                })
                .catch(error => {
                    console.error("Failed to load user:", error);
                    localStorage.removeItem("token");
                });
        }
    }, []);

    return(
       <UserContext.Provider value={{user,updateUser,clearUser}}> 
        {children}
       </UserContext.Provider>
    )
}
    
export default UserProvider;

