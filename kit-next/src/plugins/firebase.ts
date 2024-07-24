// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCk--T6iTVoXfyx8Gwnji_gdXlYh26SZEQ",
  authDomain: "kclhack2024.firebaseapp.com",
  projectId: "kclhack2024",
  storageBucket: "kclhack2024.appspot.com",
  messagingSenderId: "923121938914",
  appId: "1:923121938914:web:9db2b94a73b79eca3d49bb",
  measurementId: "G-6KKSGQ1SBN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);