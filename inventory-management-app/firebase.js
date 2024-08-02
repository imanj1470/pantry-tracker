// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration



require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: "pantry-tracker-app-53871.firebaseapp.com",
  projectId: "pantry-tracker-app-53871",
  storageBucket: "pantry-tracker-app-53871.appspot.com",
  messagingSenderId: "533303563078",
  appId: "1:533303563078:web:e3c22d6937c5f9fbd78b47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };

// stoppoint is 13:34