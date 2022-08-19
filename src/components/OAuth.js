import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import {doc, setDoc, getDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import { FcGoogle } from 'react-icons/fc'

const OAuth = () => {
 const navigate = useNavigate()
 const location = useLocation()
  return <div className='text-center cursor-pointer'>
   <p>Sign {location.pathname === '/register' ? 'up' : 'in'}</p>
  </div>
}

export default OAuth