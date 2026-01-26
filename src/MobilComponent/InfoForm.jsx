/* jshint esversion: 6 */
/* jshint ignore:start */

import { useContext, useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../Context/MyProvider";
import { showTost } from "../showTost";
import axios from "axios";
import Check from "../Icon/check.svg";
import { useTranslation } from "react-i18next";
import logo from "../images/logos/meet-greek.png";


const InfoForm = () => {
  const { t } = useTranslation();
  const navigation = useNavigate();
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
    imageBaseURL,
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
  const [interests, setInterests] = useState("");
  const [localBio, setLocalBio] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [otherLanguage, setOtherLanguage] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);

  const [Error, setError] = useState([]);

  useEffect(() => {
    axios.post(`${basUrl}languagelist.php`).then((res) => {
      setLocalLanguages(res.data.languagelist);
    });
  }, []);

  useEffect(() => {
    axios.post(`${basUrl}interest.php`).then((res) => {
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

    // Combine selected languages with "Other" language if it exists
    const allLanguages = [...selectedLanguages];
    if (otherLanguage.trim() && selectedLanguages.includes(t("infoFormOtherLanguage"))) {
      // Replace "Other Language" with the actual custom language entered
      const index = allLanguages.indexOf(t("infoFormOtherLanguage"));
      allLanguages[index] = otherLanguage.trim();
    }
    setLanguages(allLanguages.join(", "));

    setHobbies(interests);

    setBio(localBio);
  };

  const SubmitHandler = () => {
    if (!localFirstName?.trim())
      return showTost({ title: t("validationEnterFirstName") });
    if (!localLastName?.trim())
      return showTost({ title: t("validationEnterLastName") });
    if (!localRelationshipStatus)
      return showTost({ title: t("validationSelectRelationship") });
    if (!localEducation)
      return showTost({ title: t("validationSelectEducation") });
    if (!localProfession?.trim())
      return showTost({ title: t("validationEnterProfession") });
    if (!localSmoking)
      return showTost({ title: t("validationSelectSmoking") });
    if (!localDrinking)
      return showTost({ title: t("validationSelectDrinking") });
    if (selectedLanguages.length === 0)
      return showTost({ title: t("validationSelectLanguage") });
    if (selectedLanguages.includes(t("infoFormOtherLanguage")) && !otherLanguage?.trim())
      return showTost({ title: "Please enter other language" });
    if (!localBio?.trim())
      return showTost({ title: t("validationEnterBio") });
    if (localBio.length < 5)
      return showTost({ title: t("validationBioMinLength") });

    saveDataToContext();

    navigation("/greek-connection");
  };

  const relationshipStatusOptions = [
    t("infoFormSingle"),
    t("infoFormSeparated"),
    t("infoFormDivorced"),
    t("infoFormWidowed")
  ];

  const smokingOptions = [
    t("infoFormNonSmoker"),
    t("infoFormSocialSmoker"),
    t("infoFormSmoker"),
    t("infoFormTryingToQuit")
  ];

  const drinkingOptions = [
    t("infoFormNonDrinker"),
    t("infoFormSocialDrinker"),
    t("infoFormDrinker"),
    t("infoFormOccasionally")
  ];

  const languageOptions = [
    t("infoFormEnglish"),
    t("infoFormGreek"),
    t("infoFormOtherLanguage")
  ];

  return (
    <div className="w-[100%] multisteup-wrapper pt-[20px] Test bg-[#F7F5F2]">
      <div className="container mx-auto">
        <section className="steps step-1 active rounded-[40px] relative bg-white">
          <div className="w-[100%] bg-[#EFEDEE] pt-[30px] z-[999] pb-[20px] fixed top-[0px]">
            <div className="bg-white w-[83%] h-[5px] mx-auto rounded-full">
              <div className="bg-[#1F5799] rounded-full w-[25%] h-[5px]">
                
              </div>
            </div>
          </div>

          <>
            <img
                src={logo}
                alt=""
                width={80}
                height={80}
                className="mt-1 flex-shrink-0"
              />
            <div className="mt-[10px] text-center">
              <h1 className="text-[28px] max-_430_:text-[27px] font-[600] text-[#222222]">
                {t("infoFormTitle")}
              </h1>
              <p className="text-[20px] mt-[10px] max-_430_:text-[20px] max-_380_:text-[16px] text-[#333333]">
                {t("infoFormSubtitle")}
              </p>
            </div>

            <div className="mt-[20px] w-[100%] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    value={localFirstName}
                    onChange={(e) => setLocalFirstName(e.target.value)}
                    className="text-[#333333] w-[100%] border-[2px] outline-none focus:border-[#C89A3D] border-gray-300 bg-white px-[15px] py-[15px] rounded-[10px] shadow-sm"
                    type="text"
                    placeholder={t("infoFormFirstName")}
                  />
                  {localFirstName && (
                    <VscVerifiedFilled className="w-[25px] h-[25px] absolute bottom-[12px] right-5 text-green-500" />
                  )}
                </div>
                <div className="relative">
                  <input
                    value={localLastName}
                    onChange={(e) => setLocalLastName(e.target.value)}
                    className="text-[#333333] w-[100%] border-[2px] outline-none focus:border-[#C89A3D] border-gray-300 bg-white px-[15px] py-[15px] rounded-[10px] shadow-sm"
                    type="text"
                    placeholder={t("infoFormLastName")}
                  />
                  {localLastName && (
                    <VscVerifiedFilled className="w-[25px] h-[25px] absolute bottom-[12px] right-5 text-green-500" />
                  )}
                </div>
              </div>

              <div className="border-[2px] bg-white border-gray-300 rounded-[10px] p-4 shadow-sm">
                <label className="block font-medium mb-3 text-[#333333]">
                  {t("infoFormRelationshipStatus")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {relationshipStatusOptions.map(
                    (status) => (
                      <label
                        key={status}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="relationshipStatus"
                          value={status}
                          checked={localRelationshipStatus === status}
                          onChange={(e) =>
                            setLocalRelationshipStatus(e.target.value)
                          }
                          className="w-5 h-5 text-[#C89A3D]"
                        />
                        <span className="text-[#333333]">{status}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div>
                <select
                  value={localEducation}
                  onChange={(e) => setLocalEducation(e.target.value)}
                  className="w-full border-[2px] outline-none focus:border-[#C89A3D] border-gray-300 bg-white px-[15px] py-[15px] rounded-[10px] shadow-sm text-[#333333]"
                >
                  <option value="">{t("infoFormEducationLabel")}</option>
                  <option value={t("infoFormHighSchool")}>{t("infoFormHighSchool")}</option>
                  <option value={t("infoFormSomeCollege")}>{t("infoFormSomeCollege")}</option>
                  <option value={t("infoFormAssociateDegree")}>{t("infoFormAssociateDegree")}</option>
                  <option value={t("infoFormBachelorsDegree")}>{t("infoFormBachelorsDegree")}</option>
                  <option value={t("infoFormMastersDegree")}>{t("infoFormMastersDegree")}</option>
                  <option value={t("infoFormDoctorate")}>{t("infoFormDoctorate")}</option>
                  <option value={t("infoFormOther")}>{t("infoFormOther")}</option>
                </select>
              </div>

              <div className="relative">
                <input
                  value={localProfession}
                  onChange={(e) => setLocalProfession(e.target.value)}
                  className="text-[#333333] w-[100%] border-[2px] outline-none focus:border-[#C89A3D] border-gray-300 bg-white px-[15px] py-[15px] rounded-[10px] shadow-sm"
                  type="text"
                  placeholder={t("infoFormProfession")}
                />
                {localProfession && (
                  <VscVerifiedFilled className="w-[25px] h-[25px] absolute bottom-[12px] right-5 text-green-500" />
                )}
              </div>

              <div className="border-[2px] bg-white border-gray-300 rounded-[10px] p-4 shadow-sm">
                <label className="block font-medium mb-3 text-[#333333]">
                  {t("infoFormSmoking")}
                </label>
                <div className="grid grid-cols-2  gap-3">
                  {smokingOptions.map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="smoking"
                        value={option}
                        checked={localSmoking === option}
                        onChange={(e) => setLocalSmoking(e.target.value)}
                        className="w-5 h-5 text-[#C89A3D]"
                      />
                      <span className="text-[#333333]">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-[2px] bg-white border-gray-300 rounded-[10px] p-4 shadow-sm">
                <label className="block font-medium mb-3 text-[#333333]">
                  {t("infoFormDrinking")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {drinkingOptions.map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="drinking"
                        value={option}
                        checked={localDrinking === option}
                        onChange={(e) => setLocalDrinking(e.target.value)}
                        className="w-5 h-5 text-[#C89A3D]"
                      />
                      <span className="text-[#333333]">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-[2px] bg-white border-gray-300 rounded-[10px] p-4 shadow-sm">
                <label className="block font-medium mb-3 text-[#333333]">
                  {t("infoFormLanguages")}
                </label>

                {languageOptions.map((lang) => (
                  <label
                    key={lang}
                    className="w-full flex flex-row items-center justify-between text-[18px] max-_430_:text-[14px] py-[10px] cursor-pointer"
                    style={{
                      borderColor:
                        (selectedLanguages.includes(lang)) || 
                        (lang === t("infoFormOtherLanguage") && otherLanguage)
                          ? "#C89A3D"
                          : "",
                    }}
                  >
                    <div className="flex items-center gap-[10px]">
                      <input
                        type="checkbox"
                        name="language"
                        value={lang}
                        checked={selectedLanguages.includes(lang)}
                        onChange={() => {
                          if (lang === t("infoFormOtherLanguage")) {
                            // Toggle "Other" checkbox
                            if (selectedLanguages.includes(lang)) {
                              // Remove "Other" and clear the text input
                              setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
                              setOtherLanguage("");
                            } else {
                              // Add "Other" to selection
                              setSelectedLanguages([...selectedLanguages, lang]);
                            }
                          } else {
                            // Toggle regular language in the array
                            if (selectedLanguages.includes(lang)) {
                              setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
                            } else {
                              setSelectedLanguages([...selectedLanguages, lang]);
                            }
                          }
                        }}
                        className="w-[18px] h-[18px]"
                      />
                      <span className="text-[#333333]">{lang}</span>
                    </div>
                  </label>
                ))}

                {selectedLanguages.includes(t("infoFormOtherLanguage")) && (
                  <input
                    type="text"
                    placeholder={t("infoFormOtherLanguagePlaceholder")}
                    value={otherLanguage}
                    onChange={(e) => setOtherLanguage(e.target.value)}
                    className="w-full mt-[15px] px-[13px] py-[10px] border-[2px] border-gray-300 rounded-[10px] text-[16px]"
                  />
                )}
              </div>

              <div className="">
                <label className="block font-semibold text-[#333333]">
                  {t("infoFormInterests")}
                </label>

                <textarea
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder={t("infoFormInterestsPlaceholder")}
                  rows={4}
                  className="w-full text-[16px] max-_430_:text-[14px] px-[13px] py-[10px] border-[2px] border-gray-300 rounded-[10px] resize-none focus:outline-none focus:border-[#C89A3D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#333333]">
                  {t("infoFormBioLabel")}
                </label>
                <p>
                  {t("infoFormBioDescription")}
                </p>
                <textarea
                  value={localBio}
                  onChange={handleBioChange}
                  className="w-full border-[2px] outline-none focus:border-[#C89A3D] border-gray-300 bg-white px-[15px] py-[15px] rounded-[10px] min-h-[120px] resize-none shadow-sm text-[#333333]"
                  placeholder={t("infoFormBioPlaceholder")}
                  maxLength={maxBioLength}
                />
                <div className="flex justify-between mt-2">
                  <span
                    className={`text-sm ${
                      bioCharCount >= 5 ? "text-green-600" : "text-[#C95B5B]"
                    }`}
                  >
                    {bioCharCount >= 5
                      ? t("infoFormBioEnough")
                      : t("infoFormBioMinLength")}
                  </span>
                  <span
                    className={`text-sm ${
                      bioCharCount > maxBioLength - 50
                        ? "text-orange-500"
                        : "text-gray-500"
                    }`}
                  >
                    {bioCharCount}/{maxBioLength}
                  </span>
                </div>
              </div>
            </div>

            <button
              style={{ background: "#1F5799", borderRadius: "999px" }}
              onClick={SubmitHandler}
              className="btn btn-w-md nextstep mt-[20px] w-full py-3 rounded-full shadow-md hover:bg-[#1A4A87]"
            >
              <div className="flex items-center justify-center gap-[10px]">
                <span className="font-bold text-[1.25rem] text-white">
                  {t("infoFormNextButton")}
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