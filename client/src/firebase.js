// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRBASE_API_KEY,
  authDomain: "mern-stack-blog-16a27.firebaseapp.com",
  projectId: "mern-stack-blog-16a27",
  storageBucket: "mern-stack-blog-16a27.appspot.com",
  messagingSenderId: "1098516601089",
  appId: "1:1098516601089:web:9b7deceac3a2aef07ca300",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
