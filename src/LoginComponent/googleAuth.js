import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../Users_Chats/Firebase";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;

    console.log("Google Login Success");

    console.log({
      email: user.email,
      name: user.displayName,
      uid: user.uid,
      photo: user.photoURL,
    });

    // Save locally
    localStorage.setItem("firebaseUser", JSON.stringify(user));

    // Redirect
    window.location.href = "/home";

  } catch (error) {
    console.error(error);
  }
};
