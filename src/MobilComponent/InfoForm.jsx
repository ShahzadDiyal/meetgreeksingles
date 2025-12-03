/* jshint esversion: 6 */
/* jshint ignore:start */

import { useContext, useState,useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../Context/MyProvider";
import { showTost } from "../showTost";
import axios from "axios";
import Check from "../Icon/check.svg";

const InfoForm = () => {

  const navigation = useNavigate()
  const {
    setFirstName,
    setLastName,
    setRelationshipStatus,
    setEducation,
    setProfession,
    setSmoking,
    setDrinking,
    setLanguages,
    setHobbies,
    setBio,
    basUrl,
    imageBaseURL
  } = useContext(MyContext);

  const [localFirstName, setLocalFirstName] = useState("");
  const [localLastName, setLocalLastName] = useState("");
  const [localRelationshipStatus, setLocalRelationshipStatus] = useState("");
  const [localEducation, setLocalEducation] = useState("");
  const [localProfession, setLocalProfession] = useState("");
  const [localSmoking, setLocalSmoking] = useState("");
  const [localDrinking, setLocalDrinking] = useState("");
  const [localLanguages, setLocalLanguages] = useState([]);
  const [localInterests, setLocalInterests] = useState([]);
  const [localBio, setLocalBio] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
const [selectedInterests, setSelectedInterests] = useState([]);
  const [Error, setError] = useState([]);



  

  useEffect(() => {
      axios.post(`${basUrl}languagelist.php`)
        .then((res) => {
          setLocalLanguages(res.data.languagelist);
        });
    }, []);

    useEffect(() => {
       axios.post(`${basUrl}interest.php`)
         .then((res) => {
  
           setLocalInterests(res.data.interestlist);
         });
     }, []);


 const selectLanguageHandler = (id) => {
  if (selectedLanguages.includes(id)) {
    setSelectedLanguages(selectedLanguages.filter((el) => el !== id));
  } else {
    setSelectedLanguages([...selectedLanguages, id]);
  }
};

const selectInterestHandler = (id) => {
  if (selectedInterests.includes(id)) {
    setSelectedInterests(selectedInterests.filter((item) => item !== id));
    setError(0);
  } else {
    if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, id]);
      setError(1);
    }
  }
};

  useEffect(() => {
  const allSelections = [...selectedLanguages, ...selectedInterests];
}, [selectedLanguages, selectedInterests]);


  const [bioCharCount, setBioCharCount] = useState(0);
  const maxBioLength = 500;

  

  const handleBioChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxBioLength) {
      setLocalBio(value);
      setBioCharCount(value.length);
    }
  };

  const saveDataToContext = () => {
    setFirstName(localFirstName);
    setLastName(localLastName);
    setRelationshipStatus(localRelationshipStatus);
    setEducation(localEducation);
    setProfession(localProfession);
    setSmoking(localSmoking);
    setDrinking(localDrinking);
    
    setLanguages(localLanguages.join(", "));
    
     setHobbies(localInterests.join(","));
    
    setBio(localBio);
  };

  const SubmitHandler = () => {
    if (!localFirstName?.trim()) return showTost({ title: "Please enter your first name" });
    if (!localLastName?.trim()) return showTost({ title: "Please enter your last name" });
    if (!localRelationshipStatus) return showTost({ title: "Please select your relationship status" });
    if (!localEducation) return showTost({ title: "Please select your education level" });
    if (!localProfession?.trim()) return showTost({ title: "Please enter your profession" });
    if (!localSmoking) return showTost({ title: "Please select your smoking preference" });
    if (!localDrinking) return showTost({ title: "Please select your drinking preference" });
    if (localLanguages.length === 0) return showTost({ title: "Please select at least one language" });
    if (!localBio?.trim()) return showTost({ title: "Please write a short bio about yourself" });
    if (localBio.length < 5) return showTost({ title: "Bio should be at least 5 characters" });

    saveDataToContext();
    
    navigation("/greek-connection");
  };

  return (
    <div className="w-[100%] multisteup-wrapper pt-[20px] Test">
      <div className="container mx-auto">
        <section className="steps step-1 active rounded-[40px] relative">
          {/* ----- Progress Bar ----- */}
          <div className="w-[100%] bg-[#EFEDEE] pt-[30px] z-[999] pb-[20px] fixed top-[0px]">
            <div className="bg-white w-[83%] h-[5px] mx-auto rounded-full">
              <div className="bg-[#0066CC] rounded-full w-[25%] h-[5px]"></div>
            </div>
          </div>

          {/* ----- Registration Form ----- */}
          <>
            <div className="mt-[10px]">
              <h1 className="text-[28px] max-_430_:text-[27px] font-[600]">
                Can You elaborate on your identity? 😎
              </h1>
              <p className="text-[20px] mt-[10px] max-_430_:text-[20px] max-_380_:text-[16px]">
                It will Display on your Profile and you will not able to
                change it later
              </p>
            </div>

            <div className="mt-[20px] w-[100%] space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    value={localFirstName}
                    onChange={(e) => setLocalFirstName(e.target.value)}
                    className="text-black w-[100%] border-[2px] outline-[#0066CC] border-gray-300 px-[15px] py-[15px] rounded-[10px]"
                    type="text"
                    placeholder="First Name *"
                  />
                  {localFirstName && (
                    <VscVerifiedFilled className="w-[25px] h-[25px] absolute bottom-[12px] right-5 text-green-500" />
                  )}
                </div>
                <div className="relative">
                  <input
                    value={localLastName}
                    onChange={(e) => setLocalLastName(e.target.value)}
                    className="text-black w-[100%] border-[2px] outline-[#0066CC] border-gray-300 px-[15px] py-[15px] rounded-[10px]"
                    type="text"
                    placeholder="Last Name *"
                  />
                  {localLastName && (
                    <VscVerifiedFilled className="w-[25px] h-[25px] absolute bottom-[12px] right-5 text-green-500" />
                  )}
                </div>
              </div>

              {/* Relationship Status */}
              <div className="border-[2px] border-gray-300 rounded-[10px] p-4">
                <label className="block font-medium mb-3">Relationship Status: *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Single", "Separated", "Divorced", "Widowed"].map((status) => (
                    <label key={status} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="relationshipStatus"
                        value={status}
                        checked={localRelationshipStatus === status}
                        onChange={(e) => setLocalRelationshipStatus(e.target.value)}
                        className="w-5 h-5 text-gray-500"
                      />
                      <span className="text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <select
                  value={localEducation}
                  onChange={(e) => setLocalEducation(e.target.value)}
                  className="w-full border-[2px] outline-[#0066CC] border-gray-300 px-[15px] py-[15px] rounded-[10px]"
                >
                  <option value="">Select Education Level</option>
                  <option value="High School">High School</option>
                  <option value="Some College">Some College</option>
                  <option value="Associate Degree">Associate Degree</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Doctorate">Doctorate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Profession */}
              <div className="relative">
                <input
                  value={localProfession}
                  onChange={(e) => setLocalProfession(e.target.value)}
                  className="text-black w-[100%] border-[2px] outline-[#0066CC] border-gray-300 px-[15px] py-[15px] rounded-[10px]"
                  type="text"
                  placeholder="Profession *"
                />
                {localProfession && (
                  <VscVerifiedFilled className="w-[25px] h-[25px] absolute bottom-[12px] right-5 text-green-500" />
                )}
              </div>

              {/* Smoking */}
              <div className="border-[2px] border-gray-300 rounded-[10px] p-4">
                <label className="block font-medium mb-3">Smoking: *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Non-smoker", "Social smoker", "Smoker", "Trying to quit"].map((option) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="smoking"
                        value={option}
                        checked={localSmoking === option}
                        onChange={(e) => setLocalSmoking(e.target.value)}
                        className="w-5 h-5 text-[#0066CC]"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Drinking */}
              <div className="border-[2px] border-gray-300 rounded-[10px] p-4">
                <label className="block font-medium mb-3">Drinking: *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Non-drinker", "Social drinker", "Drinker", "Occasionally"].map((option) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="drinking"
                        value={option}
                        checked={localDrinking === option}
                        onChange={(e) => setLocalDrinking(e.target.value)}
                        className="w-5 h-5 text-[#0066CC]"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Languages */}
              {/* Languages */}
