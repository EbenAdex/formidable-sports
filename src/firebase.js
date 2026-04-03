// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcmEHASTv1E_iUKTpqNwFKbjFljHHFZNc",
  authDomain: "formidable-sports.firebaseapp.com",
  projectId: "formidable-sports",
  storageBucket: "formidable-sports.firebasestorage.app",
  messagingSenderId: "1022986169982",
  appId: "1:1022986169982:web:7e434d052449a60362722f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;