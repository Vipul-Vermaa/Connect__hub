import React from 'react'
import { CgHome, CgAdd, CgProfile } from 'react-icons/cg'
import { Link } from 'react-router-dom'

const Navbar:React.FC = () => {
  return (
    <div className='flex justify-center items-center w-full p-4 bg-black' >

      <div className='flex space-x-10'>
        <Link to="/" className='text-white'> <CgHome size={24} /> </Link>
        <Link to="/createpost" className='text-white' > <CgAdd size={24} /> </Link>
        <Link to="/profile" className='text-white'> <CgProfile size={24} /> </Link>


      </div>
    </div>
  )
}

export default Navbar
