import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9OspBnzuZJ829ou03oRCP5WYGnrHyYsI",
  authDomain: "willtta-marketplace-app.firebaseapp.com",
  projectId: "willtta-marketplace-app",
  storageBucket: "willtta-marketplace-app.appspot.com",
  messagingSenderId: "594723386116",
  appId: "1:594723386116:web:c09c9001f411f70e4fd651",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()