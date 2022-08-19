import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../assets/logo-plain2-1.png'
import { Menu } from './MenuLinks'


const Sidebar = () => {
 const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg bg-primaryBackground text-white text-xl m-2';
 const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-xl m-2'
  return (
    <div className='bg-navbar min-h-screen flex-[2]'>
     <div className='py-3 px-4'>
     <Link to='/'>
      <img src={Logo} alt="logo" className='h-16 mt-6' />
     </Link>
     <div>
      {Menu.map((menu) => (
       <NavLink
       to={menu.path}
       key={menu.name}
       className={({ isActive}) => (isActive ? activeLink : normalLink)}>
        {menu.icon}
        <span className='capitalize'>{menu.name}</span>
       </NavLink>
      ))}
     </div>
     </div>
    </div>
  )
}

export default Sidebar