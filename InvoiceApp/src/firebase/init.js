import { getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC97JHNLqU2wPJ1mJsJtKszHYikxkJVKpI",
  authDomain: "invoice-app-pl.firebaseapp.com",
  projectId: "invoice-app-pl",
  storageBucket: "invoice-app-pl.appspot.com",
  messagingSenderId: "860028873900",
  appId: "1:860028873900:web:dae5fa82dffe91c6694309"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
  db, 
  auth
};