// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXzyD7jhEQKjw1Ec4QYejJ5JUiW4rF5MQ",
  authDomain: "luggashare.firebaseapp.com",
  projectId: "luggashare",
  storageBucket: "luggashare.firebasestorage.app",
  messagingSenderId: "243157110299",
  appId: "1:243157110299:web:d6d95f6fb50bab527572be",
  measurementId: "G-W7JZLGJMT7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

