/* jshint esversion: 6 */
/* jshint esversion: 8 */
/* jshint ignore:start */
import React, { useContext, useEffect, useRef, useState } from "react";
import ShowPassword from "../Icon/eye.svg";
import HidePassword from "../Icon/eye-slash.svg";
import EmailIcon from "../Icon/envelope.svg";
import UblockIcon from "../Icon/unlock.svg";
import "react-phone-number-input/style.css";
import CloseIcon from "../Icon/times.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../Context/MyProvider";
import { TodoContext } from "../Context";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../Users_Chats/Firebase";
import { showTost } from "../showTost";
import { uid } from "uid";
import { initOneSignal } from "../utils/OneSignalInit";
import logo from "../images/logos/meet-greek.png";
import { useTranslation } from "react-i18next";

import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "../Users_Chats/Firebase";

const Login = () => {
  const { t } = useTranslation();
  const Data = useContext(TodoContext);
  const { basUrl, userId, setUserId } = useContext(MyContext);

  const [Email, setemail] = useState("");
  const [Password, setpassword] = useState("");
  const [Confirm, setconfirm] = useState();
  const [Password2, setpassword2] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [value, setValue] = useState();
  const [otpValue, setOtpValue] = useState([]);
  const [checkOtp, setChechOtp] = useState();
  const [passwordShow, setPasswordShow] = useState(false);
  const [otpShow, setOtpShow] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  const navigate = useNavigate();

  const Show = useRef();
  const Hide = useRef();
  const inputFocus = useRef();
  const Inputref = useRef(Array.from({ length: 6 }, () => null));

  function myFunction() {
    var x = document.getElementById("input");
    if (x.type === "password") {
      x.type = "text";
      Show.current.style.display = "block";
      Hide.current.style.display = "none";
    } else {
      x.type = "password";
      Hide.current.style.display = "block";
      Show.current.style.display = "none";
    }
  }

  // ============================================
  // GOOGLE SIGN-IN HANDLER
  // ============================================
  const signInWithGoogle = async () => {
    try {
      setGoogleLoading(true);
      
      // Step 1: Authenticate with Firebase/Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("✅ Google Authentication Success");
      console.log("Google User Data:", {
        email: user.email,
        name: user.displayName,
        uid: user.uid,
        photo: user.photoURL,
      });

      // Step 2: Prepare data for your backend API
      const socialLoginData = {
        email: user.email,
        name: user.displayName || "",
        provider: "google",
        provider_id: user.uid,
        profile_pic: user.photoURL || "",
      };

      console.log("📤 Sending to social_login.php:", socialLoginData);

      // Step 3: Call your backend social_login.php API
      const res = await axios.post(
        `${basUrl}social_login.php`,
        socialLoginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📥 Backend Response:", res.data);

      // Step 4: Handle backend response
      if (res.data.Result === "true") {
        const backendUser = res.data.UserLogin;

        // Store authentication data
        const backendToken = res.data.token || uid(32);
        localStorage.setItem("token", backendToken);
        localStorage.setItem("UserId", backendUser.id);
        localStorage.setItem("Register_User", JSON.stringify(backendUser));
        localStorage.setItem("firebaseUser", JSON.stringify(user));

        showTost({ 
          title: res.data.ResponseMsg || "Google Sign-in successful!" 
        });

        Data.setDemo(Data.demo + "123");

        // Add user to Firestore
        UserAddHandler(backendUser);

        // Check onboarding status
        const onboardingStatus = (backendUser.onboarding_status || "").toLowerCase();
        const redirectPath = onboardingStatus === "completed" ? "/dashboard" : "/image";

        // Save to Firestore in background
        saveUserToFirestore(backendUser, onboardingStatus);

        // Navigate
        setTimeout(() => navigate(redirectPath), 500);

      } else {
        // Backend rejected the social login
        showTost({
          title: res.data.ResponseMsg || "Google Sign-in failed. Please try again.",
        });
        
        await auth.signOut();
      }

    } catch (error) {
      console.error("❌ Google Sign-In Error:", error);
      
      if (error.code === "auth/popup-closed-by-user") {
        showTost({ title: "Sign-in cancelled" });
      } else if (error.code === "auth/popup-blocked") {
        showTost({ title: "Pop-up blocked. Please allow pop-ups and try again." });
      } else if (error.response) {
        showTost({ 
          title: error.response.data?.ResponseMsg || "Server error. Please try again." 
        });
      } else if (error.message.includes("Network Error")) {
        showTost({ title: "Network error. Please check your connection." });
      } else {
        showTost({ title: "Google Sign-in failed. Please try again." });
      }
      
      try {
        await auth.signOut();
      } catch (signOutError) {
        console.error("Sign out error:", signOutError);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

// ============================================
// FACEBOOK SIGN-IN HANDLER - ADD THIS
// ============================================
const signInWithFacebook = async () => {
  try {
    setFacebookLoading(true);
    
    const facebookProvider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;

    console.log("✅ Facebook Authentication Success");

    const socialLoginData = {
      email: user.email || "",
      name: user.displayName || "",
      provider: "facebook",
      provider_id: user.uid,
      profile_pic: user.photoURL || "",
    };

    console.log("📤 Sending to social_login.php:", socialLoginData);

    const res = await axios.post(
      `${basUrl}social_login.php`,
      socialLoginData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📥 Backend Response:", res.data);

    if (res.data.Result === "true") {
      const backendUser = res.data.UserLogin;

      const backendToken = res.data.token || uid(32);
      localStorage.setItem("token", backendToken);
      localStorage.setItem("UserId", backendUser.id);
      localStorage.setItem("Register_User", JSON.stringify(backendUser));
      localStorage.setItem("firebaseUser", JSON.stringify(user));

      showTost({ 
        title: res.data.ResponseMsg || "Facebook Sign-in successful!" 
      });

      Data.setDemo(Data.demo + "123");
      UserAddHandler(backendUser);

      const onboardingStatus = (backendUser.onboarding_status || "").toLowerCase();
      const redirectPath = onboardingStatus === "completed" ? "/dashboard" : "/image";

      saveUserToFirestore(backendUser, onboardingStatus);

      setTimeout(() => navigate(redirectPath), 500);

    } else {
      showTost({
        title: res.data.ResponseMsg || "Facebook Sign-in failed. Please try again.",
      });
      
      await auth.signOut();
    }

  } catch (error) {
    console.error("❌ Facebook Sign-In Error:", error);
    
    if (error.code === "auth/popup-closed-by-user") {
      showTost({ title: "Sign-in cancelled" });
    } else if (error.code === "auth/popup-blocked") {
      showTost({ title: "Pop-up blocked. Please allow pop-ups and try again." });
    } else if (error.code === "auth/account-exists-with-different-credential") {
      showTost({ title: "An account already exists with this email using a different sign-in method." });
    } else if (error.response) {
      showTost({ 
        title: error.response.data?.ResponseMsg || "Server error. Please try again." 
      });
    } else if (error.message.includes("Network Error")) {
      showTost({ title: "Network error. Please check your connection." });
    } else {
      showTost({ title: "Facebook Sign-in failed. Please try again." });
    }
    
    try {
      await auth.signOut();
    } catch (signOutError) {
      console.error("Sign out error:", signOutError);
    }
  } finally {
    setFacebookLoading(false);
  }
};

  // ============================================
  // REGULAR EMAIL/PASSWORD SIGN-IN (UNCHANGED)
  // ============================================
  const SigninHandler = async () => {
    try {
      if (!Email)
        return showTost({ title: t("enterEmailMobile") });
      if (!Password) return showTost({ title: t("enterPassword") });

      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      const isEmail = emailRegex.test(Email);

      let requestData;

      if (isEmail) {
        requestData = {
          email: Email,
          password: Password,
        };
      } else {
        requestData = {
          mobile: Email,
          ccode: "+91",
          password: Password,
        };
      }

      console.log("Sending login request:", JSON.stringify(requestData));

      const res = await axios.post(`${basUrl}user_login.php`, requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Login response:", res.data);

      if (res.data.Result === "true") {
        const user = res.data.UserLogin;

        const backendToken = res.data.token || uid(32);
        localStorage.setItem("token", backendToken);
        localStorage.setItem("UserId", user.id);
        localStorage.setItem("Register_User", JSON.stringify(user));

        showTost({ title: res.data.ResponseMsg });
        Data.setDemo(Data.demo + "123");
        UserAddHandler(user);

        const onboardingStatus = (user.onboarding_status || "").toLowerCase();
        const redirectPath =
          onboardingStatus === "completed" ? "/dashboard" : "/image";

        saveUserToFirestore(user, onboardingStatus);

        setTimeout(() => navigate(redirectPath), 500);
      } else {
        showTost({
          title: res.data.ResponseMsg || t("loginFailed"),
        });
      }
    } catch (err) {
      console.error("🔥 SigninHandler error:", err);
      console.error("Error details:", err.response?.data || err.message);
      showTost({ title: t("loginFailed") });
    }
  };

  // ============================================
  // FIRESTORE SAVE FUNCTION (EXTRACTED FOR REUSE)
  // ============================================
  const saveUserToFirestore = async (user, onboardingStatus) => {
    try {
      const { id, name, email, mobile, profile_pic } = user;

      if (!user) {
        console.error("❌ Firestore save aborted: User object is undefined");
        return;
      }

      if (!id && id !== 0) {
        console.error("❌ Firestore save aborted: User ID is undefined/null", user);
        return;
      }

      const userId = String(id).trim();

      if (!userId || userId === "undefined" || userId === "null") {
        console.error("❌ Firestore save aborted: Invalid user ID after conversion:", userId);
        return;
      }

      console.log("🔄 Creating Firestore reference for user:", userId);

      const userRef = doc(db, "datingUser", userId);
      console.log("🔄 Firestore reference created successfully");

      let fcmToken = "";
      console.log("🔄 Starting Firestore save for user:", userId);

      if (window.OneSignal) {
        try {
          await new Promise((resolve) => {
            window.OneSignal.push(() => {
              console.log("✅ OneSignal is ready");
              resolve();
            });
          });

          await window.OneSignal.setExternalUserId(userId);
          console.log("✅ External user ID set:", userId);

          for (let attempt = 0; attempt < 3; attempt++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            fcmToken = await window.OneSignal.getUserId();
            if (fcmToken) {
              console.log(
                "✅ FCM Token received on attempt",
                attempt + 1,
                ":",
                fcmToken
              );
              break;
            }
          }

          if (!fcmToken) {
            console.warn("⚠️ No FCM token available after 3 attempts");
          }
        } catch (oneSignalError) {
          console.warn("⚠️ OneSignal error:", oneSignalError);
        }
      }

      const userData = {
        uid: userId,
        name: name || "",
        email: email || "",
        number: mobile || "",
        token: fcmToken || "",
        pro_pic: profile_pic || "null",
        isOnline: true,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        onboarding_status: onboardingStatus || "pending",
      };

      console.log("📦 Saving data to Firestore...");
      console.log("📦 User data payload:", userData);

      try {
        await setDoc(userRef, userData, { merge: true });
        console.log("✅ Firestore save completed for user:", userId);
      } catch (setDocError) {
        console.error("🔥 setDoc error:", setDocError);
        console.error("🔥 Error during document set:", {
          message: setDocError.message,
          code: setDocError.code,
          stack: setDocError.stack
        });
      }
    } catch (error) {
      console.error("🔥 Firestore save error:", error);
      console.error("🔥 Full error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
  };

  const toggleBottomSheet = () => {
    setIsVisible(!isVisible);
    setOtpShow(false);
    setValue("");
  };

  const EmailHandler = () => {
    if (value) {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

      if (emailRegex.test(value)) {
        axios.post(`${basUrl}email_check.php`, { email: value })
          .then((res) => {
            console.log("📧 Email Check Response:", res.data);

            if (res.data.Result === "false") {
              console.log("✅ Email verified, proceeding with OTP...");

              axios.post(`${basUrl}email_otp.php`, { email: value })
                .then((otpRes) => {
                  console.log("📨 OTP Send Response:", otpRes.data);

                  if (otpRes.data.Result === "true") {
                    showTost({
                      title: otpRes.data.ResponseMsg || "OTP sent to your email"
                    });

                    if (otpRes.data.otp) {
                      console.log("OTP sent from backend:", otpRes.data.otp);
                      setChechOtp(otpRes.data.otp);
                    }

                    setOtpShow(true);
                    setPasswordShow(false);

                    console.log("🎯 OTP fields should be visible now");
                  } else {
                    showTost({
                      title: otpRes.data.ResponseMsg || "Failed to send OTP"
                    });
                  }
                })
                .catch((otpError) => {
                  console.error("❌ OTP Send Error:", otpError);
                  showTost({ title: "OTP service unavailable" });
                });

            } else {
              showTost({
                title: res.data.ResponseMsg || "Email not registered"
              });
            }
          })
          .catch((error) => {
            console.error("❌ Email Check Error:", error);
            showTost({ title: "Network error. Please try again." });
          });

      } else {
        showTost({ title: "Please enter a valid email address" });
      }
    } else {
      showTost({ title: "Please enter your email" });
    }
  };

  const OtpCheckHandler = async () => {
    console.log("Email for OTP verification:", value);
    console.log("Entered OTP:", otpValue.join(""));

    const enteredOtp = otpValue.join("");

    if (!enteredOtp || enteredOtp.length !== 6) {
      showTost({ title: "Please enter the 6-digit OTP" });
      return;
    }

    try {
      console.log("Sending OTP verification request...");

      const res = await axios.post(`${basUrl}verify_otp.php`, {
        email: value,
        otp: enteredOtp
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("OTP verification response:", res.data);

      if (res.data.Result === "true") {
        showTost({ title: res.data.ResponseMsg || "OTP verified successfully" });
        setOtpShow(false);
        setPasswordShow(true);
        setOtpValue([]);

        if (setChechOtp) {
          setChechOtp(null);
        }
      } else {
        showTost({ title: res.data.ResponseMsg || "Invalid OTP" });
        setOtpValue([]);
        if (Inputref.current && Inputref.current[0]) {
          Inputref.current[0].focus();
        }
      }
    } catch (err) {
      console.error("OTP verification error:", err);

      if (err.response?.data?.ResponseMsg) {
        showTost({ title: err.response.data.ResponseMsg });
      } else if (err.message.includes("Network Error")) {
        showTost({ title: "Network error. Please check your connection." });
      } else {
        showTost({ title: "Failed to verify OTP. Please try again." });
      }

      setOtpValue([]);
      if (Inputref.current && Inputref.current[0]) {
        Inputref.current[0].focus();
      }
    }
  };

  const SubmitHandler = () => {
    if (Password2) {
      if (Confirm) {
        if (Password2 === Confirm) {
          axios
            .post(`${basUrl}forget_password.php`, {
              email: value,
              password: Confirm,
            })
            .then((res) => {
              if (res.data.Result === "true") {
                showTost({ title: res.data.ResponseMsg });
                toggleBottomSheet();
                setValue("");
                setOtpValue("");
                setpassword2("");
                setconfirm("");
                setPasswordShow(false);
              }
            });
        } else {
          showTost({ title: t("passwordsNotMatch") });
        }
      } else {
        showTost({ title: t("enterConfirmPassword") });
      }
    } else {
      showTost({ title: t("enterPasswordField") });
    }
  };

  const HandleChange = (index, value) => {
    const Otp = [...otpValue];
    Otp[index] = value;
    setOtpValue(Otp);

    if (value && !isNaN(value) && index < Inputref.current.length - 1) {
      Inputref.current[index + 1].focus();
    }
  };

  const InputHandler = (index, e) => {
    if (e.key === "Backspace" && index > 0 && !e.target.value) {
      Inputref.current[index - 1].focus();
    }
  };

  const UserAddHandler = (data) => {
    try {
      if (!data) {
        console.error("❌ UserAddHandler: No user data provided");
        return;
      }

      if (!data.id && data.id !== 0) {
        console.error("❌ UserAddHandler: User ID is undefined/null", data);
        return;
      }

      const userId = String(data.id).trim();

      if (!userId || userId === "undefined" || userId === "null") {
        console.error("❌ UserAddHandler: Invalid user ID after conversion", userId);
        return;
      }

      console.log("🔄 UserAddHandler: Processing user ID:", userId);

      const userRef = doc(db, "datingUser", userId);

      getDoc(userRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            updateDoc(userRef, {
              isOnline: true,
              updated_at: new Date().toISOString(),
            });
            console.log("✅ UserAddHandler: Existing user updated as online");
          } else {
            const Pro_Pic = data.profile_pic;
            setDoc(userRef, {
              uid: userId,
              email: data.email || "",
              isOnline: true,
              name: data.name || "",
              number: data.mobile || "",
              pro_pic: Pro_Pic ? Pro_Pic : "null",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
            console.log("✅ UserAddHandler: New user created in Firestore");
          }
        })
        .catch((error) => {
          console.error("🔥 UserAddHandler: Firestore operation failed:", error);
        });

    } catch (error) {
      console.error("🔥 UserAddHandler: Unexpected error:", error);
    }
  };

  return (
    <div>
      <div>
        <div className="w-[100%] max-_430_:bg-white multisteup-wrapper max-_430_:h-[100vh] relative Test">
          <div className="container mx-auto">
            <section className="steps step-1 active rounded-[40px] relative ">
              <div>
                <div className="flex justify-center items-center">
                  <img src={logo} alt="" width={40} height={60} />
                </div>
                <h1 className="text-[28px] max-_430_:text-[27px] font-[600] text-[#222222] text-center">
                  {t("welcome")}
                </h1>
                <p className="text-[20px] mt-[10px] max-_430_:text-[20px] max-_380_:text-[16px] text-[#333333] font-normal text-center mb-3">
                  {t("subtitle")}
                </p>
              </div>

              <div className="mt-[20px] w-[100%] space-y-5">
                {/* Email/Phone Input */}
                <div>
                  <label htmlFor="" className="font-semibold">
                    {t("emailMobileLabel")}
                  </label>
                  <div className="bg-white border-2 flex items-center gap-[15px] focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 px-[15px] py-[15px] rounded-xl shadow-sm transition-all duration-200">
                    <img src={EmailIcon} alt="" className="w-[20px] h-[20px]" />
                    <input
                      className="text-black w-[100%] outline-none bg-transparent"
                      type="Email"
                      placeholder={t("emailMobilePlaceholder")}
                      onChange={(e) => setemail(e.target.value)}
                      value={Email}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div>
                    <label htmlFor="" className="font-semibold">
                      {t("passwordLabel")}
                    </label>
                    <div className="bg-white border-2 flex items-center gap-[15px] focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 px-[15px] py-[15px] rounded-xl shadow-sm transition-all duration-200">
                      <img
                        src={UblockIcon}
                        alt=""
                        className="w-[20px] h-[20px]"
                      />
                      <input
                        id="input"
                        type="text"
                        className="text-black w-[100%] outline-none bg-transparent"
                        placeholder={t("passwordPlaceholder")}
                        onChange={(e) => setpassword(e.target.value)}
                        value={Password}
                      />
                    </div>
                  </div>

                  <button onClick={() => myFunction()}>
                    <img
                      ref={Show}
                      src={ShowPassword}
                      alt="Show"
                      className="w-[25px] h-[25px] absolute top-1/2 transform -translate-y-1/2 right-5"
                    />
                    <img
                      ref={Hide}
                      src={HidePassword}
                      alt="Hide"
                      className="w-[25px] h-[25px] hidden absolute top-1/2 transform -translate-y-1/2 right-5"
                    />
                  </button>
                </div>

                {/* Forgot Password */}
                <button
                  onClick={toggleBottomSheet}
                  className="font-[500] text-[16px] no-underline text-black block w-full text-left"
                >
                  {t("forgotPassword")}{" "}
                  <span className="text-amber-600 hover:text-amber-700 transition-colors duration-150">
                    {t("resetIt")}
                  </span>
                </button>

                {/* Sign In Button */}
                <button
                  onClick={SigninHandler}
                  className="font-bold text-[18px] rounded-full mt-[5px] text-white py-[15px] w-[100%] bg-[#1F5799] transition-colors duration-200 shadow-sm"
                >
                  {t("signIn")}
                </button>

                {/* OR Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-[1px] bg-gray-300"></div>
                  <span className="text-gray-500 text-sm">OR</span>
                  <div className="flex-1 h-[1px] bg-gray-300"></div>
                </div>

                {/* Google Sign-In Button */}
                <button
                  onClick={signInWithGoogle}
                  disabled={googleLoading}
                  className="font-bold text-[18px] rounded-full text-gray-700 py-[15px] w-[100%] bg-white border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                        <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                        <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                        <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
                      </svg>
                      <span>Sign in with Google</span>
                    </>
                  )}
                </button>

                {/* Facebook Sign-In Button - NEW */}
             <button
  onClick={signInWithFacebook}
  disabled={facebookLoading}
  className="font-bold text-[18px] rounded-full text-white py-[15px] w-[100%] bg-[#1877F2] hover:bg-[#166FE5] transition-all duration-200 shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {facebookLoading ? (
    <>
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Signing in...</span>
    </>
  ) : (
    <>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      <span>Sign in with Facebook</span>
    </>
  )}
</button>
              </div>

              {/* Sign Up Link */}
              <Link
                to="/register"
                className="pt-[20px] font-[500] text-[16px] no-underline text-black block w-full text-center"
              >
                {t("noAccount")}{" "}
                <span className="text-amber-600 hover:text-amber-700 transition-colors duration-150">
                  {t("signUp")}
                </span>
              </Link>

              {/* Bottom Sheet - UNCHANGED */}
              {isVisible && (
                <div onClick={toggleBottomSheet} className="bottom-sheet">
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="bottom-sheet-content"
                  >
                    <div className="bg-white rounded-2xl shadow-lg p-5">
                      <div className="flex items-center justify-between mb-[15px]">
                        <h1 className="text-[18px] m-0 text-black font-[500]">
                          {t("resetPassword")}
                        </h1>
                        <img
                          onClick={toggleBottomSheet}
                          src={CloseIcon}
                          alt=""
                          className="cursor-pointer"
                        />
                      </div>

                      <div className="bg-white border-2 border-gray-300 relative rounded-xl focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] transition-all duration-200">
                        {!value && (
                          <label
                            onClick={() => inputFocus.current.focus()}
                            className="text-[16px] absolute top-[10px] left-[60px] text-gray-400 font-[500] pointer-events-none"
                          >
                          </label>
                        )}
                        <input
                          ref={inputFocus}
                          className="text-black w-[100%] px-[15px] py-[10px] font-[500] bg-transparent border-[2px] border-gray-300 rounded-[10px] outline-none focus:border-[#C89A3D]"
                          type="email"
                          placeholder={t("enterEmailAddress")}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          style={{
                            outline: "none",
                            backgroundColor: "transparent",
                          }}
                        />
                      </div>

                      {otpShow && (
                        <div className="mt-[15px]">
                          <h1 className="text-[18px] m-0 text-black font-[500]">
                            {t("enterOtp")}
                          </h1>
                          <div className="flex items-center mt-[20px] justify-center gap-[10px]">
                            {Inputref.current.map((ref, index) => {
                              return (
                                <input
                                  key={index}
                                  ref={(e) => (Inputref.current[index] = e)}
                                  onChange={(e) =>
                                    HandleChange(index, e.target.value)
                                  }
                                  onKeyDown={(e) => InputHandler(index, e)}
                                  type="text"
                                  className="form-control font-[600] input-otpnumber outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] bg-white border-2 border-gray-300 rounded-xl w-12 h-12 text-center"
                                  name="otp1"
                                  id="otp1"
                                  maxLength="1"
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {passwordShow && (
                        <div className="space-y-4">
                          <div>
                            <h1 className="text-[18px] mt-[15px] mb-0 text-black font-[500]">
                              {t("password")}
                            </h1>
                            <input
                              onChange={(e) => setpassword2(e.target.value)}
                              value={Password2}
                              className="text-black w-[100%] border-2 outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 bg-white px-[15px] py-[10px] rounded-xl shadow-sm transition-all duration-200"
                              type="text"
                              placeholder={t("password")}
                            />
                          </div>
                          <div>
                            <h1 className="text-[18px] m-0 text-black font-[500]">
                              {t("confirmPassword")}
                            </h1>
                            <input
                              value={Confirm}
                              onChange={(e) => setconfirm(e.target.value)}
                              className="text-black w-[100%] border-2 mt-[10px] outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 bg-white px-[15px] py-[10px] rounded-xl shadow-sm transition-all duration-200"
                              type="text"
                              placeholder={t("confirmPassword")}
                            />
                          </div>
                        </div>
                      )}

                      <button
                        onClick={
                          otpShow
                            ? OtpCheckHandler
                            : passwordShow
                              ? SubmitHandler
                              : EmailHandler
                        }
                        className="font-bold text-[18px] rounded-full mt-[20px] text-white py-[10px] w-[100%] bg-[#1F5799] transition-colors duration-200 shadow-sm"
                      >
                        {otpShow
                          ? t("check")
                          : passwordShow
                            ? t("change")
                            : t("continue")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
/* jshint ignore:end */