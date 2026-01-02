/* jshint esversion: 6 */
/* jshint esversion: 8 */
/* jshint esversion: 9 */
/* jshint ignore:start */
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../Context/MyProvider";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Footer from "./Footer";

const Faqs = () => {
   const {t} = useTranslation();
 

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
                      
                      <div className="space-y-2">
                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 {t('question1')}</h3>
                          <p className="text-gray-700">
                            {t('answer1')}
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 {t('question2')}</h3>
                          <p className="text-gray-700">
                            {t('answer2')}
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 {t('question3')}</h3>
                          <p className="text-gray-700">
                            {t('answer3')}
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 {t('question4')}</h3>
                          <p className="text-gray-700">
                            {t('answer4')}
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 {t('question5')}</h3>
                          <p className="text-gray-700">
                            {t('answer5')}
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 {t('question6')}</h3>
                          <p className="text-gray-700">
                            {t('answer6')}
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 {t('question7')}</h3>
                          <p className="text-gray-700">
                            {t('answer7')}
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 {t('question8')}</h3>
                          <p className="text-gray-700">
                            {t('answer8')}
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 {t('question9')}</h3>
                          <p className="text-gray-700">
                            {t('answer9')}
                          </p>
                        </div>

                        <div className="px-4 py-1 rounded-lg">
                          <h3 className="font-semibold text-lg">🔹 {t('question10')}</h3>
                          <p className="text-gray-700">
                            {t('answer10_part1')}<a href="mailto:info@meetgreeksingles.com" className="text-blue-600 hover:underline">info@meetgreeksingles.com</a>{t('answer10_part2')}
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