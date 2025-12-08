/* jshint esversion: 6 */
/* jshint ignore:start */

import React, { createContext, useState } from "react";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const basUrl = "https://meetgreek.dhsol.net/api/";

  const imageBaseURL = "https://meetgreek.dhsol.net/";

  const paymentBaseURL = "https://meetgreek.dhsol.net/";

  const [updateId, setUpdateId] = useState(0);
  const [oneSignalInitialized, setOneSignalInitialized] = useState(false);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [bio, setBio] = useState();
  const [number, setNumber] = useState();
  const [ccode, setCcode] = useState();
  const [birthdate, setBirthDate] = useState();
  const [gender, setGender] = useState();
  const [goal, setGoal] = useState();
  const [nearby, setNearby] = useState();
  const [country, setCountry] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [hobbies, setHobbies] = useState();
  const [languages, setLanguages] = useState();
  const [religion, setReligion] = useState();
  const [preference, setPreference] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [uid, setUid] = useState();
  const [profileId, setProfileId] = useState();
  const [registerUid, setRegisterUid] = useState("");
  const [payClose, setPayClose] = useState();
  const [planId, setPlanId] = useState();
  const [transactionId, setTransactionId] = useState();
  const [toggleButton, setToggleButton] = useState(false);
  const [page, setPageName] = useState();
  const [amount, setAmount] = useState();
  const [buyCoin, setBuyCoin] = useState();
  const [purchaseId, setPurchaseId] = useState();
  const [walletCoin, setWalletCoin] = useState();
  const [demo, setDemo] = useState();
  const [error, setError] = useState();
  const [blockId, setBlockId] = useState();
  const [details, setDetails] = useState();
  const [chatId, setChatId] = useState("");
  const [chatUserName, setChatUserName] = useState();
  const [currency, setCurrency] = useState();
  const [isVoiceCalling, setIsVoiceCalling] = useState(false);
  const [isVideoCalling, setIsVideoCalling] = useState(false);
  const [callStatus, setCallstatus] = useState(false);
  const [atendCall, setAtendCall] = useState(false);
  const [toastMsg, setToastMsg] = useState();
  const [toastShow, setToastShow] = useState(false);
  const [valodateId, setValidateId] = useState(false);
  const [agoraAppId, setAgoraAppId] = useState();
  const [onesignalAppId, setOnesignalAppId] = useState();
  const [onesignalKey, setOnesignalKey] = useState();
  const [color, setColor] = useState("");
  const [button, setButton] = useState(true);
  const [callChannelName, setCallChannelName] = useState("");
  const [token, setToken] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [education, setEducation] = useState("");
  const [profession, setProfession] = useState("");
  const [smoking, setSmoking] = useState("");
  const [drinking, setDrinking] = useState("");
  const [greekStatus, setGreekStatus] = useState("");

  const [greekConnection, setGreekConnection] = useState("");
  const [greekRootConnection, setGreekRootConnection] = useState("");

  const [religiousBackground, setReligiousBackground] = useState("");
  const [faithImportance, setFaithImportance] = useState("");
  const [churchAttendance, setChurchAttendance] = useState("");
  const [partnerFaithPreference, setPartnerFaithPreference] = useState("");
  const [favoriteTraditions, setFavoriteTraditions] = useState([]);
  
  const [relationshipGoals, setRelationshipGoals] = useState([]);

  const [relocationPreference, setRelocationPreference] = useState("");
  const [dateWithChildren, setDateWithChildren] = useState("");
  const [haveChildren, setHaveChildren] = useState("");
  const [wantChildren, setWantChildren] = useState("");
  const [travelWillingness, setTravelWillingness] = useState("");

  const [profileImages, setProfileImages] = useState({
    pic0: null,
    pic1: null,
    pic2: null,
    pic3: null,
    pic4: null,
    pic5: null
  });

  const [imageCount, setImageCount] = useState(0);

  const [registrationStep, setRegistrationStep] = useState(1);
  const [userId, setUserId] = useState("");

  const Value = {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    bio,
    setBio,
    number,
    setNumber,
    ccode,
    setCcode,
    birthdate,
    setBirthDate,
    gender,
    setGender,
    goal,
    setGoal,
    nearby,
    setNearby,
    country,
    setCountry,
    state,
    setState,
    city,
    setCity,
    oneSignalInitialized,
    setOneSignalInitialized,

    hobbies,
    setHobbies,
    languages,
    setLanguages,
    religion,
    setReligion,
    preference,
    setPreference,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    uid,
    setUid,
    profileId,
    setProfileId,
    registerUid,
    setRegisterUid,
    updateId,
    setUpdateId,
    payClose,
    setPayClose,
    planId,
    setPlanId,
    transactionId,
    setTransactionId,
    toggleButton,
    setToggleButton,
    page,
    setPageName,
    amount,
    setAmount,
    buyCoin,
    setBuyCoin,
    purchaseId,
    setPurchaseId,
    walletCoin,
    setWalletCoin,
    demo,
    setDemo,
    details,
    setDetails,
    blockId,
    setBlockId,
    error,
    setError,
    chatId,
    setChatId,
    chatUserName,
    setChatUserName,
    currency,
    setCurrency,
    isVoiceCalling,
    setIsVoiceCalling,
    isVideoCalling,
    setIsVideoCalling,
    callStatus,
    setCallstatus,
    atendCall,
    setAtendCall,
    toastMsg,
    setToastMsg,
    toastShow,
    setToastShow,
    valodateId,
    setValidateId,
    agoraAppId,
    setAgoraAppId,
    onesignalAppId,
    setOnesignalAppId,
    onesignalKey,
    setOnesignalKey,
    button,
    setButton,
    color,
    setColor,
    basUrl,
    imageBaseURL,
    paymentBaseURL,
    callChannelName,
    setCallChannelName,
    token,
    setToken,

    firstName,
    setFirstName,
    lastName,
    setLastName,
    relationshipStatus,
    setRelationshipStatus,
    education,
    setEducation,
    profession,
    setProfession,
    smoking,
    setSmoking,
    drinking,
    setDrinking,
    greekStatus,
    setGreekStatus,
    greekConnection,
    setGreekConnection,
    greekRootConnection,
    setGreekRootConnection,
    religiousBackground,
    setReligiousBackground,
    faithImportance,
    setFaithImportance,
    churchAttendance,
    setChurchAttendance,
    partnerFaithPreference,
    setPartnerFaithPreference,
    favoriteTraditions,
    setFavoriteTraditions,
    relationshipGoals,
    setRelationshipGoals,

    relocationPreference,
    setRelocationPreference,
    dateWithChildren,
    setDateWithChildren,
    haveChildren,
    setHaveChildren,
    wantChildren,
    setWantChildren,
    travelWillingness,
    setTravelWillingness,
  
    imageCount, 
    setImageCount,
    profileImages, setProfileImages,
    registrationStep, setRegistrationStep,
    userId, setUserId
  };

  return <MyContext.Provider value={Value}>{children}</MyContext.Provider>;
};

export { MyContext, MyProvider };
/* jshint ignore:end */
