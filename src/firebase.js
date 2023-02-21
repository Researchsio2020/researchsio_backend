import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCEHnX4Fm_Oj7gS7y0WT7Gg27KHWBtYmVI",
  authDomain: "researchsio-eba72.firebaseapp.com",
  projectId: "researchsio-eba72",
  storageBucket: "researchsio-eba72.appspot.com",
  messagingSenderId: "539067853447",
  appId: "1:539067853447:web:5f679224ffed48c47d6622",
  measurementId: "G-ZQ8L9B863H",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
