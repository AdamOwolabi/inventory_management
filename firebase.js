// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhgT0-pjlbmnaiBt7ZrlmGHJIHVYhdB7Q",
  authDomain: "inventory-management-4981f.firebaseapp.com",
  projectId: "inventory-management-4981f",
  storageBucket: "inventory-management-4981f.appspot.com",
  messagingSenderId: "667080752553",
  appId: "1:667080752553:web:f847e8971b91612959d8b8",
  measurementId: "G-2ELW3XE4FQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export {firestore, auth};
export default app