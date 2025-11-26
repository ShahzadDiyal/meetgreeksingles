// src/utils/saveUserToFirestore.js
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../Users_Chats/Firebase";

export const saveUserToFirestore = async (userData) => {
  const { id, name, email, number, pro_pic } = userData;
  const userRef = doc(db, "datingUser", id);

  let token = "";
  if (window.OneSignal) {
    try {
      // Wait for OneSignal ready
      await new Promise((resolve) => window.OneSignal.push(resolve));

      // Wait for subscription
      const isSubscribed = await window.OneSignal.isPushNotificationsEnabled();
      if (isSubscribed) {
        token = await window.OneSignal.getUserId();
        console.log("Token fetched:", token);
      }
    } catch (err) {
      console.warn("OneSignal not ready");
    }
  }

  const data = {
    uid: id,
    name,
    email,
    number,
    token: token || "",
    pro_pic: pro_pic || "null",
    isOnline: true,
    last_seen: new Date().toISOString(),
  };

  console.log("data", data)

  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      await updateDoc(userRef, data);
    } else {
      await setDoc(userRef, data);
    }
    console.log("Firestore saved with token:", token);
  } catch (err) {
    console.error("Firestore error:", err);
  }
};