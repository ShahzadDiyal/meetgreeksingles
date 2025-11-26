/* jshint esversion: 6 */
/* jshint esversion: 8 */
/* jshint esversion: 9 */
/* jshint ignore:start */
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../Context/MyProvider";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Faqs = () => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("gb"); // Default to GB

  const languageOptions = [
    { code: "gb", label: "🇬🇧 English", content: "gb" },
    { code: "gr", label: "🇬🇷 Greek", content: "gr" }
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
                              ? "bg-[#0066CC] text-white shadow-sm"
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
                            Meet Greek Singles is so much more than a dating platform. It's a warm, authentic community for everyone who loves Greece, its people, and its timeless values.
                          </p>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            We bring together Greeks and Philhellenes from all over the world—people who appreciate culture, tradition, and meaningful human connection.
                          </p>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            Whether you were born in Greece, have Greek roots, or simply feel a deep admiration for the Greek spirit, you are welcome here.
                          </p>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            Our members aren't looking for superficial conversations.<br/>
                            They're here for genuine relationships, real companionship, and the joy of sharing life with someone who truly understands them.
                          </p>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            We offer a safe, welcoming, ad-free space, where honesty matters and cultural connections naturally flourish.
                          </p>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            And this is only the beginning.<br/>
                            As our community grows, we will introduce opportunities for in-person connections—through local meetups, cultural gatherings, and organized group trips to Greece.
                          </p>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                          <p className="text-gray-700 text-lg leading-relaxed font-semibold">
                            💙 We invite you to be part of this beautiful journey.<br/>
                            A community that's sincere, meaningful, and filled with Greek heart and soul.
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
                            Το Meet Greek Singles δεν είναι απλώς μια πλατφόρμα γνωριμιών. Είναι μια ζωντανή, αυθεντική κοινότητα για όλους όσοι αγαπούν την Ελλάδα, τον πολιτισμό της και τις ανθρώπινες αξίες που τη χαρακτηρίζουν.
                          </p>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            Ενώνουμε Έλληνες και Φιλέλληνες από κάθε γωνιά του κόσμου—ανθρώπους που εκτιμούν την παράδοση, την κουλτούρα και τις αληθινές ανθρώπινες σχέσεις.
                          </p>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            Είτε γεννήθηκες στην Ελλάδα, είτε έχεις ελληνικές ρίζες, είτε απλώς αισθάνεσαι μια βαθιά σύνδεση με το ελληνικό πνεύμα, εδώ θα βρεις τον χώρο σου.
                          </p>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            Η κοινότητά μας προσελκύει μέλη που αναζητούν κάτι περισσότερο από επιφανειακές επαφές.<br/>
                            Αναζητούν ουσιαστική επικοινωνία, συντροφικότητα και τη χαρά να μοιράζονται τη ζωή με έναν άνθρωπο που τους καταλαβαίνει πραγματικά.
                          </p>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            Προσφέρουμε έναν ασφαλή, φιλόξενο και χωρίς διαφημίσεις χώρο, όπου η ειλικρίνεια είναι πολύτιμη και η πολιτισμική σύνδεση ανθίζει φυσικά.
                          </p>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            Και αυτό είναι μόνο η αρχή.<br/>
                            Καθώς η κοινότητά μας μεγαλώνει, θα προσθέτουμε συνεχώς νέες δυνατότητες για να συναντιόμαστε και από κοντά—μέσα από τοπικές εκδηλώσεις, πολιτιστικές συναντήσεις και οργανωμένα ταξίδια στην Ελλάδα.
                          </p>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                          <p className="text-gray-700 text-lg leading-relaxed font-semibold">
                            💙 Σε προσκαλούμε να γίνεις μέρος αυτής της όμορφης πρωτοβουλίας.<br/>
                            Μια κοινότητα αληθινή, γεμάτη ουσία, φιλοξενία και ελληνική καρδιά.
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