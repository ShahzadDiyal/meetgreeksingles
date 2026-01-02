/* jshint esversion: 6 */
/* jshint ignore:start */
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../Context/MyProvider";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Terms_Conditions = () => {
  const { t } = useTranslation();
  const { basUrl, user } = useContext(MyContext);  
  const Perams = useParams();
  const Title = Perams.title?.replaceAll("_", " ");
  const [list, setList] = useState([]);
  const [formData, setFormData] = useState({
    language: "English",
    fullName: user?.name || "", 
    email: user?.email || "",
    subject: "",
    message: "",
    agree: false,
  });

  const ApiHandler = () => {
    axios.post(`${basUrl}pagelist.php`).then((res) => {
      setList(res.data.pagelist);
    });
  };

  useEffect(() => {
    ApiHandler();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agree) {
      alert("Please agree to the terms.");
      return;
    }

    try {
      const payload = {
        uid: user?.id || 0,  
        name: formData.fullName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      const response = await axios.post(
        "https://meetgreek.dhsol.net/api/contactus.php",
        payload
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        alert("Your message has been sent successfully!");
        setFormData({
          language: "English",
          fullName: user?.name || "",
          email: user?.email || "",
          subject: "",
          message: "",
          agree: false,
        });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Error submitting form. Please try again later.");
    }
  };

return (
  <div>
    <div className="main-wrapper-2 dashboard -mt-[80px]">
      <div
        className={`content-body bg-[#F7F5F2] ${
          Title === "contact us" && "min-h-[100vh]"
        }`}
      >
        <div className="mt-[90px]">
          {list.map((item, index) => {
            if (item.title.toLowerCase() === Title) {
              return (
                <div key={index}>
                  {Title === "contact us" && (
                    <div className="bg-white mx-[20px] p-[30px] my-[30px] rounded-[15px] shadow-sm">
                      <div className="max-w-2xl mx-auto my-3">
                        <h2 className="text-[40px] text-center font-semibold mb-2 text-[#222222]">
                          Contact Us
                        </h2>
                        <p className="text-2xl text-[#333333] text-center mb-2">
                          We'd love to hear from you!
                        </p>
                        <p className="text-[#333333] text-center mb-8">
                          If you have a question, suggestion, or need support
                          feel free to reach out. Our team replies to every
                          message personally.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-2">
                            <label className="flex items-center justify-center cursor-pointer">
                              <img src="/favicona.ico" width={20} alt="" />
                              <span className="text-[#333333] text-center font-semibold ml-2">
                                Languages: English & Greek
                              </span>
                            </label>
                          </div>

                          <div className="space-y-2">
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-[#333333] focus:outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] transition-all duration-200"
                              placeholder="Full name"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-[#333333] focus:outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] transition-all duration-200"
                              placeholder="Email"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <input
                              type="text"
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-[#333333] focus:outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] transition-all duration-200"
                              placeholder="Subject"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              rows="6"
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-[#333333] focus:outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] transition-all duration-200"
                              placeholder="Your message"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-start space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                name="agree"
                                checked={formData.agree}
                                onChange={handleInputChange}
                                className="w-5 h-5 mt-1 text-[#1F5799] bg-white border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#C89A3D] focus:ring-offset-2"
                                required
                              />
                              <span className="text-[#333333]">
                                I agree that my data may be used to respond to
                                my inquiry.
                              </span>
                            </label>
                          </div>

                          <button
                            type="submit"
                            className="text-xl w-full bg-[#1F5799] text-white py-3 px-4 rounded-full hover:bg-[#1A4A87] focus:outline-none focus:ring-2 focus:ring-[#C89A3D] focus:ring-offset-2 transition duration-200 font-bold shadow-sm"
                          >
                            Send Message
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>

    {list.length === 0 && (
      <div className="w-[100%] h-[100vh] ms-[8rem] max-_991_:ms-0 bg-white fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 z-[555]">
        <div>
          <h2 className="text-[#222222]">{t("Loading...")}</h2>
        </div>
      </div>
    )}
  </div>
);
};

export default Terms_Conditions;
/* jshint ignore:end */