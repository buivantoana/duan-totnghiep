
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
const firebaseConfig = {
  apiKey: "AIzaSyBN1G9amttkqgkxQrtNv_Tcs9t4nXCs1P4",
  authDomain: "sneakerhubs.firebaseapp.com",
  projectId: "sneakerhubs",
  storageBucket: "sneakerhubs.firebasestorage.app",
  messagingSenderId: "854501564771",
  appId: "1:854501564771:web:8a62c40eeae0fa35137356",
  measurementId: "G-QLZSBYTLJE"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig)
export default firebase;
export const authentication = getAuth(initializeApp(firebaseConfig))


