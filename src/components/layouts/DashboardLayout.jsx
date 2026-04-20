import React, { useContext } from 'react'
import {UserContext} from "../../context/userContext"
import Navbar from './Navbar';

const DashboardLayout = ({children}) => {
  const {user} =useContext(UserContext);
  
  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-black'>
      <Navbar/>
      {user && <div>{children}</div>}
    </div>
  )
}

export default DashboardLayout