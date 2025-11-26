/* jshint esversion: 6 */
/* jshint ignore:start */
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./LoginComponent/Login";
import { ToastContainer } from "react-toastify";
import PhoneNum from "./MobilComponent/PhoneNum";
import Birthdate from "./MobilComponent/Birthdate";
import Gender from "./MobilComponent/Gender";
import Golas from "./MobilComponent/Goals";
import Nearby from "./MobilComponent/Nearby";
import Location from "./MobilComponent/Location";
import Hobbies from "./MobilComponent/Hobbies";
import Languages from "./MobilComponent/Languages";
import Religion from "./MobilComponent/Religion";
import Gender2 from "./MobilComponent/Gender-2";
import Image from "./MobilComponent/Image";
import Home from "./MobilComponent/Home";
import Header from "./LoginComponent/Header";
import Detail from "./LoginComponent/Detail";
import Favorites from "./LoginComponent/Favorites";
import Profile from "./LoginComponent/Profile";
import Wallet from "./LoginComponent/Wallet";
import Upgrade from "./LoginComponent/Upgrade";
import BuyCoin from "./LoginComponent/BuyCoin";
import Aboutus from "./LoginComponent/Aboutus";
import Faqs from "./LoginComponent/Faqs";
import History from "./LoginComponent/History";
import BlockUser from "./LoginComponent/BlockUser";
import { MyProvider } from "./Context/MyProvider";
import NotFound from "./NotFound";
import Pages from "./LoginComponent/Pages";
import Razorpay from "./PaymentMethod/Razorpay";
import PayPal from "./PaymentMethod/PayPal";
import Payment from "./PaymentMethod/Payment";
import Payfast from "./PaymentMethod/Payfast";
import Success, { Cancel } from "./PaymentMethod/Success";
import i18n from "./Language";
import { TodoContext } from "./Context";
import UserChat from "./LoginComponent/UserChat";
import NotificationShow from "./LoginComponent/NotificationShow";
import Dashboard from "./LoginComponent/Dashboard";
import Register from "./MobilComponent/Register";
import Validate from "./MobilComponent/Validate";
import PaymentRespons from "./PaymentMethod/PaymentRespons";
import { CallListener } from "./utils/CallListener";