<div className="border-[2px] border-gray-300 rounded-[10px] p-4">
  <label className="block font-medium mb-3">Languages:</label>
  {localLanguages.map((el) => {
    return (
      <button
        key={el.id}
        onClick={() => selectLanguageHandler(el.id)}
        style={{
          borderColor: selectedLanguages.includes(el.id)
            ? "#0066CC"
            : "",
        }}
        className="w-[100%] flex items-center justify-between text-[18px] max-_430_:text-[14px] px-[13px] py-[8px] border-[2px] border-gray-300 rounded-[10px] mt-[15px]"
      >
        <div className="flex items-center gap-[10px]">
          <img
            src={imageBaseURL + el.img}
            alt={el.title}
            className="w-[45px] h-[45px]"
          />
          {el.title}
        </div>
        <img
          src={Check}
          style={{
            display: selectedLanguages.includes(el.id) ? "block" : "none",
          }}
          alt="check"
          className="w-[20px] h-[20px] me-[20px]"
        />
      </button>
    );
  })}
</div>

              {/* Interests & Hobbies */}
{/* Interests & Hobbies */}
<div className="border-[2px] border-gray-300 rounded-[10px] p-4">
  <label className="block font-medium mb-3">Interests & Hobbies:</label>
  {localInterests.map((el) => {
    return (
      <button
        key={el.id}
        onClick={() => selectInterestHandler(el.id)}
        style={{
          borderColor: selectedInterests.includes(el.id)
            ? "#0066CC"
            : "",
        }}
        className="w-[100%] flex items-center justify-between text-[18px] max-_430_:text-[14px] px-[13px] py-[8px] border-[2px] border-gray-300 rounded-[10px] mt-[15px]"
      >
        <div className="flex items-center gap-[10px]">
          <img
            src={imageBaseURL + el.img}
            alt={el.title}
            className="w-[45px] h-[45px]"
          />
          {el.title}
        </div>
        <img
          src={Check}
          style={{
            display: selectedInterests.includes(el.id) ? "block" : "none",
          }}
          alt="check"
          className="w-[20px] h-[20px] me-[20px]"
        />
      </button>
    );
  })}
