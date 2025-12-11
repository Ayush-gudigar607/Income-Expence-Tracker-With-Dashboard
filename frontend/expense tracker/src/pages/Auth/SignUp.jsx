import React, { useState,useContext } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/inputes/Input.jsx";
import ProfilePhotoSelector from "../../components/inputes/ProfilePhotoSelector.jsx";
import { validateEmail } from "../../utils/helper.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPath.js";
import { UserContext } from '../../context/UserContext.jsx';
import uploadImage from "../../utils/uploadImage.js";

const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const {updateUser}=useContext(UserContext);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    

    let profileUrl=""


    // Validation example
    if (!fullname || !email || !password) {
      setError("All fields are required!");
      return;
    }

     if(!validateEmail(email))
    {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
try {

  if(profilePic)
  {
    const imageUploadRes=await uploadImage(profilePic);
    profileUrl=imageUploadRes.imageUrl || "";
  }
  const responce=await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
    fullname,
    email,
    password,
    profileImageUrl: profileUrl
  })

  const {token, ...user}=responce.data;

  if(token)
{
  localStorage.setItem("token",token);
  updateUser(user);
  navigate("/dashboard");
}
} catch (error) {
  if(error.response && error.response.data && error.response.data.message)
  {
    setError(error.response.data.message);
  }
  else
  {
    setError("Something went wrong. Please try again later.");
  }
}
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create Account</h3>
        <p className="text-xs text-slate-700 mt-[50px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>

          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <Input
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            type="text"
            label="Full Name"
            placeholder="Enter full name"
          />

          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            label="Email Address"
            placeholder="Enter email"
          />

          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            label="Password"
            placeholder="Min 8 character password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            SIGN UP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;
