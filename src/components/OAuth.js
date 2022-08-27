import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import { FcGoogle } from 'react-icons/fc'

const OAuth = () => {
 const navigate = useNavigate()
 const location = useLocation()

 const onGoogleClick = async () => {
  try {
   const auth = getAuth()
   const provider = new GoogleAuthProvider()
   const result = await signInWithPopup(auth, provider)
   const user = result.user

   // Check for user
   const docRef = doc(db, 'users', user.uid)
   const docSnap = await getDoc(docRef)

   // if user, doesnt exist, create user
   if(!docSnap.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
     name: user.displayName,
     email: user.email,
     timestamp: serverTimestamp()
    })
   }
   navigate('/')
  } catch (error) {
   toast.error('Failed to login with Google')
  }
 }
  return (
    <div
      className="text-center cursor-pointer group relative w-full flex justify-center items-center gap-3 py-2 px-4 text-lg font-medium rounded-md bg-white shadow"
      onClick={onGoogleClick}
    >
      <p>
        Sign {location.pathname === "/register" ? "up" : "in"} with Google
        instead
      </p>
      <FcGoogle />
    </div>
  );
}

export default OAuth