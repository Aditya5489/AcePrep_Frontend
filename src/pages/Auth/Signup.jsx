import React, { useState, useRef } from 'react';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  LockClosedIcon, 
  EnvelopeIcon, 
  UserIcon, 
  TrashIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { validateEmail } from '../../utils/helper';
import { UserContext } from '../../context/userContext';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';




const Signup = () => {
  const navigate=useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null); 
  const [error,setError]=useState("");
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    profilePic:null,
    name: '',
    email: '',
    password: ''
  });
  const { updateUser } = React.useContext(UserContext);

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveProfilePic = () => {
    setProfilePic(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadImageToCloudinary = async () => {
    if (!profilePic) return "";

    const data = new FormData();
    data.append("image", profilePic);

    const res = await axiosInstance.post(
      "/api/auth/upload-image",
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    

    return res.data.imageUrl;
  };


  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!formData.name.trim()){
      setError("Please enter your full name.");
      return;
    }
    if(!validateEmail(formData.email)){
      setError('Please enter a valid email address.');
      return;
    }
    if(formData.password.length<6){
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    try{
      const imageUrl = await uploadImageToCloudinary();
      const { data } = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          profilePic: imageUrl
        }
      );

      localStorage.setItem("token", data.token);
      updateUser(data); 
      navigate("/dashboard");
    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
          Create Account
        </h2>
        <p className="text-gray-400 mt-2">Start your journey to interview success</p>
      </div>  
      <div className="flex flex-col items-center mb-4">
        <div className="relative">
          <div 
            className="w-24 h-24 rounded-full bg-gray-800/70 border-2 border-gray-700 flex items-center justify-center cursor-pointer overflow-hidden hover:border-cyan-500 transition-colors"
            onClick={handleProfilePicClick}
          >
            {profilePic ? (
              <img src={preview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserCircleIcon className="w-16 h-16 text-gray-500" />
            )}
          </div>
          {preview && (
            <button
              type="button"
              onClick={handleRemoveProfilePic}
              className="absolute -bottom-2 -right-2 bg-red-500/90 hover:bg-red-600 rounded-full p-1.5 shadow-lg transition-colors"
              title="Remove profile picture"
            >
              <TrashIcon className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleProfilePicChange}
          accept="image/*"
          className="hidden"
        />
        <span className="text-sm text-gray-400 mt-2">
          {profilePic ? 'Click to change' : 'Click to upload profile picture'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-400 transition-colors" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-400 transition-colors" />
                )}
              </button>
            </div>
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/25 flex items-center justify-center group"
        >
          Create Account
          <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};

export default Signup;