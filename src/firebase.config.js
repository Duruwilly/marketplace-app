import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "willtta-marketplace-app.firebaseapp.com",
  projectId: "willtta-marketplace-app",
  storageBucket: "willtta-marketplace-app.appspot.com",
  messagingSenderId: "594723386116",
  appId: process.env.REACT_APP_API_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()