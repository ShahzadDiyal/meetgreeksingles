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
// import { saveUserToFirestore } from "../utils/saveUserToFirestore";
import logo from "../images/logos/meet-greek.png";
import { useTranslation } from "react-i18next";


const Login = () => {
  const { t } = useTranslation(); // Added translation hook
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



  // const SigninHandler = async () => {

  //   try {
  //     // Check if input is empty
  //     if (!Email)
  //       return showTost({ title: t("enterEmailMobile") }); // Updated
  //     if (!Password) return showTost({ title: t("enterPassword") }); // Updated

  //     // Determine if input is email or mobile
  //     const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  //     const isEmail = emailRegex.test(Email);

  //     // Prepare request data based on input type
  //     let requestData;

  //     if (isEmail) {
  //       requestData = {
  //         email: Email, // backend expects mobile
  //         password: Password,
  //       };
  //     } else {
  //       // For mobile login (extract country code if present)
  //       let mobileNumber = Email;
  //       let countryCode = "+91"; // Default to India

  //       // Check if number includes country code
  //       if (Email.startsWith("+")) {
  //         // Extract country code (assume it's + followed by 1-4 digits)
  //         const match = Email.match(/^(\+\d{1,4})(\d+)$/);
  //         if (match) {
  //           countryCode = match[1];
  //           mobileNumber = match[2];
  //         }
  //       }

  //       requestData = {
  //         mobile: Email,
  //         ccode: "+91",
  //         password: Password,
  //       };
  //     }

  //     console.log("Sending login request:", requestData);

  //     // API call for login - use different endpoint or parameters based on your backend
  //     const res = await axios.post(`${basUrl}user_login.php`, requestData);

  //     if (res.data.Result === "true") {
  //       const user = res.data.UserLogin;

  //       // Store backend token in localStorage
  //       const backendToken = res.data.token || uid(32);
  //       localStorage.setItem("token", backendToken);
  //       localStorage.setItem("UserId", user.id);
  //       localStorage.setItem("Register_User", JSON.stringify(user));

  //       showTost({ title: res.data.ResponseMsg });
  //       Data.setDemo(Data.demo + "123");

  //       // --- ONBOARDING STATUS CHECK ---
  //       const onboardingStatus = (user.onboarding_status || "").toLowerCase();
  //       const redirectPath =
  //         onboardingStatus === "completed" ? "/dashboard" : "/image";

  //       // --- SAVE USER TO FIRESTORE (background process) ---
  //       const saveUserToFirestore = async () => {
  //         try {
  //           const { id, name, email, mobile, profile_pic } = user;
  //           const userRef = doc(db, "datingUser", id);

  //           let fcmToken = "";
  //           console.log("🔄 Starting Firestore save for user:", id);

  //           // Get FCM token from OneSignal if available
  //           if (window.OneSignal) {
  //             try {
  //               await new Promise((resolve) => {
  //                 window.OneSignal.push(() => {
  //                   console.log(" OneSignal is ready");
  //                   resolve();
  //                 });
  //               });

  //               await window.OneSignal.setExternalUserId(id);
  //               console.log(" External user ID set:", id);

  //               for (let attempt = 0; attempt < 3; attempt++) {
  //                 await new Promise((resolve) => setTimeout(resolve, 1000));
  //                 fcmToken = await window.OneSignal.getUserId();
  //                 if (fcmToken) {
  //                   console.log(
  //                     " FCM Token received on attempt",
  //                     attempt + 1,
  //                     ":",
  //                     fcmToken
  //                   );
  //                   break;
  //                 }
  //               }

  //               if (!fcmToken) {
  //                 console.warn("⚠️ No FCM token available after 3 attempts");
  //               }
  //             } catch (oneSignalError) {
  //               console.warn(" OneSignal error:", oneSignalError);
  //             }
  //           }

  //           // Prepare user data
  //           const userData = {
  //             uid: id,
  //             name: name || "",
  //             email: email || "",
  //             number: mobile || "",
  //             token: fcmToken || "",
  //             pro_pic: profile_pic || "null",
  //             isOnline: true,
  //             last_seen: new Date().toISOString(),
  //             updated_at: new Date().toISOString(),
  //             onboarding_status: onboardingStatus || "pending",
  //           };

  //           console.log("📦 Saving data to Firestore...");
  //           await setDoc(userRef, userData, { merge: true });
  //           console.log(" Firestore save completed");
  //         } catch (error) {
  //           console.error("🔥 Firestore save error:", error);
  //         }
  //       };

  //       // Start Firestore save in background
  //       saveUserToFirestore();

  //       // Navigate
  //       setTimeout(() => navigate(redirectPath), 500);
  //     } else {
  //       showTost({
  //         title: res.data.ResponseMsg || t("loginFailed"), // Updated
  //       });
  //     }
  //   } catch (err) {
  //     console.error("🔥 SigninHandler error:", err);
  //     showTost({ title: t("loginFailed") }); // Updated
  //   }
  // };
  const SigninHandler = async () => {
    try {
      // Check if input is empty
      if (!Email)
        return showTost({ title: t("enterEmailMobile") });
      if (!Password) return showTost({ title: t("enterPassword") });

      // Determine if input is email or mobile
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      const isEmail = emailRegex.test(Email);

      // Prepare request data based on input type
      let requestData;

      if (isEmail) {
        // Use 'email' parameter for email login
        requestData = {
          email: Email,
          password: Password,
        };
      } else {
        // For mobile login
        requestData = {
          mobile: Email,
          ccode: "+91",
          password: Password,
        };
      }

      console.log("Sending login request:", JSON.stringify(requestData));

      // API call for login
      const res = await axios.post(`${basUrl}user_login.php`, requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Login response:", res.data);

      if (res.data.Result === "true") {
        const user = res.data.UserLogin;

        // Store backend token in localStorage
        const backendToken = res.data.token || uid(32);
        localStorage.setItem("token", backendToken);
        localStorage.setItem("UserId", user.id);
        localStorage.setItem("Register_User", JSON.stringify(user));

        showTost({ title: res.data.ResponseMsg });
        Data.setDemo(Data.demo + "123");
        UserAddHandler(user);


        // --- ONBOARDING STATUS CHECK ---
        const onboardingStatus = (user.onboarding_status || "").toLowerCase();
        const redirectPath =
          onboardingStatus === "completed" ? "/dashboard" : "/image";

        // --- SAVE USER TO FIRESTORE (background process) ---
        const saveUserToFirestore = async () => {
          try {
            const { id, name, email, mobile, profile_pic } = user;

            // EXTRA VALIDATION: Ensure user object exists
            if (!user) {
              console.error("❌ Firestore save aborted: User object is undefined");
              return;
            }

            // EXTRA VALIDATION: Ensure id exists and is valid
            if (!id && id !== 0) {
              console.error("❌ Firestore save aborted: User ID is undefined/null", user);
              return;
            }

            // Convert to string and trim
            const userId = String(id).trim();

            if (!userId || userId === "undefined" || userId === "null") {
              console.error("❌ Firestore save aborted: Invalid user ID after conversion:", userId);
              return;
            }

            console.log("🔄 Creating Firestore reference for user:", userId);

            // Create Firestore reference
            const userRef = doc(db, "datingUser", userId);
            console.log("🔄 Firestore reference created successfully");

            let fcmToken = "";
            console.log("🔄 Starting Firestore save for user:", userId);

            // Get FCM token from OneSignal if available
            if (window.OneSignal) {
              try {
                await new Promise((resolve) => {
                  window.OneSignal.push(() => {
                    console.log(" OneSignal is ready");
                    resolve();
                  });
                });

                await window.OneSignal.setExternalUserId(userId);
                console.log(" External user ID set:", userId);

                for (let attempt = 0; attempt < 3; attempt++) {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  fcmToken = await window.OneSignal.getUserId();
                  if (fcmToken) {
                    console.log(
                      " FCM Token received on attempt",
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
                console.warn(" OneSignal error:", oneSignalError);
              }
            }

            // Prepare user data
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

            // Try-catch for setDoc operation
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

        // Navigate
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
  const toggleBottomSheet = () => {
    setIsVisible(!isVisible);
    setOtpShow(false);
    setValue("");
  };

  // const EmailHandler = () => {
  //   if (value) {
  //     const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  //     if (emailRegex.test(value)) {
  //       // 1. Check if email exists in system
  //       axios.post(`${basUrl}email_check.php`, { email: value })
  //         .then((res) => {
  //           console.log("📧 Email Check Response:", res.data);

  //           // IMPORTANT: Your backend returns "false" when email exists
  //           if (res.data.Result === "false") {
  //             console.log("✅ Email verified, proceeding with OTP...");

  //             // 2. Send OTP to email (skip sms_type.php check temporarily)
  //             axios.post(`${basUrl}email_otp.php`, { email: value })
  //               .then((otpRes) => {
  //                 console.log("📨 OTP Send Response:", otpRes.data);

  //                 if (otpRes.data.Result === "true" || otpRes.data.otp) {
  //                   // SUCCESS: OTP sent
  //                   showTost({ 
  //                     title: otpRes.data.ResponseMsg || "OTP sent to your email" 
  //                   });

  //                   // Store OTP for verification
  //                   setChechOtp(otpRes.data.otp);

  //                   // Show OTP input fields
  //                   setOtpShow(true);
  //                   setPasswordShow(false);

  //                   console.log("🎯 OTP fields should be visible now");
  //                   console.log("OTP Code:", otpRes.data.otp);
  //                 } else {
  //                   // OTP send failed
  //                   showTost({ 
  //                     title: otpRes.data.ResponseMsg || "Failed to send OTP" 
  //                   });
  //                 }
  //               })
  //               .catch((otpError) => {
  //                 console.error("❌ OTP Send Error:", otpError);
  //                 showTost({ title: "OTP service unavailable" });
  //               });

  //           } else {
  //             // Email doesn't exist
  //             showTost({ 
  //               title: res.data.ResponseMsg || "Email not registered" 
  //             });
  //           }
  //         })
  //         .catch((error) => {
  //           console.error("❌ Email Check Error:", error);
  //           showTost({ title: "Network error. Please try again." });
  //         });

  //     } else {
  //       showTost({ title: "Please enter a valid email address" });
  //     }
  //   } else {
  //     showTost({ title: "Please enter your email" });
  //   }
  // };


  // const OtpCheckHandler = () => {
  //   if (checkOtp === otpValue.join("")) {
  //     showTost({ title: t("otpMatchSuccess") }); // Updated
  //     setOtpShow(false);
  //     setPasswordShow(true);
  //   } else {
  //     showTost({ title: t("invalidOtp") }); // Updated
  //   }
  // };


  const EmailHandler = () => {
    if (value) {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

      if (emailRegex.test(value)) {
        // 1. Check if email exists in system
        axios.post(`${basUrl}email_check.php`, { email: value })
          .then((res) => {
            console.log("📧 Email Check Response:", res.data);

            // IMPORTANT: Your backend returns "false" when email exists
            if (res.data.Result === "false") {
              console.log("✅ Email verified, proceeding with OTP...");

              // 2. Send OTP to email
              axios.post(`${basUrl}email_otp.php`, { email: value })
                .then((otpRes) => {
                  console.log("📨 OTP Send Response:", otpRes.data);

                  if (otpRes.data.Result === "true") {
                    // SUCCESS: OTP sent
                    showTost({
                      title: otpRes.data.ResponseMsg || "OTP sent to your email"
                    });

                    // Store the OTP sent from backend for debugging
                    // Note: Now we'll verify via API, not compare locally
                    if (otpRes.data.otp) {
                      console.log("OTP sent from backend:", otpRes.data.otp);
                      setChechOtp(otpRes.data.otp); // Keep for reference if needed
                    }

                    // Show OTP input fields
                    setOtpShow(true);
                    setPasswordShow(false);

                    console.log("🎯 OTP fields should be visible now");
                  } else {
                    // OTP send failed
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
              // Email doesn't exist
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

      // Call the OTP verification API
      const res = await axios.post(`${basUrl}/verify_otp.php`, {
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

        // Clear the OTP field
        setOtpValue([]);

        // If you have setChechOtp state, you might want to clear it too
        if (setChechOtp) {
          setChechOtp(null);
        }
      } else {
        showTost({ title: res.data.ResponseMsg || "Invalid OTP" });

        // Clear OTP fields for re-entry
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

      // Clear OTP fields on error
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
          showTost({ title: t("passwordsNotMatch") }); // Updated
        }
      } else {
        showTost({ title: t("enterConfirmPassword") }); // Updated
      }
    } else {
      showTost({ title: t("enterPasswordField") }); // Updated
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
      // Validate data exists
      if (!data) {
        console.error("❌ UserAddHandler: No user data provided");
        return;
      }

      // Validate and convert ID to string
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

      // Create Firestore reference with validated ID
      const userRef = doc(db, "datingUser", userId);

      getDoc(userRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            // Update existing user
            updateDoc(userRef, {
              isOnline: true,
              updated_at: new Date().toISOString(),
            });
            console.log("✅ UserAddHandler: Existing user updated as online");
          } else {
            // Create new user document
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
                  {t("welcome")} {/* Updated */}
                </h1>
                <p className="text-[20px] mt-[10px] max-_430_:text-[20px] max-_380_:text-[16px] text-[#333333] font-normal text-center mb-3">
                  {t("subtitle")} {/* Updated */}
                </p>

              </div>
              <div className="mt-[20px] w-[100%] space-y-5">
                {/* Email/Phone Input */}
                <div>
                  <label htmlFor="" className="font-semibold">
                    {t("emailMobileLabel")} {/* Updated */}
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
                  {t("forgotPassword")}{" "} {/* Updated */}
                  <span className="text-amber-600 hover:text-amber-700 transition-colors duration-150">
                    {t("resetIt")} {/* Updated */}
                  </span>
                </button>

                {/* Sign In Button */}
                <button
                  onClick={SigninHandler}
                  className="font-bold text-[18px] rounded-full mt-[5px] text-white py-[15px] w-[100%] bg-[#1F5799] transition-colors duration-200 shadow-sm"
                >
                  {t("signIn")} {/* Updated */}
                </button>
              </div>

              {/* Sign Up Link */}
              <Link
                to="/register"
                className="pt-[20px] font-[500] text-[16px] no-underline text-black block w-full text-center"
              >
                {t("noAccount")}{" "} {/* Updated */}
                <span className="text-amber-600 hover:text-amber-700 transition-colors duration-150">
                  {t("signUp")} {/* Updated */}
                </span>
              </Link>

              {/* Bottom Sheet */}
              {isVisible && (
                <div onClick={toggleBottomSheet} className="bottom-sheet">
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="bottom-sheet-content"
                  >
                    <div className="bg-white rounded-2xl shadow-lg p-5">
                      <div className="flex items-center justify-between mb-[15px]">
                        <h1 className="text-[18px] m-0 text-black font-[500]">
                          {t("resetPassword")} {/* Updated */}
                        </h1>
                        <img
                          onClick={toggleBottomSheet}
                          src={CloseIcon}
                          alt=""
                          className="cursor-pointer"
                        />
                      </div>

                      {/* Phone Input */}
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
                          type="email" // Changed from type="email" to type="email" (it's already email)
                          placeholder={t("enterEmailAddress")} // Add translation key
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          style={{
                            outline: "none",
                            backgroundColor: "transparent",
                          }}
                        />
                      </div>

                      {/* OTP Section */}
                      {otpShow && (
                        <div className="mt-[15px]">
                          <h1 className="text-[18px] m-0 text-black font-[500]">
                            {t("enterOtp")} {/* Updated */}
                          </h1>
                          <div className="flex items-center mt-[20px] justify-center gap-[10px]">
                            {Inputref.current.map((ref, index) => {
                              return (
                                <input
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

                      {/* Password Section */}
                      {passwordShow && (
                        <div className="space-y-4">
                          <div>
                            <h1 className="text-[18px] mt-[15px] mb-0 text-black font-[500]">
                              {t("password")} {/* Updated */}
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
                              {t("confirmPassword")} {/* Updated */}
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

                      {/* Action Button */}
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
                          ? t("check") /* Updated */
                          : passwordShow
                            ? t("change") /* Updated */
                            : t("continue")} {/* Updated */}
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