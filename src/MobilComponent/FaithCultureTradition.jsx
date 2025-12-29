/* jshint esversion: 6 */
/* jshint ignore:start */

import { useContext, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../Context/MyProvider";
import { showTost } from "../showTost";

const FaithCultureTradition = () => {
  const navigation = useNavigate()
  // Get context setters
  const {
    setReligiousBackground,
    setFaithImportance,
    setChurchAttendance,
    setPartnerFaithPreference,
    setFavoriteTraditions,
    
  } = useContext(MyContext);

  // Local state for form fields
  const [localReligiousBackground, setLocalReligiousBackground] = useState("");
  const [localFaithImportance, setLocalFaithImportance] = useState("");
  const [localChurchAttendance, setLocalChurchAttendance] = useState("");
  const [localPartnerFaithPreference, setLocalPartnerFaithPreference] = useState("");
  const [localFavoriteTraditions, setLocalFavoriteTraditions] = useState([]);
  const [localAdditionalInfo, setLocalAdditionalInfo] = useState("");

  // Available traditions
  const availableTraditions = [
    "Easter (Pascha)",
    "Sacraments (weddings, baptisms)",
    "Name Days",
    "Christmas",
    "New year",
    "Summer festivals",
    "Lighting candles",
    "Visiting monasteries / churches",
    "Fasting",
    "Other",
  ];

  // Handle tradition selection
  const handleTraditionToggle = (tradition) => {
    const updatedTraditions = localFavoriteTraditions.includes(tradition)
      ? localFavoriteTraditions.filter((t) => t !== tradition)
      : [...localFavoriteTraditions, tradition];
    
    setLocalFavoriteTraditions(updatedTraditions);
  };

  // Save all data to context before navigating
  const saveDataToContext = () => {
    // Save religious background
    setReligiousBackground(localReligiousBackground);
    
    // Save faith importance
    setFaithImportance(localFaithImportance);
    
    // Save church attendance
    setChurchAttendance(localChurchAttendance);
    
    // Save partner faith preference
    setPartnerFaithPreference(localPartnerFaithPreference);
    
    // Save favorite traditions (as array or string depending on your context)
    setFavoriteTraditions(localFavoriteTraditions);
    
    // Note: If you want to save additionalInfo, you need to add it to context
    // For now, we'll just log it
    console.log("Additional Info:", localAdditionalInfo);
  };

  const SubmitHandler = () => {
    // Basic validations
    if (!localReligiousBackground)
      return showTost({ title: "Please select your religious background" });
    if (!localFaithImportance)
      return showTost({ title: "Please select importance of faith" });
    if (!localChurchAttendance)
      return showTost({ title: "Please select church attendance frequency" });
    if (!localPartnerFaithPreference)
      return showTost({
        title: "Please select preference for partner's faith",
      });

    // Save all data to context
    saveDataToContext();

    // Prepare data for submission (optional - for debugging)
    const faithData = {
      religiousBackground: localReligiousBackground,
      faithImportance: localFaithImportance,
      churchAttendance: localChurchAttendance,
      partnerFaithPreference: localPartnerFaithPreference,
      favoriteTraditions: localFavoriteTraditions,
      additionalInfo: localAdditionalInfo,
    };

    console.log("Faith & Culture Data:", faithData);

    // Navigate to next step
    navigation("/looking-for");
  };

 return (
    <div className="w-[100%] multisteup-wrapper pt-[20px] Test bg-[#F7F5F2]">
      <div className="container mx-auto">
        <section className="steps step-1 active rounded-[40px] relative bg-white">
          {/* ----- Progress Bar ----- */}
          <div className="w-[100%] bg-[#EFEDEE] pt-[30px] z-[999] pb-[20px] fixed top-[0px]">
            <div className="bg-white w-[83%] h-[5px] mx-auto rounded-full">
              <div className="bg-[#1F5799] rounded-full w-[65%] h-[5px]"></div>
            </div>
          </div>

          <div className="mt-[10px]">
            <h1 className="text-[28px] max-_430_:text-[27px] font-[600] text-[#222222]">
              Faith & Cultural Traditions ⛪
            </h1>
            <p className="text-[20px] mt-[10px] max-_430_:text-[20px] max-_380_:text-[16px] text-[#333333]">
              Share about your religious background and cultural practices
            </p>
          </div>

          <div className="mt-[20px] w-[100%] space-y-6">
            {/* Religious Background */}
            <div className="border-[2px] bg-white border-gray-300 rounded-[10px] p-4 shadow-sm">
              <label className="block font-medium mb-3 text-lg text-[#333333]">
                Religious Background: *
              </label>
              <div className="space-y-3">
                {[
                  "Greek Orthodox Christian",
                  "Christian (other)",
                  "Spiritual but not religious",
                  "Other",
                  "Prefer not to say",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="religiousBackground"
                      value={option}
                      checked={localReligiousBackground === option}
                      onChange={(e) => setLocalReligiousBackground(e.target.value)}
                      className="w-5 h-5 text-[#C89A3D]"
                    />
                    <span className="text-[#333333]">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Importance of Faith */}
            <div className="border-[2px] bg-white border-gray-300 rounded-[10px] p-4 shadow-sm">
              <label className="block font-medium mb-3 text-lg text-[#333333]">
                Importance of Faith: *
              </label>
              <div className="space-y-3">
                {[
                  "Very important",
                  "Somewhat important",
                  "Not very important",
                  "Not important",
                  "Prefer not to share",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="faithImportance"
                      value={option}
                      checked={localFaithImportance === option}
                      onChange={(e) => setLocalFaithImportance(e.target.value)}
                      className="w-5 h-5 text-[#C89A3D]"
                    />
                    <span className="text-[#333333]">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Church Attendance */}
            <div className="border-[2px] bg-white border-gray-300 rounded-[10px] p-4 shadow-sm">
              <label className="block font-medium mb-3 text-lg text-[#333333]">
                Church Attendance: *
              </label>
              <div className="space-y-3">
                {[
                  "Regularly",
                  "Occasionally (holidays, celebrations)",
                  "Rarely",
                  "Never",
                  "Prefer not to say",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="churchAttendance"
                      value={option}
                      checked={localChurchAttendance === option}
                      onChange={(e) => setLocalChurchAttendance(e.target.value)}
                      className="w-5 h-5 text-[#C89A3D]"
                    />
                    <span className="text-[#333333]">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Partner Faith Preference */}
            <div className="border-[2px] bg-white border-gray-300 rounded-[10px] p-4 shadow-sm">
              <label className="block font-medium mb-3 text-lg text-[#333333]">
                Would you prefer a partner who shares your faith and traditions?
                *
              </label>
              <div className="space-y-3">
                {[
                  "Very important",
                  "Preferable",
                  "Not necessary",
                  "Prefer not to say",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="partnerFaithPreference"
                      value={option}
                      checked={localPartnerFaithPreference === option}
                      onChange={(e) =>
                        setLocalPartnerFaithPreference(e.target.value)
                      }
                      className="w-5 h-5 text-[#C89A3D]"
                    />
                    <span className="text-[#333333]">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Favorite Greek Traditions */}
        <div className="border-[2px] bg-white border-gray-300 rounded-[10px] p-4 shadow-sm">
  <label className="block font-medium mb-3 text-lg text-[#333333]">
    Favorite Greek traditions:
  </label>
  <p className="text-[#333333] mb-4 text-sm">Select all that apply</p>

  <div className="gap-3">
    {availableTraditions.map((tradition) => (
      <div key={tradition} className="w-full">
        <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg w-full">
          <input
            type="checkbox"
            checked={
              tradition !== "Other"
                ? localFavoriteTraditions.includes(tradition)
                : localFavoriteTraditions.some((t) => !availableTraditions.includes(t))
            }
            onChange={() => {
              if (tradition === "Other") {
                // Add placeholder empty string to start typing
                if (!localFavoriteTraditions.some((t) => !availableTraditions.includes(t))) {
                  setLocalFavoriteTraditions([...localFavoriteTraditions, ""]);
                }
              } else {
                handleTraditionToggle(tradition);
              }
            }}
            className="w-5 h-5 text-[#C89A3D] rounded flex-shrink-0"
          />
          <span className="text-[#333333] w-full">{tradition}</span>
        </label>

        {/* Show Other input if selected */}
        {tradition === "Other" &&
          localFavoriteTraditions.some((t) => !availableTraditions.includes(t)) && (
            <input
              type="text"
              placeholder="Enter your own tradition"
              value={localFavoriteTraditions.find((t) => !availableTraditions.includes(t)) || ""}
              onChange={(e) => {
                const otherValue = e.target.value;
                const filtered = localFavoriteTraditions.filter((t) => availableTraditions.includes(t));
                if (otherValue) filtered.push(otherValue);
                setLocalFavoriteTraditions(filtered);
              }}
              className="w-full mt-2 px-3 py-2 border-[2px] border-gray-300 rounded-[10px] text-[16px]"
            />
          )}
      </div>
    ))}
  </div>

  {/* Show selected traditions count */}
  {localFavoriteTraditions.length > 0 && (
    <div className="mt-3">
      <p className="text-sm text-[#333333]">
        Selected: <span className="font-medium">{localFavoriteTraditions.length}</span> tradition(s)
      </p>
    </div>
  )}
</div>



            {/* Additional Information (Optional) */}
            <div>
              <label className="block font-medium mb-3 text-lg text-[#333333]">
                Optional: Share anything about your faith, culture, or values
              </label>
              <textarea
                value={localAdditionalInfo}
                onChange={(e) => setLocalAdditionalInfo(e.target.value)}
                className="text-[#333333] w-[100%] border-[2px] outline-none focus:border-[#C89A3D] border-gray-300 bg-white px-[15px] py-[15px] rounded-[10px] min-h-[170px] resize-none shadow-sm"
                placeholder="You can share about:
                    • Your personal spiritual journey
                    • Cultural traditions important to you
                    • Values that guide your life
                    • Anything else you'd like to mention..."
              />
              <p className="text-[#333333] text-sm mt-2">
                This is optional but helps others understand you better
              </p>
            </div>
          </div>

          {/* Next Button */}
          <button
            style={{ background: "#1F5799", borderRadius:"999px" }}
            onClick={SubmitHandler}
            className="btn btn-w-md nextstep mt-[20px] w-full py-3 rounded-full hover:bg-[#1A4A87] transition-colors shadow-md"
          >
            <div className="flex items-center justify-center gap-[10px]">
              <span className="font-bold text-[1.25rem] text-white">Next</span>
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
        </section>
      </div>
    </div>
  );
};

export default FaithCultureTradition;

/* jshint ignore:end */