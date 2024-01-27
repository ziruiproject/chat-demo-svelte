// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyArgcGUJ9i6mSq14nAwRwyS2K3otb4-Ai8",
    authDomain: "chatapp-9f77c.firebaseapp.com",
    projectId: "chatapp-9f77c",
    storageBucket: "chatapp-9f77c.appspot.com",
    messagingSenderId: "152345159548",
    appId: "1:152345159548:web:339817a4553324ba64e6f9",
    measurementId: "G-P9S5RJTEBH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)