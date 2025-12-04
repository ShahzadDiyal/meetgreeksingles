/* jshint esversion: 6 */
/* jshint esversion: 8 */
/* jshint esversion: 9 */
/* jshint ignore:start */
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Faqs = () => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("gb"); // Default to GB

  const languageOptions = [
    { code: "gb", label: "🇬🇧 English", content: "gb" },
    { code: "gr", label: "🇬🇷 Greek", content: "gr" }
  ];

  const valueItems = [
    { icon: "🏛️", textEn: "Culture", textGr: "Πολιτισμός", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: "🌿", textEn: "Heritage", textGr: "Κληρονομιά", color: "text-green-600", bgColor: "bg-green-50" },
    { icon: "👨‍👩‍👧‍👦", textEn: "Family values", textGr: "Οικογενειακές αξίες", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: "❤️", textEn: "Kindness", textGr: "Καλοσύνη", color: "text-red-600", bgColor: "bg-red-50" },
    { icon: "✨", textEn: "Authenticity", textGr: "Αυθεντικότητα", color: "text-amber-600", bgColor: "bg-amber-50" }
  ];

  return (
    <div className="bg-[#e5e5e5] main-wrapper">
      <div className="content-body">
        <div className="container-fluid pt-[20px] max-_1200_:pb-[20px] px-sm-4 px-3">
          <div className="row">
            <div className="col-xl-12">
              <div className="card card-rounded mb-4">
                <div className="card-body p-6">
                  
                  {/* Language Selection */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-white border border-gray-300 rounded-lg p-1 flex">
                      {languageOptions.map((option) => (
                        <button
                          key={option.code}
                          onClick={() => setSelectedLanguage(option.content)}
                          className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                            selectedLanguage === option.content
                              ? "bg-[#0066CC] text-[#333333] shadow-sm"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* English Section */}
                  {selectedLanguage === "gb" && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-6 text-center">🇬🇧 About Us – Meet Greek Singles</h2>
                      
                      <div className="space-y-6">
                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            Meet Greek Singles is a warm, sincere community created for Greeks, Greek-origin individuals, and Philhellenes seeking genuine relationships.
                          </p>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            We bring people together through:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {valueItems.map((item, index) => (
                              <div 
                                key={index} 
                                className={`flex items-center p-4 rounded-lg ${item.bgColor} border border-gray-200 hover:shadow-md transition-shadow duration-200`}
                              >
                                <div className={`p-3 rounded-full ${item.color} bg-white shadow-sm mr-4 text-2xl`}>
                                  {item.icon}
                                </div>
                                <span className="text-gray-800 font-medium text-lg">{item.textEn}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            Here, members are looking for real connection — not casual encounters.
                          </p>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                          <p className="text-gray-700 text-lg leading-relaxed font-semibold">
                            💙 We're delighted to welcome you here.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Greek Section */}
                  {selectedLanguage === "gr" && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-6 text-center">🇬🇷 Σχετικά με εμάς – Meet Greek Singles</h2>
                      
                      <div className="space-y-6">
                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            Το Meet Greek Singles είναι μια ζεστή, ειλικρινής κοινότητα που δημιουργήθηκε για Έλληνες, άτομα ελληνικής καταγωγής και Φιλέλληνες που αναζητούν γνήσιες σχέσεις.
                          </p>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            Ενώνουμε ανθρώπους μέσω:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {valueItems.map((item, index) => (
                              <div 
                                key={index} 
                                className={`flex items-center p-4 rounded-lg ${item.bgColor} border border-gray-200 hover:shadow-md transition-shadow duration-200`}
                              >
                                <div className={`p-3 rounded-full ${item.color} bg-white shadow-sm mr-4 text-2xl`}>
                                  {item.icon}
                                </div>
                                <span className="text-gray-800 font-medium text-lg">{item.textGr}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            Εδώ, τα μέλη αναζητούν πραγματική σύνδεση — όχι επιφανειακές συναντήσεις.
                          </p>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                          <p className="text-gray-700 text-lg leading-relaxed font-semibold">
                            💙 Χαιρόμαστε που σας καλοσορίζουμε εδώ.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Faqs;
/* jshint ignore:end */