import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAtaEJuL4-HerCJ2MAVsyl7QqQSd0JTzk8",
  authDomain: "event-registration-79841.firebaseapp.com",
  databaseURL: "https://event-registration-79841-default-rtdb.firebaseio.com",
  projectId: "event-registration-79841",
  storageBucket: "event-registration-79841.firebasestorage.app",
  messagingSenderId: "696206794750",
  appId: "1:696206794750:web:c6e335c76a8fd61292eaaf",
  measurementId: "G-SVWRPEKE37"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// export const analytics = getAnalytics(app); // Disabled due to build environment issues

export default app;
