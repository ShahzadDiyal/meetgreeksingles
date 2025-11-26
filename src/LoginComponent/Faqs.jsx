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
                      <h2 className="text-2xl font-bold mb-6 text-center">🇬🇧 Frequently Asked Questions (FAQs)</h2>
                      
                      <div className="space-y-2">
                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 Who can join Meet Greek Singles?</h3>
                          <p className="text-gray-700">
                            Meet Greek Singles is open to all Greek singles and Philhellenes—people who admire Greek culture and sincerely wish to connect with Greeks. We welcome members from all over the world.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 What are Philhellenes?</h3>
                          <p className="text-gray-700">
                            Philhellenes are non-Greeks who love and respect Greek culture, values, and people. They may have lived in Greece, studied the language, or simply feel a deep connection to the country and its people. We screen all Philhellene profiles to ensure they join with serious and respectful intentions.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 Is it free to join?</h3>
                          <p className="text-gray-700">
                            Yes! It's free to create an account, browse, and build your profile. To message other members and access full features, you'll need a Premium Membership.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 How much is the Premium Membership?</h3>
                          <p className="text-gray-700">
                            Our Founding Member Offer is just €60 for 6 months. This includes full access to messaging, profile viewing, audio/video chat, and more.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 Are there fake profiles or bots?</h3>
                          <p className="text-gray-700">
                            No. All profiles are reviewed and monitored. We are committed to keeping this platform 100% real, private, and respectful.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 How do I stay safe on the platform?</h3>
                          <p className="text-gray-700">
                            We recommend keeping your personal information private until trust is established. Please report any suspicious behavior to our support team.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 Can I cancel my subscription?</h3>
                          <p className="text-gray-700">
                            Yes, you can cancel at any time. However, we do not offer partial refunds once a subscription is active.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 Will there be in-person events?</h3>
                          <p className="text-gray-700">
                            Yes! As our community grows, we will organize meetups, local events, and trips to Greece for our members.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 What languages does the site support?</h3>
                          <p className="text-gray-700">
                            We support both English and Greek. You can write your profile in either or both!
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 How can I contact you?</h3>
                          <p className="text-gray-700">
                            Email us anytime at <a href="mailto:info@meetgreeksingles.com" className="text-blue-600 hover:underline">info@meetgreeksingles.com</a>. We are here to help and respond personally to every message.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Greek Section */}
                  {selectedLanguage === "gr" && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-6 text-center">🇬🇷 Συχνές Ερωτήσεις (FAQs)</h2>
                      
                      <div className="space-y-6">
                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 Ποιοι μπορούν να γίνουν μέλη του Meet Greek Singles;</h3>
                          <p className="text-gray-700">
                            Το Meet Greek Singles απευθύνεται σε Έλληνες και Φιλέλληνες — άτομα που αγαπούν τον ελληνικό πολιτισμό και θέλουν να συνδεθούν με Έλληνες. Δεχόμαστε μέλη από όλο τον κόσμο.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 Ποιοι θεωρούνται Φιλέλληνες;</h3>
                          <p className="text-gray-700">
                            Φιλέλληνες είναι μη Έλληνες που αγαπούν και σέβονται τον ελληνικό πολιτισμό, τις αξίες και τους ανθρώπους. Μπορεί να έχουν ζήσει στην Ελλάδα, να έχουν σπουδάσει τη γλώσσα ή απλώς να αισθάνονται βαθιά σύνδεση με τη χώρα. Όλοι οι Φιλέλληνες περνούν από έλεγχο πριν γίνουν δεκτοί στην πλατφόρμα.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 Είναι δωρεάν η εγγραφή;</h3>
                          <p className="text-gray-700">
                            Ναι! Η δημιουργία λογαριασμού, η περιήγηση και η συμπλήρωση του προφίλ είναι δωρεάν. Για να στείλεις μηνύματα και να έχεις πλήρη πρόσβαση, χρειάζεται Premium Συνδρομή.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 Πόσο κοστίζει η Premium Συνδρομή;</h3>
                          <p className="text-gray-700">
                            Η Ιδρυτική Προσφορά είναι €60 για 6 μήνες και περιλαμβάνει απεριόριστη πρόσβαση σε μηνύματα, προφίλ, βίντεο/ήχο και πολλά άλλα.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 Υπάρχουν ψεύτικα προφίλ;</h3>
                          <p className="text-gray-700">
                            Όχι. Όλα τα προφίλ ελέγχονται και παρακολουθούνται. Η πλατφόρμα μας είναι 100% αυθεντική, ασφαλής και με σεβασμό προς τα μέλη της.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 Πώς μπορώ να παραμείνω ασφαλής στην πλατφόρμα;</h3>
                          <p className="text-gray-700">
                            Μην μοιράζεσαι προσωπικές πληροφορίες μέχρι να αποκτήσεις εμπιστοσύνη. Αν δεις ύποπτη συμπεριφορά, ενημέρωσέ μας αμέσως.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 Μπορώ να ακυρώσω τη συνδρομή μου;</h3>
                          <p className="text-gray-700">
                            Ναι, μπορείς να ακυρώσεις ανά πάσα στιγμή. Ωστόσο, δεν παρέχονται επιστροφές χρημάτων μόλις ενεργοποιηθεί η συνδρομή.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 Θα υπάρχουν δια ζώσης εκδηλώσεις;</h3>
                          <p className="text-gray-700">
                            Ναι! Καθώς η κοινότητα μεγαλώνει, θα οργανώνουμε συναντήσεις, τοπικές εκδηλώσεις και ομαδικά ταξίδια στην Ελλάδα.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 Ποιες γλώσσες υποστηρίζει η πλατφόρμα;</h3>
                          <p className="text-gray-700">
                            Υποστηρίζουμε Αγγλικά και Ελληνικά. Μπορείς να γράψεις το προφίλ σου στη μία ή και στις δύο γλώσσες.
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 Πώς μπορώ να επικοινωνήσω μαζί σας;</h3>
                          <p className="text-gray-700">
                            Μπορείς να μας στείλεις email στο <a href="mailto:support@meetgreeksingles.com" className="text-blue-600 hover:underline">support@meetgreeksingles.com</a>. Απαντάμε προσωπικά σε κάθε μήνυμα.
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