</div>

              {/* Bio */}
              <div>
                <textarea
                  value={localBio}
                  onChange={handleBioChange}
                  className="w-full border-[2px] outline-[#0066CC] border-gray-300 px-[15px] py-[15px] rounded-[10px] min-h-[120px] resize-none"
                  placeholder="Tell us about yourself, your interests, what you're looking for... (minimum 5 characters)"
                  maxLength={maxBioLength}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    {bioCharCount >= 5 ? "✓ Bio is long enough" : `Minimum 5 characters required`}
                  </span>
                  <span className={`text-sm ${bioCharCount > maxBioLength - 50 ? "text-orange-500" : "text-gray-500"}`}>
                    {bioCharCount}/{maxBioLength}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              style={{ background: "#0066CC" }}
              onClick={SubmitHandler}
              className="btn btn-w-md nextstep mt-[20px] w-full py-2"
            >
              <div className="flex items-center justify-center gap-[10px]">
                <span className="font-bold text-[1.25rem] text-white">
                  Next
                </span>
                <svg
                  className="mx-6"
                  width="19"
                  height="13"
                  viewBox="0 0 19 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.75455 5.73075H15.4523L11.3296 1.60802C11.2552 1.53617 11.1959 1.45022 11.155 1.35519C11.1142 1.26016 11.0927 1.15795 11.0918 1.05453C11.0909 0.951108 11.1106 0.848543 11.1498 0.752818C11.189 0.657094 11.2468 0.570128 11.3199 0.496995C11.3931 0.423862 11.48 0.366026 11.5758 0.326862C11.6715 0.287698 11.7741 0.267991 11.8775 0.268889C11.9809 0.269788 12.0831 0.291275 12.1781 0.332096C12.2732 0.372918 12.3591 0.432257 12.431 0.50665L17.8833 5.95896C18.0293 6.10503 18.1113 6.30311 18.1113 6.50965C18.1113 6.71618 18.0293 6.91427 17.8833 7.06033L12.431 12.5126C12.2841 12.6545 12.0873 12.733 11.8831 12.7313C11.6789 12.7295 11.4835 12.6476 11.3391 12.5032C11.1947 12.3587 11.1128 12.1634 11.111 11.9592C11.1092 11.7549 11.1877 11.5582 11.3296 11.4113L15.4523 7.28855H1.75455C1.54797 7.28855 1.34986 7.20649 1.20378 7.06041C1.05771 6.91434 0.975649 6.71623 0.975649 6.50965C0.975649 6.30307 1.05771 6.10495 1.20378 5.95888C1.34986 5.81281 1.54797 5.73075 1.75455 5.73075Z"
                    fill="white"
                  />
                </svg>
              </div>
            </button>
          </>
        </section>
      </div>
    </div>
  );
};

export default InfoForm;

/* jshint ignore:end */