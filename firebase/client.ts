// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore';

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRoiGXPlfJoz0_yhz6dSAmqCCcbEpRuEM",
  authDomain: "prepify-eab92.firebaseapp.com",
  projectId: "prepify-eab92",
  storageBucket: "prepify-eab92.firebasestorage.app",
  messagingSenderId: "230859410304",
  appId: "1:230859410304:web:73738090fef81efa0e0f65",
  measurementId: "G-DMS9SKVPEM"
};

// Initialize Firebase
const app = !getApps.length?initializeApp(firebaseConfig):getApp();

export const auth=getAuth(app);
export const db=getFirestore(app);
