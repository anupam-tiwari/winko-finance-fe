import React from 'react'
import Navbar from '../components/Navbar'
import landing1 from '../assets/landing1.png'
import landing2 from '../assets/landing2.png'
import landing3 from '../assets/landing3.png'
import landing4 from '../assets/landing4.png'



const Landing = () => {
  return (
    <div>
        <Navbar></Navbar>
        <hr></hr>
        <div className='flex justify-center items-center'>
          <div>
            <div className='py-8'><img src={landing1}></img></div>
            <div className='py-8'><img src={landing2}></img></div>
            <div className='py-8'><img src={landing3}></img></div>
            <div className='py-8'><img src={landing4}></img></div>

          </div>
        
          
        </div>
    </div>
  )
}

export default Landing