const App = () => {
  const [demo, setDemo] = useState();
  const [Index, setindex] = useState();
  const [oneSignalInitialized, setOneSignalInitialized] = useState(false); // Move state here
  const isAuthenticated = localStorage.getItem("token");

 useEffect(() => {
    const setOneSignalUser = async () => {
      const raw = localStorage.getItem("Register_user");
      if (raw && window.OneSignal) {
        try {
          const user = JSON.parse(raw);
          
          console.log("🔄 Setting OneSignal user and getting token...");
          
          // Wait for OneSignal to be ready
          await new Promise(resolve => {
            window.OneSignal.push(() => resolve());
          });
          
          // Set external user ID
          await window.OneSignal.setExternalUserId(user.id);
          console.log("✅ OneSignal user ID set:", user.id);
          
          // WAIT for OneSignal to generate token (this can take a few seconds)
          let fcmToken = await window.OneSignal.getUserId();
          let attempts = 0;
          
          // Keep trying to get token for up to 10 seconds
          while (!fcmToken && attempts < 20) {
            console.log(`🔄 Waiting for OneSignal token... attempt ${attempts + 1}`);
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
            fcmToken = await window.OneSignal.getUserId();
            attempts++;
          }
          
          if (fcmToken) {
            console.log("✅ OneSignal token received:", fcmToken);
            await updateFirebaseToken(user.id, fcmToken);
          } else {
            console.warn("❌ No OneSignal token received after 10 seconds");
            // Still update Firebase to mark as tried
            await updateFirebaseToken(user.id, "");
          }
          
        } catch (error) {
          console.warn("OneSignal user setup failed:", error);
        }
      }
    };

    if (isAuthenticated) {
      setOneSignalUser();
    }
  }, [isAuthenticated]);

  // Firebase token update function
  const updateFirebaseToken = async (userId, token) => {
    try {
      const { doc, setDoc, getDoc } = await import("firebase/firestore");
      const { db } = await import("./Users_Chats/Firebase");
      
      const userRef = doc(db, "datingUser", userId);
      
      // Update ONLY the token field to avoid overwriting other data
      await setDoc(userRef, {
        token: token,
        updated_at: new Date().toISOString(),
      }, { merge: true });
      
      console.log("✅ Firebase token updated:", token ? "with token" : "empty token");
      
      // Verify the update
      const savedDoc = await getDoc(userRef);
      if (savedDoc.exists()) {
        const savedData = savedDoc.data();
        console.log("🔍 Firebase verification - token:", savedData.token);
      }
    } catch (error) {
      console.error("Error updating Firebase token:", error);
    }
  };

  useEffect(() => {
  if (!window.OneSignal) return;

  // Listen for when OneSignal gets a new token
  window.OneSignal.push(() => {
    window.OneSignal.on('notificationPermissionChange', async (permission) => {
      if (permission === 'granted') {
        console.log("🔔 Notification permission granted, getting token...");
        
        const raw = localStorage.getItem("Register_user");
        if (raw) {
          const user = JSON.parse(raw);
          
          // Wait a bit for token to be generated
          setTimeout(async () => {
            const fcmToken = await window.OneSignal.getUserId();
            if (fcmToken) {
              console.log("🎯 OneSignal token generated:", fcmToken);
              await updateFirebaseToken(user.id, fcmToken);
            }
          }, 2000);
        }
      }
    });
  });
}, []);


useEffect(() => {
  if (!isAuthenticated) return;

  const checkAndUpdateToken = async () => {
    const raw = localStorage.getItem("Register_user");
    if (!raw || !window.OneSignal) return;

    const user = JSON.parse(raw);
    
    try {
      const fcmToken = await window.OneSignal.getUserId();
      if (fcmToken) {
        // Check current token in Firebase
        const { doc, getDoc } = await import("firebase/firestore");
        const { db } = await import("./Users_Chats/Firebase");
        
        const userRef = doc(db, "datingUser", user.id);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Update if token is empty or different
          if (!userData.token || userData.token !== fcmToken) {
            await updateFirebaseToken(user.id, fcmToken);
          }
        }
      }
    } catch (error) {
      console.warn("Token check failed:", error);
    }
  };

  // Check token after 5 seconds and then every 30 seconds
  const immediateCheck = setTimeout(checkAndUpdateToken, 5000);
  const interval = setInterval(checkAndUpdateToken, 30000);

  return () => {
    clearTimeout(immediateCheck);
    clearInterval(interval);
  };
}, [isAuthenticated]);



  useEffect(() => {
    const raw = localStorage.getItem("Register_user");
    if (raw) {
      const user = JSON.parse(raw);
      // OneSignal is now handled in the useEffect above
    }
  }, [demo]);

  useEffect(() => {
    setindex(localStorage.getItem("UserId"));
  }, [demo]);

  return (
    <div>
      <MyProvider>
        <TodoContext.Provider value={{ demo, setDemo, oneSignalInitialized }}> {/* Pass to context */}
          <Router>
            {isAuthenticated && <Header />}
            <Routes>
              {isAuthenticated ? (
                <Route path="/" element={<Dashboard />} />
              ) : (
                <Route path="/" element={<Home />} />
              )}
              <Route path="/register" element={<Register />} />
              <Route path="/phonenumber" element={<PhoneNum />} />
              <Route path="/birthdate" element={<Birthdate />} />
              <Route path="/gender" element={<Gender />} />
              <Route path="/golas" element={<Golas />} />
              <Route path="/location" element={<Location />} />
              <Route path="/nearby" element={<Nearby />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/hobbies" element={<Hobbies />} />
              <Route path="/languages" element={<Languages />} />
              <Route path="/religion" element={<Religion />} />
              <Route path="/preference" element={<Gender2 />} />
              <Route path="/image" element={<Image />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/detail/:name" element={<Detail />} />
              <Route path="/explore" element={<Favorites />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/upgrade" element={<Upgrade />} />
              <Route path="/buyCoin" element={<BuyCoin />} />
              <Route path="/aboutus" element={<Aboutus />} />
              <Route path="/faqs" element={<Faqs />} />
              <Route path="/history" element={<History />} />
              <Route path="/blockUser" element={<BlockUser />} />
              <Route path="/page/:title" element={<Pages />} />
              <Route path="/razorpay" element={<Razorpay />} />
              <Route path="/paypal" element={<PayPal />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payfast" element={<Payfast />} />
              <Route path="/done" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/chat" element={<UserChat />} />
              <Route path="/validate" element={<Validate />} />
              <Route path="/PaymentRespons" element={<PaymentRespons />} />
              <Route path="/notification" element={<NotificationShow />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>

          <CallListener /> {/* Inside MyProvider */}

        </TodoContext.Provider>
      </MyProvider>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;
/* jshint ignore:end */