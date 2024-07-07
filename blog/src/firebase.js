// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-2e34f.firebaseapp.com",
  projectId: "mern-blog-2e34f",
  storageBucket: "mern-blog-2e34f.appspot.com",
  messagingSenderId: "223638506172",
  appId: "1:223638506172:web:f1bd7c70d4d7f2a7155eb9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

//setting up the fire base pop up authentication
