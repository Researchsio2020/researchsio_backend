import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA7fz3EW0m7mFm4ORTwjklxqKHt-0nwPiw",
  authDomain: "researchsio.firebaseapp.com",
  projectId: "researchsio",
  storageBucket: "researchsio.appspot.com",
  messagingSenderId: "282399004670",
  appId: "1:282399004670:web:dc86431e185c4564b6d2af",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
