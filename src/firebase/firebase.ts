// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyAnkhA-SUpxJxEHESTucD_RJ-DGbBdauU0",
  authDomain: "mi-primer-proyecto-c7a87.firebaseapp.com",
  projectId: "mi-primer-proyecto-c7a87",
  storageBucket: "mi-primer-proyecto-c7a87.firebasestorage.app",
  messagingSenderId: "477715202406",
  appId: "1:477715202406:web:012e99ce092fa380eb88a7",
  measurementId: "G-WSGE3WZR71",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, collection, addDoc };

