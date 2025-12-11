import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { UserContext } from "../context/UserContext";
import { API_PATHS } from "../utils/apiPath";

export const UseUserAuth = () => {
    const { user, updateUser, clearUser } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (user) return;
        let isMounted = true;

        const fetchUserInfo = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                if (isMounted && response.data) {
                    updateUser(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch user info:", error);
                clearUser();
                navigate("/login");
            }
        };

        fetchUserInfo();

        return () => {
            isMounted = false;
        };
    }, [user, navigate, updateUser, clearUser]);
};