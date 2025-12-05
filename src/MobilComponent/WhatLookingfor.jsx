/* jshint esversion: 6 */
/* jshint ignore:start */

import { useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { showTost } from "../showTost";
import { MyContext } from "../Context/MyProvider";

const WhatLookingFor = () => {
  const availableGoals = [
    "Friendship",
    "Dating",
    "Long-term relationship",
    "Marriage",
    "Undecided"
  ];
  
  // Get context values
  const {
    relationshipGoals,
    setRelationshipGoals,
  } = useContext(MyContext);

  const navigation = useNavigate();

  const handleGoalToggle = (goal) => {
    setRelationshipGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const SubmitHandler = () => {
    if (relationshipGoals.length === 0)
      return showTost({ title: "Please select at least one relationship goal" });

    // Data is already saved in context through setRelationshipGoals
    const goalsData = {
      relationshipGoals,
    };

    console.log("Relationship Goals Data:", goalsData);

    navigation("/relocation-preference");
  };

return (
    <div className="w-[100%] multisteup-wrapper pt-[20px] Test bg-[#F7F5F2]">
      <div className="container mx-auto">
        <section className="steps step-1 active rounded-[40px] relative bg-white">
          {/* ----- Progress Bar ----- */}
          <div className="w-[100%] bg-[#EFEDEE] pt-[30px] z-[999] pb-[20px] fixed top-[0px]">
            <div className="bg-white w-[83%] h-[5px] mx-auto rounded-full">
              <div className="bg-[#1F5799] rounded-full w-[75%] h-[5px]"></div>
            </div>
          </div>

          <div className="mt-[10px]">
            <h1 className="text-[28px] max-_430_:text-[27px] font-[600] text-[#222222]">
              What You're Looking For 💖
            </h1>
            <p className="text-[20px] mt-[10px] max-_430_:text-[20px] max-_380_:text-[16px] text-[#333333]">
              Tell us about your relationship goals and preferences
            </p>
          </div>

          <div className="mt-[20px] w-[100%] space-y-8">
            {/* Relationship Goals */}
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 gap-4">
                {availableGoals.map((goal) => (
                  <div key={goal} className="flex">
                    <button
                      type="button"
                      onClick={() => handleGoalToggle(goal)}
                      className={`flex items-center justify-between w-full p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                        relationshipGoals.includes(goal)
                          ? "bg-gradient-to-r from-[#1F5799] to-[#1A4A87] text-white border-[#C89A3D] shadow-lg"
                          : "bg-white text-[#333333] border-gray-300 hover:border-[#C89A3D] shadow-sm"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          relationshipGoals.includes(goal)
                            ? "border-white bg-transparent"
                            : "border-gray-400 bg-gray-100"
                        }`}>
                          {relationshipGoals.includes(goal) && (
                            <div className="w-3 h-3 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="text-xl font-medium">{goal}</span>
                      </div>
                      {relationshipGoals.includes(goal) && (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
              
              {relationshipGoals.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
                  <p className="text-[#333333] font-medium">
                    Selected: <span className="font-semibold text-[#1F5799]">{relationshipGoals.join(", ")}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Important Note */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-[#C89A3D] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-[#333333] font-medium">Important Note</p>
                  <p className="text-[#333333] text-sm mt-1">
                    Your preferences will help us match you with compatible members. 
                    You can update these settings anytime in your profile.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button
            style={{ background: "#1F5799",borderRadius:"999px" }}
            onClick={SubmitHandler}
            className="btn btn-w-md nextstep mt-[20px] w-full py-3 rounded-full hover:bg-[#1A4A87] transition-colors shadow-md hover:shadow-lg"
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

export default WhatLookingFor;

/* jshint ignore:end */