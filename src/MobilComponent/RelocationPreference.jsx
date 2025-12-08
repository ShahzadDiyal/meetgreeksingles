/* jshint esversion: 6 */
/* jshint ignore:start */

import { useContext, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { showTost } from "../showTost";
import { MyContext } from "../Context/MyProvider";
import axios from "axios"; 

const RelocationPreference = () => {
  const {
    firstName,
    lastName,
    relationshipStatus,
    education,
    profession,
    smoking,
    drinking,
    greekConnection,
    greekRootConnection,
    religiousBackground,
    faithImportance,
    churchAttendance,
    partnerFaithPreference,
    favoriteTraditions,
    relationshipGoals,
    additionalPreferences,
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
    profileImages,
    userId,
    token,
    basUrl,
    imageCount,
    clearAllData,
  } = useContext(MyContext);

  const navigation = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const localUserId = localStorage.getItem("UserId");

  const buildApiPayload = () => {
    const imageKeys = ["pic0", "pic1", "pic2", "pic3", "pic4", "pic5"];
    const uploadedImageCount = imageKeys.filter(
      (key) => profileImages?.[key] && profileImages[key] instanceof File
    ).length;

    return {
      fname: firstName,
      lname: lastName,
      relationship_status: relationshipStatus,
      education: education,
      profession: profession,
      smoking: smoking,
      drinking: drinking,

      greek_connection: greekConnection,
      greek_root_connection: greekRootConnection || "",

      religious_background: religiousBackground,
      faith_importance: faithImportance,
      church_attendance: churchAttendance,
      partner_faith_preference: partnerFaithPreference,
      favorite_traditions: Array.isArray(favoriteTraditions)
        ? favoriteTraditions.join(", ")
        : favoriteTraditions || "",

      goals: Array.isArray(relationshipGoals)
        ? relationshipGoals.join(", ")
        : relationshipGoals || "",
      additional_preferences: additionalPreferences || "",

      relocation_preference: relocationPreference,
      date_with_children: dateWithChildren,
      have_children: haveChildren,
      want_children: wantChildren,
      travel_willingness: travelWillingness,

      size: imageCount,

      uid: userId || localUserId || "",

      created_at: new Date().toISOString(),
    };
  };

  const getMissingFields = () => {
    const missingFields = [];

    if (!firstName?.trim()) missingFields.push("First Name");
    if (!lastName?.trim()) missingFields.push("Last Name");
    if (!relationshipStatus) missingFields.push("Relationship Status");
    if (!education) missingFields.push("Education");
    if (!profession?.trim()) missingFields.push("Profession");
    if (!greekConnection?.trim())
      missingFields.push("Greek Connection Details");
    if (!religiousBackground) missingFields.push("Religious Background");
    if (!faithImportance) missingFields.push("Importance of Faith");
    if (!churchAttendance) missingFields.push("Church Attendance");
    if (!partnerFaithPreference) missingFields.push("Partner Faith Preference");
    if (!relationshipGoals?.length) missingFields.push("Relationship Goals");
    if (!relocationPreference) missingFields.push("Relocation Preference");
    if (!dateWithChildren) missingFields.push("Dating Someone with Children");
    if (!haveChildren) missingFields.push("Have Children");
    if (!wantChildren) missingFields.push("Want Children");
    if (!travelWillingness) missingFields.push("Travel Willingness");

    if (!smoking) missingFields.push("Smoking Preference");
    if (!drinking) missingFields.push("Drinking Preference");
    if (!greekRootConnection?.trim()) missingFields.push("Greek Roots");

    return missingFields;
  };

  const validateForm = () => {
    if (!relocationPreference) {
      showTost({ title: "Please select your relocation preference" });
      return false;
    }
    if (!dateWithChildren) {
      showTost({
        title:
          "Please select your preference about dating someone with children",
      });
      return false;
    }
    if (!haveChildren) {
      showTost({ title: "Please let us know if you have children" });
      return false;
    }
    if (!wantChildren) {
      showTost({
        title: "Please select your preference about having children",
      });
      return false;
    }
    if (!travelWillingness) {
      showTost({ title: "Please select your willingness to travel" });
      return false;
    }

    return true;
  };

  const submitToApi = async (payload) => {
    try {
      const apiEndpoint = `${basUrl}/profile_info.php`;
      const formData = new FormData();

      console.log("📤 Building FormData...");

      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      const imageKeys = ["pic0", "pic1", "pic2", "pic3", "pic4", "pic5"];
      let imageCount = 0;

      imageKeys.forEach((key, index) => {
        const imageFile = profileImages?.[key];
        if (imageFile && imageFile instanceof File) {
          formData.append(`otherpic${index}`, imageFile);
          imageCount++;
          console.log(` Added image: otherpic${index}`, imageFile.name);
        }
      });

      console.log(` Total images to upload: ${imageCount}`);

      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        if (typeof pair[1] === "string") {
          console.log(`${pair[0]}: ${pair[1]}`);
        } else {
          console.log(`${pair[0]}: [File] ${pair[1].name} (${pair[1].type})`);
        }
      }

      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error(" API Error:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
      throw error;
    }
  };

  const SubmitHandler = async () => {
    if (!validateForm()) {
      return;
    }

    const missingFields = getMissingFields();

    if (missingFields.length > 0) {
      console.log(" Missing fields:", missingFields);
      showTost({
        title: `Complete your profile`,
        message: `Please fill: ${missingFields.slice(0, 3).join(", ")}${
          missingFields.length > 3 ? "..." : ""
        }`,
      });
    }

    setIsSubmitting(true);

    try {
      // Build the payload (text data + size parameter)
      const payload = buildApiPayload();

      console.log("Text payload (excluding images):", payload);

      const imageKeys = ["pic0", "pic1", "pic2", "pic3", "pic4", "pic5"];
      const hasImages = imageKeys.some(
        (key) => profileImages?.[key] && profileImages[key] instanceof File
      );

      if (!hasImages) {
        console.log(" No images selected for upload");
        showTost({
          title: "No Images",
          message: "You haven't selected any profile images.",
          type: "warning",
        });
      }

      const apiResponse = await submitToApi(payload);

      console.log("API Response:", apiResponse);

      showTost({
        title: "Profile Submitted Successfully!",
        message:
          apiResponse.message || "Your profile has been saved to our database.",
        type: "success",
      });

      if (clearAllData) {
        clearAllData();
      }

      // Navigate to login
      navigation("/login");
    } catch (error) {
      console.error(" Submission Error:", error);

      if (error.response) {
        showTost({
          title: "Submission Failed",
          message:
            error.response.data?.message ||
            error.response.data?.ResponseMsg ||
            "Server error occurred.",
          type: "error",
        });
      } else if (error.request) {
        showTost({
          title: "Network Error",
          message:
            "Unable to connect to server. Please check your internet connection.",
          type: "error",
        });
      } else {
        showTost({
          title: "Error",
          message: error.message || "An unexpected error occurred.",
          type: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveToLocalStorage = () => {
    const payload = buildApiPayload();
    localStorage.setItem("userProfile_backup", JSON.stringify(payload));
    console.log(" Profile backup saved to localStorage");
    return payload;
  };

  return (
    <div className="w-[100%] multisteup-wrapper pt-[20px] Test bg-[#F7F5F2]">
      <div className="container mx-auto">
        <section className="steps step-1 active rounded-[40px] relative bg-white">
          {/* ----- Progress Bar ----- */}
          <div className="w-[100%] bg-[#EFEDEE] pt-[30px] z-[999] pb-[20px] fixed top-[0px]">
            <div className="bg-white w-[83%] h-[5px] mx-auto rounded-full">
              <div className="bg-[#1F5799] rounded-full w-[92%] h-[5px]"></div>
            </div>
          </div>

          <div className="mt-[10px]">
            <h1 className="text-[28px] max-_430_:text-[27px] font-[600] text-[#222222]">
              Lifestyle & Future Preferences 🌍
            </h1>
            <p className="text-[20px] mt-[10px] max-_430_:text-[20px] max-_380_:text-[16px] text-[#333333]">
              Help us understand your lifestyle choices and future plans
            </p>
          </div>

          <div className="mt-[20px] w-[100%] space-y-8">
            {/* Relocation Preference */}
            <div className="border-[2px] bg-white border-gray-300 rounded-[10px] p-6 shadow-sm">
              <label className="block font-medium text-xl mb-2 text-[#333333]">
                Would you consider relocating to another country for the right
                person? *
              </label>
              <div>
                {[
                  "Yes — I can relocate anywhere",
                  "Yes — but only within Europe",
                  "Yes — for a long-term, serious relationship",
                  "Maybe — I'm open to discussing it",
                  "No — I prefer staying where I live",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-start space-x-3 cursor-pointer py-2 rounded-lg transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="relocationPreference"
                      value={option}
                      checked={relocationPreference === option}
                      onChange={(e) => setRelocationPreference(e.target.value)}
                      className="w-5 h-5 text-[#C89A3D] mt-1 flex-shrink-0"
                    />
                    <span className="text-[#333333]">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dating someone with children */}
            <div className="border-[2px] bg-white border-gray-300 rounded-[10px] p-6 shadow-sm">
              <label className="block font-medium mb-2 text-xl text-[#333333]">
                Would you date someone with children? *
              </label>
              <div className="space-y-4">
                {[
                  "Yes — I'm very comfortable dating someone with children",
                  "Yes — if family responsibilities are respected",
                  "Maybe — it depends on the dynamics",
                  "No — I prefer dating someone without children",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-start space-x-3 cursor-pointer py-1 rounded-lg transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="dateWithChildren"
                      value={option}
                      checked={dateWithChildren === option}
                      onChange={(e) => setDateWithChildren(e.target.value)}
                      className="w-5 h-5 text-[#C89A3D] mt-1 flex-shrink-0"
                    />
                    <span className="text-[#333333]">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Have children */}
            <div className="border-[2px] bg-white border-gray-300 rounded-[10px] p-6 shadow-sm">
              <label className="block font-medium mb-2 text-xl text-[#333333]">
                Do you have children? *
              </label>
              <div className="">
                {[
                  "Yes — they are an important part of my life",
                  "Yes — but they are adults now",
                  "No",
                  "Prefer not to answer",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-start space-x-3 cursor-pointer py-2 rounded-lg transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="haveChildren"
                      value={option}
                      checked={haveChildren === option}
                      onChange={(e) => setHaveChildren(e.target.value)}
                      className="w-5 h-5 text-[#C89A3D] mt-1 flex-shrink-0"
                    />
                    <span className="text-[#333333]">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Want children */}
            <div className="border-[2px] bg-white border-gray-300 rounded-[10px] p-6 shadow-sm">
              <label className="block font-medium mb-2 text-xl text-[#333333]">
                Do you want to have children? *
              </label>
              <div>
                {[
                  "Yes — I want children in the future",
                  "Maybe — I'm open but not certain",
                  "No — I don't want children",
                  "I already have children and don't want more",
                  "I'm open to having more children",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-start space-x-3 cursor-pointer py-2 rounded-lg transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="wantChildren"
                      value={option}
                      checked={wantChildren === option}
                      onChange={(e) => setWantChildren(e.target.value)}
                      className="w-5 h-5 text-[#C89A3D] mt-1 flex-shrink-0"
                    />
                    <span className="text-[#333333]">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Willing to travel */}
            <div className="border-[2px] bg-white border-gray-300 rounded-[10px] p-6 shadow-sm">
              <label className="block font-medium mb-2 text-xl text-[#333333]">
                Are you willing to travel to meet someone? *
              </label>
              <div>
                {[
                  "Yes — I can travel internationally for the right person",
                  "Yes — I can travel within my country/region to meet someone special",
                  "Maybe — I'm open to traveling if the connection feels right",
                  "No — I prefer someone near my location",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-start space-x-3 cursor-pointer py-2 rounded-lg transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="travelWillingness"
                      value={option}
                      checked={travelWillingness === option}
                      onChange={(e) => setTravelWillingness(e.target.value)}
                      className="w-5 h-5 text-[#C89A3D] mt-1 flex-shrink-0"
                    />
                    <span className="text-[#333333]">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Debug/Test Button (optional) */}
          {/* <button
            onClick={() => {
              const payload = buildApiPayload();
              console.log("📋 Complete API Payload:", payload);
              const missing = getMissingFields();
              console.log("Missing Fields:", missing);
              saveToLocalStorage();
              showTost({ 
                title: "Test Complete", 
                message: `Payload built. ${missing.length} missing fields. Check console for details.`,
                type: "info"
              });
            }}
            className="btn btn-w-md mt-4 w-full py-3 rounded-full bg-[#333333] hover:bg-[#222222] transition-colors shadow-sm"
          >
            <div className="flex items-center justify-center gap-[10px]">
              <span className="font-bold text-[1.25rem] text-white">Test & Preview Payload</span>
            </div>
          </button> */}

          {/* Submit Profile Button */}
          <button
            style={{ background: "#1F5799", borderRadius: "999px" }}
            onClick={SubmitHandler}
            disabled={isSubmitting}
            className={`btn btn-w-md nextstep mt-[20px] w-full py-3 rounded-full transition-colors shadow-md hover:shadow-lg ${
              isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-[#1A4A87]"
            }`}
          >
            <div className="flex items-center justify-center gap-[10px]">
              {isSubmitting ? (
                <>
                  <span className="font-bold text-[1.25rem] text-white">
                    Submitting...
                  </span>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </>
              ) : (
                <span className="font-bold text-[1.25rem] text-white">
                  Submit my Profile
                </span>
              )}
            </div>
          </button>
        </section>
      </div>
    </div>
  );
};

export default RelocationPreference;

/* jshint ignore:end */
