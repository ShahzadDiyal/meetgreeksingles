import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvSdiWJ2hEeEHnFlE_bzvShvS0aDeOAfo",
  authDomain: "meetgreeksingles.firebaseapp.com",
  projectId: "meetgreeksingles",
  storageBucket: "meetgreeksingles.firebasestorage.app",
  messagingSenderId: "907263423139",
  appId: "1:907263423139:web:7c42633075d4796a540516",
  measurementId: "G-GNM0MDN284",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const database = getDatabase(app);
const messaging = getMessaging(app);

// Export initialized Firebase services
export { db, database, messaging };