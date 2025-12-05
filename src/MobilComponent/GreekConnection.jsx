/* jshint esversion: 6 */
/* jshint ignore:start */

import { useContext, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../Context/MyProvider";
import { showTost } from "../showTost";

const GreekConnection = () => {
  const navigation = useNavigate();
  
  // Get context values - Fixed the typo in setgreekRootConnection
  const { 
    greekConnection, 
    setGreekConnection, 
    greekRootConnection, 
    setGreekRootConnection  // Changed from setgreekRootConnection to setGreekRootConnection
  } = useContext(MyContext);

  // Initialize local state with context values
  const [localGreekConnection, setLocalGreekConnection] = useState(greekConnection || "");
  const [localGreekRootConnection, setLocalGreekRootConnection] = useState(greekRootConnection || "");

  const saveDataToContext = () => {
    setGreekRootConnection(localGreekRootConnection);
    setGreekConnection(localGreekConnection);
  };

  const SubmitHandler = () => {
    // Basic validations
    if (!localGreekConnection)
      return showTost({ title: "Please select your Greek connection" });
    
    if (!localGreekRootConnection?.trim())
      return showTost({
        title: "Please tell us about your Greek roots/connection",
      });

    saveDataToContext();

    // Navigate to next step
    navigation("/faith-culture-tradition");
  };

  // Handler for radio button changes
  const handleGreekConnectionChange = (value) => {
    setLocalGreekConnection(value);
  };

 return (
    <div className="w-[100%] multisteup-wrapper pt-[20px] Test bg-[#F7F5F2]">
      <div className="container mx-auto">
        <section className="steps step-1 active rounded-[40px] relative bg-white">
          {/* ----- Progress Bar ----- */}
          <div className="w-[100%] bg-[#EFEDEE] pt-[30px] z-[999] pb-[20px] fixed top-[0px]">
            <div className="bg-white w-[83%] h-[5px] mx-auto rounded-full">
              <div className="bg-[#1F5799] rounded-full w-[43%] h-[5px]"></div>
            </div>
          </div>

          <div className="mt-[10px]">
            <h1 className="text-[28px] max-_430_:text-[27px] font-[600] text-[#222222]">
              Tell us about your Greek connection 🏛️
            </h1>
            <p className="text-[20px] mt-[10px] max-_430_:text-[20px] max-_380_:text-[16px] text-[#333333]">
              This helps us understand your connection to Greek culture and
              heritage
            </p>
          </div>

          <div className="mt-[20px] w-[100%] space-y-6">
            {/* Greek Connection Options */}
            <div className="border-[2px] bg-white border-gray-300 rounded-[10px] p-3 shadow-sm">
              <label className="block font-medium mb-4 text-lg text-[#333333]">
                Your Greek Connection: *
              </label>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer rounded-lg transition-colors hover:bg-gray-50 p-2">
                  <input
                    type="radio"
                    name="greekOption"
                    value="Greek"
                    checked={localGreekConnection === "Greek"}
                    onChange={() => handleGreekConnectionChange("Greek")}
                    className="w-5 h-5 text-[#C89A3D]"
                  />
                  <div className="flex-1">
                    <span className="text-[#333333] font-medium">Greek</span>
                    <p className="text-[#333333] text-sm mt-1">
                      I am a Greek citizen/resident
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer rounded-lg transition-colors hover:bg-gray-50 p-2">
                  <input
                    type="radio"
                    name="greekOption"
                    value="Greek origin"
                    checked={localGreekConnection === "Greek origin"}
                    onChange={() => handleGreekConnectionChange("Greek origin")}
                    className="w-5 h-5 text-[#C89A3D]"
                  />
                  <div className="flex-1">
                    <span className="text-[#333333] font-medium">
                      Greek origin
                    </span>
                    <p className="text-[#333333] text-sm mt-1">
                      I have Greek ancestry/heritage
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer rounded-lg transition-colors hover:bg-gray-50 p-2">
                  <input
                    type="radio"
                    name="greekOption"
                    value="Philhellene"
                    checked={localGreekConnection === "Philhellene"}
                    onChange={() => handleGreekConnectionChange("Philhellene")}
                    className="w-5 h-5 text-[#C89A3D]"
                  />
                  <div className="flex-1">
                    <span className="text-[#333333] font-medium">
                      Philhellene
                    </span>
                    <p className="text-[#333333] text-sm mt-1">
                      I admire and love Greek culture, history, and language
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Greek Roots/Connection Details */}
            <div className="relative">
              <label className="block font-medium mb-3 text-lg text-[#333333]">
                My Greek roots / connection: *
              </label>
              <textarea
                value={localGreekRootConnection}
                onChange={(e) => setLocalGreekRootConnection(e.target.value)}
                className="text-[#333333] w-[100%] outline-none focus:border-[#C89A3D] border-2 border-gray-300 bg-white px-[15px] py-[15px] rounded-[10px] min-h-[150px] resize shadow-sm"
                placeholder="Tell us more about your Greek connection...
                  • Which Greek regions/places are you connected to?
                  • Family background or ancestry
                  • Cultural connections or experiences
                  • Why Greek culture is important to you"
              />
              {localGreekRootConnection && (
                <VscVerifiedFilled className="w-[25px] h-[25px] absolute bottom-3 right-5 text-green-500" />
              )}
              <p className="text-[#333333] text-sm mt-2">
                Share details about your Greek heritage, family background, or
                what draws you to Greek culture
              </p>
            </div>
          </div>

          {/* Next Button */}
          <button
            style={{ background: "#1F5799", borderRadius: "999px" }}
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

export default GreekConnection;

/* jshint ignore:end */