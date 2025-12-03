/* jshint esversion: 6 */
/* jshint ignore:start */

import { useContext, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { showTost } from "../showTost";
import { MyContext } from "../Context/MyProvider";
import axios from "axios"; // Make sure to import axios

const RelocationPreference = () => {
  const {
    // Personal Info
    firstName,
    lastName,
    relationshipStatus,
    education,
    profession,
    smoking,
    drinking,
    
    // Greek Connection
    // greekStatus,
    greekConnection,
    greekRootConnection,
    
    // Faith & Culture
    religiousBackground,
    faithImportance,
    churchAttendance,
    partnerFaithPreference,
    favoriteTraditions,
    
    // Relationship Goals
    relationshipGoals,
    additionalPreferences,
    
    // Lifestyle Preferences
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
    
    // Profile Images
    profileImages,
    
    // User ID and other auth info if available
    userId, 
    token,
      basUrl,

    
    // Clear all data function (optional)
    clearAllData
  } = useContext(MyContext);

  const navigation = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);


  // const userid = localStorage.getItem("UserId")
  // const Data = localStorage.getItem("Register_User");
  // const Userid = JSON.parse(Data);
  // setUserId( Userid.id)
  // Build the API payload matching your table structure
  const buildApiPayload = () => {
    return {
      // Personal Info - matching your table fields
      fname: firstName,
      lname: lastName,
      relationship_status: relationshipStatus,
      education: education,
      profession: profession,
      smoking: smoking,
      drinking: drinking,
      
      // Greek Connection
      // greek_status: greekStatus,
      greek_connection: greekConnection,
      greek_root_connection: greekRootConnection,
      
      // Faith & Culture
      religious_background: religiousBackground,
      faith_importance: faithImportance,
      church_attendance: churchAttendance,
      partner_faith_preference: partnerFaithPreference,
      favorite_traditions: Array.isArray(favoriteTraditions) ? favoriteTraditions.join(', ') : favoriteTraditions,
      
      // Relationship Goals
      goals: Array.isArray(relationshipGoals) ? relationshipGoals.join(', ') : relationshipGoals,
      additional_preferences: additionalPreferences,
      
      // Lifestyle Preferences
      relocation_preference: relocationPreference,
      date_with_children: dateWithChildren,
      have_children: haveChildren,
      want_children: wantChildren,
      travel_willingness: travelWillingness,
      
      // Profile Images
      otherpic0: profileImages?.pic0 || '',
      otherpic1: profileImages?.pic1 || '',
      otherpic2: profileImages?.pic2 || '',
      otherpic3: profileImages?.pic3 || '',
      otherpic4: profileImages?.pic4 || '',
      otherpic5: profileImages?.pic5 || '',
      
      // Optional: Add user ID if available
      uid: userId || '',
      
      // Timestamp
      created_at: new Date().toISOString(),
    };
  };

  const getMissingFields = () => {
    const missingFields = [];
    
    // Check required fields - adjust these based on your API requirements
    if (!firstName?.trim()) missingFields.push("First Name");
    if (!lastName?.trim()) missingFields.push("Last Name");
    if (!relationshipStatus) missingFields.push("Relationship Status");
    if (!education) missingFields.push("Education");
    if (!profession?.trim()) missingFields.push("Profession");
    if (!greekConnection?.trim()) missingFields.push("Greek Connection Details");
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
    
    // Optional fields (still good to check)
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
      showTost({ title: "Please select your preference about dating someone with children" });
      return false;
    }
    if (!haveChildren) {
      showTost({ title: "Please let us know if you have children" });
      return false;
    }
    if (!wantChildren) {
      showTost({ title: "Please select your preference about having children" });
      return false;
    }
    if (!travelWillingness) {
      showTost({ title: "Please select your willingness to travel" });
      return false;
    }
    
    return true;
  };

  // In the submitToApi function, change the content type
