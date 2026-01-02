/* jshint esversion: 6 */
/* jshint esversion: 8 */
/* jshint esversion: 9 */
/* jshint ignore:start */
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "./Footer";
const Faqs = () => {
  const { t, i18n } = useTranslation();

  const valueItems = [
    { icon: "🏛️", textKey: "Culture", color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: "🌿", textKey: "Heritage", color: "text-green-600", bgColor: "bg-green-50" },
    { icon: "👨‍👩‍👧‍👦", textKey: "Family values", color: "text-purple-600", bgColor: "bg-purple-50" },
    { icon: "❤️", textKey: "Kindness", color: "text-red-600", bgColor: "bg-red-50" },
    { icon: "✨", textKey: "Authenticity", color: "text-amber-600", bgColor: "bg-amber-50" }
  ];

  return (
    <div className="bg-[#e5e5e5] main-wrapper">
      <div className="content-body">
        <div className="container-fluid pt-[20px] max-_1200_:pb-[20px] px-sm-4 px-3">
          <div className="row">
            <div className="col-xl-12">
              <div className="card card-rounded mb-4">
                <div className="card-body p-6">
                  <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-6 text-center">{t('title')}</h2>
                      
                      <div className="space-y-6">
                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            {t('intro')}
                          </p>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            {t('bring_together')}
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
                                <span className="text-gray-800 font-medium text-lg">{t(item.textKey)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="px-6 py-2 rounded-lg">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            {t('real_connection')}
                          </p>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-lg mx-4">
                          <p className="text-gray-700 text-lg leading-relaxed font-semibold">
                            {t('welcome_message')}
                          </p>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
              <Footer />
    </div>
  );
};
export default Faqs;
/* jshint ignore:end */