import React from 'react'
import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import { Menu } from './MenuLinks'


const Navbar = () => {
  const activeLink =
    "flex items-center flex-col rounded-lg text-input-border";
  const normalLink =
    "flex items-center flex-col rounded-lg text-white";

  return (
    <footer className='fixed left-0 bottom-0 right-0 h-20 bg-navbar z-[1000] flex justify-center items-center'>
     <nav className='w-full mt-3 overflow-y-hidden'>
      <div className='m-0 p-0 flex justify-evenly items-center'>
       {Menu.map((menu) => (
        <NavLink
       to={menu.path}
       key={menu.name}
       className={({ isActive}) => (isActive ? activeLink : normalLink)}>
        <div className='text-2xl'>
        {menu.icon}
        </div>
        <p className='capitalize text-sm'>{menu.name}</p>
       </NavLink>
       ))}
      </div>
     </nav>
    </footer>
  )
}

export default Navbar