const submitToApi = async (payload) => {
  try {
    // Replace with your actual API endpoint
    const apiEndpoint = `${basUrl}/profile_info.php`;
    
    // Use URLSearchParams instead of FormData since you're not uploading files
    const formData = new URLSearchParams();
    
    // Append all data to formData
    Object.keys(payload).forEach(key => {
      if (payload[key] !== undefined && payload[key] !== null) {
        formData.append(key, payload[key]);
      }
    });
    
    console.log("📤 Sending payload to API:", payload);
    
    const response = await axios.post(apiEndpoint, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    
    return response.data;
    
  } catch (error) {
    console.error("❌ API Error:", error);
    throw error;
  }
};

  const SubmitHandler = async () => {
    // Validate current form
    if (!validateForm()) {
      return;
    }
    
    // Check for all missing fields
    const missingFields = getMissingFields();
    
    if (missingFields.length > 0) {
      console.log("❌ Missing fields:", missingFields);
      showTost({ 
        title: `Complete your profile`, 
        message: `Please fill: ${missingFields.slice(0, 3).join(", ")}${missingFields.length > 3 ? "..." : ""}` 
      });
      
      // If you want to allow partial submission, you can continue
      // Otherwise, you might want to return here:
      // return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Build the payload
      const payload = buildApiPayload();
      
      // Send to API
      const apiResponse = await submitToApi(payload);
      
      console.log("✅ API Response:", apiResponse);
      
      // Show success message
      showTost({ 
        title: "Profile Submitted Successfully! ✅", 
        message: apiResponse.message || "Your profile has been saved to our database.",
        type: "success"
      });
      
      // Clear context data if needed
      if (clearAllData) {
        clearAllData();
      }
      
      // Navigate to home or dashboard
      navigation("/");
      
    } catch (error) {
      console.error("❌ Submission Error:", error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error
        showTost({ 
          title: "Submission Failed", 
          message: error.response.data?.message || "Server error occurred. Please try again.",
          type: "error"
        });
      } else if (error.request) {
        // No response received
        showTost({ 
          title: "Network Error", 
          message: "Unable to connect to server. Please check your internet connection.",
          type: "error"
        });
      } else {
        // Other errors
        showTost({ 
          title: "Error", 
          message: "An unexpected error occurred. Please try again.",
          type: "error"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Optional: Save to localStorage as backup
  const saveToLocalStorage = () => {
    const payload = buildApiPayload();
    localStorage.setItem('userProfile_backup', JSON.stringify(payload));
    console.log("✅ Profile backup saved to localStorage");
    return payload;
  };

  return (
    <div className="w-[100%] multisteup-wrapper pt-[20px] Test">
      <div className="container mx-auto">
        <section className="steps step-1 active rounded-[40px] relative">
          {/* ----- Progress Bar ----- */}
          <div className="w-[100%] bg-[#EFEDEE] pt-[30px] z-[999] pb-[20px] fixed top-[0px]">
            <div className="bg-white w-[83%] h-[5px] mx-auto rounded-full">
              <div className="bg-[#0066CC] rounded-full w-[92%] h-[5px]"></div>
            </div>
          </div>

          <div className="mt-[10px]">
            <h1 className="text-[28px] max-_430_:text-[27px] font-[600]">
              Lifestyle & Future Preferences 🌍
            </h1>
            <p className="text-[20px] mt-[10px] max-_430_:text-[20px] max-_380_:text-[16px]">
              Help us understand your lifestyle choices and future plans
            </p>
          </div>

          <div className="mt-[20px] w-[100%] space-y-8">
            {/* Relocation Preference */}
            <div className="border-[2px] border-gray-300 rounded-[10px] p-6">
              <label className="block font-medium text-xl mb-2">
                Would you consider relocating to another country for the right person? *
              </label>
              <div>
                {[
                  "Yes — I can relocate anywhere",
                  "Yes — but only within Europe",
                  "Yes — for a long-term, serious relationship",
                  "Maybe — I'm open to discussing it",
                  "No — I prefer staying where I live"
                ].map((option) => (
                  <label key={option} className="flex items-start space-x-3 cursor-pointer py-2 rounded-lg transition-colors">
                    <input
                      type="radio"
                      name="relocationPreference"
                      value={option}
                      checked={relocationPreference === option}
                      onChange={(e) => setRelocationPreference(e.target.value)}
                      className="w-5 h-5 text-[#0066CC] mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dating someone with children */}
            <div className="border-[2px] border-gray-300 rounded-[10px] p-6">
              <label className="block font-medium mb-2 text-xl">
                Would you date someone with children? *
              </label>
              <div className="space-y-4">
                {[
                  "Yes — I'm very comfortable dating someone with children",
                  "Yes — if family responsibilities are respected",
                  "Maybe — it depends on the dynamics",
                  "No — I prefer dating someone without children"
                ].map((option) => (
                  <label key={option} className="flex items-start space-x-3 cursor-pointer py-1 rounded-lg transition-colors">
                    <input
                      type="radio"
                      name="dateWithChildren"
                      value={option}
                      checked={dateWithChildren === option}
                      onChange={(e) => setDateWithChildren(e.target.value)}
                      className="w-5 h-5 text-[#0066CC] mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Have children */}
            <div className="border-[2px] border-gray-300 rounded-[10px] p-6">
              <label className="block font-medium mb-2 text-xl">
                Do you have children? *
              </label>
              <div className="">
                {[
                  "Yes — they are an important part of my life",
                  "Yes — but they are adults now",
                  "No",
                  "Prefer not to answer"
                ].map((option) => (
                  <label key={option} className="flex items-start space-x-3 cursor-pointer py-2 rounded-lg transition-colors">
                    <input
                      type="radio"
                      name="haveChildren"
                      value={option}
                      checked={haveChildren === option}
                      onChange={(e) => setHaveChildren(e.target.value)}
                      className="w-5 h-5 text-[#0066CC] mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Want children */}
            <div className="border-[2px] border-gray-300 rounded-[10px] p-6">
              <label className="block font-medium mb-2 text-xl">
                Do you want to have children? *
              </label>
              <div>
                {[
                  "Yes — I want children in the future",
                  "Maybe — I'm open but not certain",
                  "No — I don't want children",
                  "I already have children and don't want more",
                  "I'm open to having more children"
                ].map((option) => (
                  <label key={option} className="flex items-start space-x-3 cursor-pointer py-2 rounded-lg transition-colors">
                    <input
                      type="radio"
                      name="wantChildren"
                      value={option}
                      checked={wantChildren === option}
                      onChange={(e) => setWantChildren(e.target.value)}
                      className="w-5 h-5 text-[#0066CC] mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Willing to travel */}
            <div className="border-[2px] border-gray-300 rounded-[10px] p-6">
              <label className="block font-medium mb-2 text-xl">
                Are you willing to travel to meet someone? *
              </label>
              <div>
                {[
                  "Yes — I can travel internationally for the right person",
                  "Yes — I can travel within my country/region to meet someone special",
                  "Maybe — I'm open to traveling if the connection feels right",
                  "No — I prefer someone near my location"
                ].map((option) => (
                  <label key={option} className="flex items-start space-x-3 cursor-pointer py-2 rounded-lg transition-colors">
                    <input
                      type="radio"
                      name="travelWillingness"
                      value={option}
                      checked={travelWillingness === option}
                      onChange={(e) => setTravelWillingness(e.target.value)}
                      className="w-5 h-5 text-[#0066CC] mt-1 flex-shrink-0"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Debug/Test Button (optional) */}
          <button
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
            className="btn btn-w-md mt-4 w-full py-3 rounded-xl bg-gray-600 hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center justify-center gap-[10px]">
              <span className="font-bold text-[1.25rem] text-white">Test & Preview Payload</span>
            </div>
          </button>

          {/* Submit Profile Button */}
          <button
            style={{ background: "#0066CC" }}
            onClick={SubmitHandler}
            disabled={isSubmitting}
            className={`btn btn-w-md nextstep mt-[20px] w-full py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0055aa]'}`}
          >
            <div className="flex items-center justify-center gap-[10px]">
              {isSubmitting ? (
                <>
                  <span className="font-bold text-[1.25rem] text-white">Submitting...</span>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </>
              ) : (
                <span className="font-bold text-[1.25rem] text-white">Submit my Profile</span>
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