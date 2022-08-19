import {AiFillHome, AiFillFire} from 'react-icons/ai'
import { MdAdd, MdNotifications } from 'react-icons/md'
import { BsPersonFill } from 'react-icons/bs'

export const Menu = [
   {
    name: 'home',
    path: '/',
    icon: <AiFillHome />
   },
   {
    name: 'trending',
    path: '/trending',
    icon: <AiFillFire />
   },
   {
    name: 'sell',
    path: '/sell',
    icon: <MdAdd />
   },
   {
    name: 'notification',
    path: '/notification',
    icon: <MdNotifications />
   },
   {
    name: 'profile',
    path: '/profile',
    icon: <BsPersonFill />
   }
  ]
