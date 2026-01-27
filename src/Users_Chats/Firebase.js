import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

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

//  Auth
export const auth = getAuth(app);

//  Google Provider
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Firestore
const db = getFirestore(app);

// Realtime DB
const database = getDatabase(app);

// Messaging
const messaging = getMessaging(app);

export { db, database, messaging };
