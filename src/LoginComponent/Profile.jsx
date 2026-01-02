/* jshint esversion: 11 */
/* jshint ignore:start */
import React, { useContext, useEffect, useRef, useState } from "react";
import UblockIcon from "../Icon/unlock.svg";
import ShowPassword from "../Icon/eye.svg";
import HidePassword from "../Icon/eye-slash.svg";
import { IoMdClose } from "react-icons/io";
import { MyContext } from "../Context/MyProvider";
import axios from "axios";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Users_Chats/Firebase";
import { showTost } from "../showTost";
import Footer from "./Footer";

const Profile = () => {

  const { t } = useTranslation();

  const { imageBaseURL, basUrl, setUpdateId, updateId } = useContext(MyContext);

  const [imagearray, setImagearray] = useState([]);
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNummber] = useState("");
  const [ccode, setCcode] = useState("");
  const [Password, setpassword] = useState("");
  const [distance, setDistance] = useState();
  const [birthdate, setBirthDate] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [interest, setInterest] = useState([]);
  const [language, setLanguage] = useState([]);
  const [religion, setReligion] = useState("");
  const [preference, setPreference] = useState("");
  const [relationship, setRelationship] = useState("");
  const [uid, setUid] = useState();
  const [height, setHeight] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [images, setImages] = useState([null]);
  const [interestList, setInterestList] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [religionList, setReligionList] = useState([]);
  const [relationshipList, setRelationshipList] = useState([]);

  const InputRef = useRef([]);


  const kilometers = Math.floor(distance / 100);
  const centimeters = distance % 100;

  const min = 1;
  const max = 50000;

  const percent = ((distance - min) / (max - min)) * 100;

  const sliderStyle = {
    background: `linear-gradient(to right, #0066CC ${percent}%, #0066CC ${percent}%)`,
  };

  const Show = useRef();
  const Hide = useRef();


  const myFunction = () => {
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
  };

  const InterestMapHandler = (id) => {
    if (interest.includes(id)) {
      setInterest(interest.filter((el) => el !== id));
    } else {
      if (interest.length > 4) return;
      setInterest([...interest, id]);
    }
  };

  const LanguageMapHandler = (id) => {
    if (language.includes(id)) {
      setLanguage(language.filter((el) => el !== id));
    } else {
      if (language.length > 4) return;
      setLanguage([...language, id]);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(String(position.coords.latitude));
        setLongitude(String(position.coords.longitude));
      },
      (error) => { });

    const RegisterData = localStorage.getItem("Register_User");
    if (RegisterData) {
      const UserData = JSON.parse(RegisterData);
      setImagearray(UserData.other_pic ? UserData.other_pic.split("$;") : []);
      setNickName(UserData.name ? UserData.name : "");
      setEmail(UserData.email ? UserData.email : "");
      setNummber(UserData.mobile ? UserData.mobile : "");
      setCcode(UserData.ccode ? UserData.ccode : "");
      setpassword(UserData.password ? UserData.password : "");
      setDistance(UserData.radius_search ? UserData.radius_search * 100 : 0);
      setBirthDate(UserData.birth_date ? UserData.birth_date.slice(0, 10) : "");
      setBio(UserData.profile_bio ? UserData.profile_bio : "");
      setGender(UserData.gender ? UserData.gender : "");
      setInterest(UserData.interest ? UserData.interest.split(",") : []);
      setLanguage(UserData.language ? UserData.language.split(",") : []);
      setReligion(UserData.religion ? UserData.religion : "");
      setRelationship(UserData.relation_goal ? UserData.relation_goal : "");
      setPreference(UserData.search_preference ? UserData.search_preference : "");
      setUid(UserData.id ? UserData.id : "");
      setHeight(UserData.height ? UserData.height : undefined);

    }
    GetHandler();
  }, []);

  const CloseHandler = (Index) => {
    const cuttedImg = imagearray?.filter((item, indx) => Index !== indx);
    setImagearray(cuttedImg);
  };

  const handleSubmit = () => {

    const totalImages = imagearray.length + images.slice(0, -1).length;

    if (totalImages >= 3) {
      const Validation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

      if (Validation.test(email)) {

        const formData = new FormData();

        formData.append("name", nickName);
        formData.append("mobile", number);
        formData.append("email", email);
        formData.append("ccode", ccode);
        formData.append("birth_date", birthdate);
        formData.append("search_preference", preference);
        formData.append("radius_search", kilometers);
        formData.append("relation_goal", relationship);
        formData.append("profile_bio", bio ? bio : undefined);
        formData.append("interest", interest.join(","));
        formData.append("language", language.join(","));
        formData.append("password", Password);
        formData.append("gender", gender);
        formData.append("lats", latitude);
        formData.append("longs", longitude);
        formData.append("religion", religion);
        formData.append("size", images && images.length - 1);
        formData.append("uid", uid);
        formData.append("height", height ? height : undefined);
        formData.append("imlist", imagearray.length === 0 ? "0" : imagearray.join("$;"));

        images.forEach((image, index) => {
          if (image) {
            formData.append(`otherpic${index}`, image);
          }
        });
        
        axios
          .post(`${basUrl}edit_profile.php`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            if (res.data.Result === "true") {
              setUpdateId(updateId + 1);
              DataUpdateHandler(nickName, email, number);
              localStorage.setItem(
                "Register_User",
                JSON.stringify(res.data.UserLogin)
              );
              showTost({ title: res.data.ResponseMsg });
            }
          });
      } else {
        showTost({ title: "Please enter a valid email address" });
      }
    } else {
      showTost({ title: "Please add a minimum of 3 photos" });
    }
  };

  const handleImageChange = (index, file) => {
    setImages((prev) => {
      const updatedImages = [...prev];
      updatedImages[index] = file;
      return updatedImages;
    });

    if (index === images.length - 1) {
      setImages((prev) => [...prev, null]);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // <<--------- intrest , Language , Religion , Relation All Api Call ------------>>

  const GetHandler = () => {

    // <<------------- intrest Api Call Hear -------------->>
    axios.post(`${basUrl}interest.php`)
      .then((res) => {
        setInterestList(res.data.interestlist);
      });

    // <<------------- Language Api Call Hear -------------->>
    axios.post(`${basUrl}languagelist.php`)
      .then((res) => {
        setLanguageList(res.data.languagelist);
      });

    // <<------------- Religion Api Call Hear -------------->>
    axios.post(`${basUrl}religionlist.php`)
      .then((res) => {
        setReligionList(res.data.religionlist);
      });

    // <<------------- RelationsipGoal Api Call Hear -------------->>
    axios.post(`${basUrl}goal.php`)
      .then((res) => {
        setRelationshipList(res.data.goallist);
      });

  };

  // <<------------- FireBase Data Update Handler ---------------->>

  const DataUpdateHandler = (Name, Email, Number) => {
    const Data = localStorage.getItem("Register_User");
    if (Data) {
      const UserData = JSON.parse(Data);
      const userRef = doc(db, "datingUser", UserData.id);
      updateDoc(userRef, {
        email: Email,
        name: Name,
        number: Number,
      });
    }
  };

  return (
    <Formik
      initialValues={{}}
      onSubmit={handleSubmit}
    >
      {(props) => (
     <div style={{ userSelect: "none", cursor: "default" }}>
<div className="content-body bg-[#F7F5F2]">
  <div className="container mw-lg-100 py-4 px-sm-4 px-3">
    <div className="bg-white p-[30px] max-_430_:py-[30px] max-_430_:px-[10px] rounded-[15px] shadow-sm">
      <h1 className="text-[18px] font-[400] text-[#222222]">
        {t('Update your personal photos here.')}
      </h1>

      <form onSubmit={props.handleSubmit} className="mt-[20px]">
        {/* <------------- Select Image Section -----------> */}
        <div className="mt-[30px] flex flex-wrap gap-[25px] max-_430_:gap-[10px] max-_430_:justify-center max-_1030_:justify-center">
          {imagearray.map((item, index) =>
            <div
              key={index}
              className="w-[20%] max-_1445_:w-[30%] max-_1030_:w-[40%] relative max-_430_:w-[45%] cursor-pointer border-[2px] border-dotted p-[10px] max-_430_:p-[5px] border-gray-300 rounded-[10px]"
            >
              {item && (
                <IoMdClose
                  onClick={() => CloseHandler(index)}
                  className="z-[666] w-[25px] h-[25px] absolute -right-2 -top-2 p-1 bg-[#C95B5B] text-white rounded-full shadow-sm"
                />
              )}
              <button type="button"
                className="bg-[#F7F5F2] w-[100%] flex items-center justify-center h-[300px] max-_430_:h-[200px] rounded-[10px]"
              >
                <img
                  src={`${imageBaseURL}${item}`}
                  className="w-[100%] h-[100%] rounded-[10px] object-cover"
                  alt=""
                />
              </button>
            </div>
          )}
          {images.map((item, index) => {
            return <div
              key={index}
              className="w-[20%] max-_1445_:w-[30%] max-_1030_:w-[40%] relative max-_430_:w-[45%] cursor-pointer border-[2px] border-dotted max-_430_:p-[5px] p-[10px] border-gray-300 rounded-[10px]"
            >
              {item && (
                <IoMdClose
                  onClick={() => handleRemoveImage(index)}
                  className="z-[666] w-[25px] h-[25px] absolute -right-2 -top-2 p-1 bg-[#C95B5B] text-white rounded-full shadow-sm"
                />
              )}
              <buttton
                onClick={() => InputRef.current[index].click()}
                className="bg-[#F7F5F2] w-[100%] flex items-center justify-center h-[300px] max-_430_:h-[200px] rounded-[10px]"
              >
                {item ? (
                  <img
                    src={URL.createObjectURL(item)}
                    className="w-[100%] h-[100%] object-cover rounded-[10px]"
                    alt=""
                  />
                ) : (
                  <div className="text-[40px] text-[#333333]">+</div>
                )}

                <input disabled={item && true}
                  ref={(el) => (InputRef.current[index] = el)}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleImageChange(index, file);
                    }
                  }}
                />
              </buttton>
            </div>
          })
          }
        </div>

        {/* <------------- Select Nick Name And Email Section -----------> */}
        <div className="mt-[30px] flex flex-wrap items-center  max-_1030_:justify-center gap-[30px] max-_430_:gap-[15px]">
          <div className="w-[40%] max-_430_:w-[90%]">
            <h6 className="text-[18px] font-[500] max-_430_:text-[16px] text-[#222222]">
              {t('Nick Name')}
            </h6>
            <input
              value={nickName}
              onChange={(e) => {
                const { name, value } = e.target;
                if (name === "name") setNickName(value);
              }}
              type="text"
              name="name"
              className="text-black w-[100%] border-2 outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 bg-white px-[15px] py-[15px] rounded-xl shadow-sm transition-all duration-200"
              placeholder="Nick Name"
            />
          </div>
          <div className="w-[40%] max-_430_:w-[90%]">
            <h6 className="text-[18px] font-[500] max-_430_:text-[16px] text-[#222222]">
              {t('Email')}
            </h6>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="Email"
              name="email"
              className="text-black w-[100%] border-2 outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 bg-white px-[15px] py-[15px] rounded-xl shadow-sm transition-all duration-200"
              placeholder="Email"
            />
          </div>
        </div>

        {/* <------------- Select Number And Password Section -----------> */}
        <div className="mt-[30px] flex flex-wrap items-center max-_1030_:justify-center gap-[30px] max-_430_:gap-[15px] max-_430_:mt-[15px]">
          <div className="w-[40%] max-_430_:w-[90%]">
            <h6 className="text-[18px] font-[500] max-_430_:text-[16px] text-[#222222]">
              {t('Mobile Number')}
            </h6>
            <div className="flex gap-[10px] items-center border-gray-300 bg-white px-[15px] py-[15px] rounded-xl border-2 focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] transition-all duration-200">
              <label htmlFor="" className="text-[16px] text-black">
                {ccode}
              </label>
              <input
                value={number}
                name="mobile"
                onChange={(e) => setNummber(e.target.value)}
                type="number"
                className="text-black w-[100%] bg-transparent outline-none"
                placeholder="Mobile Number"
              />
            </div>
          </div>
          <div className="relative w-[40%] max-_430_:w-[90%]">
            <h6 className="text-[18px] font-[500] max-_430_:text-[16px] text-[#222222]">
              {t('Password')}
            </h6>
            <div className="flex gap-[10px] items-center border-gray-300 bg-white px-[15px] py-[15px] rounded-xl border-2 focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] transition-all duration-200">
              <img
                src={UblockIcon}
                alt=""
                className="w-[20px] h-[20px]"
              />
              <input
                id="input"
                type="password"
                className="text-[#333333] w-[100%] bg-transparent outline-none"
                placeholder="Password"
                name="password"
                value={Password}
                onChange={(e) => setpassword(e.target.value)}
              />
            </div>
            <button type="button"
              className="absolute top-[42px] right-5"
              onClick={() => myFunction()}
            >
              <img
                ref={Show}
                alt="Show"
                src={ShowPassword}
                className="w-[25px] h-[25px] hidden"
              />
              <img
                ref={Hide}
                alt="Hide"
                src={HidePassword}
                className="w-[25px] h-[25px]"
              />
            </button>
          </div>
        </div>

        {/* <------------- Select Distance And BirthDate Section -----------> */}
        <div className="mt-[30px] flex flex-wrap items-center max-_1030_:justify-center gap-[30px] max-_430_:gap-[15px] max-_430_:mt-[15px]">
          <div className="w-[40%] max-_430_:w-[90%]">
            <div className="flex justify-between items-center">
              <h1 className="text-[20px] font-[400] max-_430_:text-[16px] text-[#222222]">
                {t('Distance Preference')}
              </h1>
              <h1 className="text-[20px] font-[400] max-_1030_:text-[16px] text-[#222222]">
                {kilometers}.{centimeters} km
              </h1>
            </div>
            <input
              style={sliderStyle}
              type="range"
              className="Range"
              min="0"
              name="radius_search"
              max="50000"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />
          </div>
          <div className=" w-[40%] max-_430_:w-[90%]">
            <h6 className="text-[18px] font-[500] max-_430_:text-[16px] text-[#222222]">
              {t('Birthdate')}
            </h6>
            <div className="flex gap-[10px] items-center border-gray-300 bg-white px-[15px] py-[15px] rounded-xl border-2 focus-within:border-amber-500 focus-within:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] transition-all duration-200">
              <input
                type="date"
                className="text-[#333333] outline-none bg-transparent w-[100%]"
                id="date-picker"
                name="birth_date"
                value={birthdate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* <------------- Select Bio And Gender Section -----------> */}
        <div className="mt-[30px] flex flex-wrap items-center max-_1030_:justify-center gap-[30px] max-_430_:gap-[15px] max-_430_:mt-[15px]">
          <div className="w-[40%] max-_430_:w-[90%]">
            <h6 className="text-[18px] font-[500] max-_430_:text-[16px] text-[#222222]">
              {t('Bio')}
            </h6>
            <input
              value={bio === "undefined" ? "" : bio}
              onChange={(e) => setBio(e.target.value)}
              type="text"
              name="bio"
              className="text-black w-[100%] border-2 outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 bg-white px-[15px] py-[15px] rounded-xl shadow-sm transition-all duration-200"
              placeholder= " Add Bio" 
            />
          </div>
          <div className="w-[40%] max-_430_:w-[90%]">
            <h6 className="text-[18px] font-[500] max-_430_:text-[16px] text-[#222222]">
              {t('Gender')}
            </h6>
            <div className="">
              <ul className="flex flex-wrap items-center gap-[10px] m-0 p-0">
                <li
                  onClick={() => setGender("MALE")}
                  className={`text-[18px] max-_430_:text-[16px] cursor-pointer border-[2px] border-gray-200 rounded-full py-[5px] px-[15px] transition-colors ${gender === "MALE" ? "bg-[#1F5799] text-white border-[#1F5799]" : "text-[#333333] hover:bg-gray-100"}`}
                >
                  MALE
                </li>
                <li
                  onClick={() => setGender("FEMALE")}
                  className={`text-[18px] max-_430_:text-[16px] cursor-pointer border-[2px] border-gray-200 rounded-full py-[5px] px-[15px] transition-colors ${gender === "FEMALE" ? "bg-[#1F5799] text-white border-[#1F5799]" : "text-[#333333] hover:bg-gray-100"}`}
                >
                  FEMALE
                </li>
                <li
                  onClick={() => setGender("OTHER")}
                  className={`text-[18px] max-_430_:text-[16px] cursor-pointer border-[2px] border-gray-200 rounded-full py-[5px] px-[15px] transition-colors ${gender === "OTHER" ? "bg-[#1F5799] text-white border-[#1F5799]" : "text-[#333333] hover:bg-gray-100"}`}
                >
                  OTHER
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* <------------- Select Interest And Langusges Section -----------> */}
        <div className="mt-[30px] flex flex-wrap max-_1030_:justify-center gap-[30px] max-_430_:gap-[15px] max-_430_:mt-[15px]">
          <div className="w-[40%] max-_430_:w-[90%] block">
            <h6 className="text-[18px] font-[500] max-_430_:text-[16px] text-[#222222]">
              {t('Interests')}
            </h6>
            <div className="items-center">
              {interestList.map((el) => {
                return (
                  <button type="button"
                    onClick={() => InterestMapHandler(el.id)}
                    className="inline-block"
                  >
                    <div
                      className={`text-[16px] max-_430_:text-[14px] px-[13px] py-[5px] border-[2px] border-gray-200 rounded-[50px] mb-[10px] me-[10px] flex items-center gap-[10px] transition-colors ${interest.includes(el.id) ? "bg-[#1F5799] text-white border-[#1F5799]" : "text-[#333333] hover:bg-gray-100"}`}
                    >
                      {el.title}{" "}
                      <img
                        src={imageBaseURL + el.img}
                        alt=""
                        className="w-[20px] h-[20px]"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="w-[50%] max-_430_:w-[90%]">
            <h6 className="text-[18px] font-[500] max-_430_:text-[16px] text-[#222222]">
              {t('Langusges I Know')}
            </h6>
            {languageList.map((el) => {
              return (
                <button type="button"
                  onClick={() => LanguageMapHandler(el.id)}
                  className="inline-block"
                >
                  <div
                    className={`text-[18px] max-_430_:text-[14px] px-[13px] py-[5px] border-[2px] gap-[5px] border-gray-200 rounded-[50px] mb-[10px] me-[10px] flex items-center transition-colors ${language.includes(el.id) ? "bg-[#1F5799] text-white border-[#1F5799]" : "text-[#333333] hover:bg-gray-100"}`}
                  >
                    {el.title}{" "}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* <------------- Select Religion And Relationship Golas Section -----------> */}
        <div className="mt-[30px] flex flex-wrap max-_1030_:justify-center gap-[30px] max-_430_:gap-[15px] max-_430_:mt-[15px]">
          <div className="w-[40%] max-_430_:w-[90%] block">
            <h6 className="text-[18px] font-[500] max-_430_:text-[16px] text-[#222222]">
              {t('Religion')}
            </h6>
            {religionList.map((el) => {
              return (
                <h6
                  onClick={() => setReligion(el.id)}
                  key={el.id}
                  className={`text-[18px] font-[400] max-_430_:text-[16px] inline-block me-[15px] cursor-pointer border-[2px] border-gray-200 rounded-full py-[5px] px-[15px] transition-colors ${religion === el.id ? "bg-[#1F5799] text-white border-[#1F5799]" : "text-[#333333] hover:bg-gray-100"}`}
                >
                  {el.title}
                </h6>
              );
            })}
          </div>
          <div className="w-[45%] max-_430_:w-[90%]">
            <h6 className="text-[18px] font-[500] max-_430_:text-[16px] text-[#222222]">
              {t('Relationship Goals')}
            </h6>
            {relationshipList.map((el) => {
              return (
                <h6
                  onClick={() => setRelationship(el.id)}
                  key={el.id}
                  className={`text-[18px] font-[400] max-_430_:text-[16px] inline-block me-[15px] cursor-pointer border-[2px] border-gray-200 rounded-full py-[5px] px-[15px] transition-colors ${relationship === el.id
                    ? "bg-[#1F5799] text-white border-[#1F5799]"
                    : "text-[#333333] hover:bg-gray-100"
                    }`}
                >
                  {el.title}
                </h6>
              );
            })}
          </div>
        </div>

        {/* <------------- Select Serach Preference And height Section -----------> */}
        <div className="mt-[30px] flex flex-wrap max-_1030_:justify-center gap-[30px] max-_430_:gap-[15px] max-_430_:mt-[15px]">
          <div className="w-[40%] max-_430_:w-[90%] block">
            <div className="">
              <h6 className="text-[18px] font-[500] max-_430_:text-[16px] text-[#222222]">
                {t('Serach Preference')}
              </h6>
              <div className="">
                <ul className="flex flex-wrap items-center gap-[10px] m-0 p-0">
                  <li
                    onClick={() => setPreference("MALE")}
                    className={`text-[18px] max-_430_:text-[16px] cursor-pointer border-[2px] border-gray-200 rounded-full py-[5px] px-[15px] transition-colors ${preference === "MALE"
                      ? "bg-[#1F5799] text-white border-[#1F5799]"
                      : "text-[#333333] hover:bg-gray-100"
                      }`}
                  >
                    MALE
                  </li>
                  <li
                    onClick={() => setPreference("FEMALE")}
                    className={`text-[18px] max-_430_:text-[16px] cursor-pointer border-[2px] border-gray-200 rounded-full py-[5px] px-[15px] transition-colors ${preference === "FEMALE"
                      ? "bg-[#1F5799] text-white border-[#1F5799]"
                      : "text-[#333333] hover:bg-gray-100"
                      }`}
                  >
                    FEMALE
                  </li>
                  <li
                    onClick={() => setPreference("BOTH")}
                    className={`text-[18px] max-_430_:text-[16px] cursor-pointer border-[2px] border-gray-200 rounded-full py-[5px] px-[15px] transition-colors ${preference === "BOTH"
                      ? "bg-[#1F5799] text-white border-[#1F5799]"
                      : "text-[#333333] hover:bg-gray-100"
                      }`}
                  >
                    BOTH
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="w-[50%] max-_430_:w-[90%]">
            <h6 className="text-[18px] font-[500] max-_430_:text-[16px] text-[#222222]">
              {t('Height')}
            </h6>
            <div className="py-[5px] w-[150px] px-[10px] border-[2px] border-gray-200 rounded-[8px] focus-within:border-[#C89A3D] focus-within:shadow-sm bg-white">
              <input
                type="number"
                className="w-[70px] outline-none text-[#333333] bg-transparent"
                placeholder="Height"
                name="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <label htmlFor="" className="text-[16px] ms-[10px] text-[#333333]">
                {t('CM')}
              </label>
            </div>
          </div>
        </div>

        <button type="submit"
          className="font-bold text-[18px] rounded-full mt-[20px] text-white py-[12px] w-[100%] bg-[#1F5799] tracking-[2px] shadow-sm hover:bg-[#1A4A87] transition-colors"
        >
          {" "}
          {t('Update')}{" "}
        </button>
      </form>
    </div>
  </div>
</div>
        <Footer />
</div>
      )}
    </Formik>
  );
};

export default Profile;
/* jshint ignore:end */
