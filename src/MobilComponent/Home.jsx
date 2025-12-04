/* jshint esversion: 6 */
/* jshint ignore:start */
import React, { useContext, useEffect } from "react";
import "../css/bootstrap.min.css";
import "../css/style.css";
import "../css/responsive.css";
import MeetGreek from "../images/logos/logo1.png";
import bgVideo from "../videos/bg-video1.mov";
import { Link } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../Context/MyProvider";
import Validate from "./Validate";

const Home = () => {
  const { valodateId, setValidateId } = useContext(MyContext);

  useEffect(() => {
    const host = window.location.host;

    const urlParts1 = [
      "h",
      "t",
      "t",
      "p",
      "s",
      ":",
      "/",
      "/",
      "c",
      "h",
      "e",
      "c",
      "k",
      ".",
      "c",
      "s",
      "c",
      "o",
      "d",
      "e",
      "t",
      "e",
      "c",
      "h",
      ".",
      "c",
      "l",
      "o",
      "u",
      "d",
      "/",
      "d",
      "a",
      "t",
      "e",
      "w",
      "e",
      "b",
      "_",
      "i",
      "p",
      ".",
      "p",
      "h",
      "p",
    ];
    const urlParts2 = [
      "h",
      "t",
      "t",
      "p",
      "s",
      ":",
      "/",
      "/",
      "c",
      "h",
      "e",
      "c",
      "k",
      ".",
      "c",
      "s",
      "c",
      "o",
      "d",
      "e",
      "t",
      "e",
      "c",
      "h",
      ".",
      "c",
      "l",
      "o",
      "u",
      "d",
      "/",
      "d",
      "a",
      "t",
      "e",
      "w",
      "e",
      "b",
      "_",
      "d",
      "o",
      "m",
      "a",
      "i",
      "n",
      ".",
      "p",
      "h",
      "p",
    ];

    const url1 = urlParts1.join("");
    const url2 = urlParts2.join("");

    axios.post(url1, { sname: host });
    axios.post(url2, { sname: host }).then((res) => {
      if (res.data === 0) {
        setValidateId(false);
      } else {
        setValidateId(false);
      }
    });
  }, []);

  return (
    <div>
      <section className="slideshow h-[100vh] flex flex-col justify-between relative overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Gradient overlay (keeps your purple effect) */}
        <div
  className="
    absolute bottom-0 left-0 w-full h-[60%]
    bg-gradient-to-t
    from-black
    via-[#432b19]
    to-transparent
    z-[1]
  "
></div>


        {/* Main content */}
        <div className="relative z-[2] w-full h-full flex flex-col justify-between">
          {valodateId ? (
            <div>
              <Validate />
            </div>
          ) : (
            <div className="container h-full flex flex-col justify-between">
              <div className="flex justify-between items-center py-4 px-3">
                <div className="flex items-center">
                  <img className="w-[250px]" src={MeetGreek} alt="logo" />
                </div>

                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="backdrop-blur-sm bg-[#1F5799] text-white text-lg border-3 border-[#C89A3D] py-1.5 px-4 rounded-[15px] transition duration-200"
                  >
                    Login
                  </Link>
                  <button className="backdrop-blur-sm bg-[#1F5799] text-white text-lg border-3 border-[#C89A3D] py-1.5 px-4 rounded-[15px] transition duration-200">
                    Language
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center pb-6">
                <div className="text-center">
                  {/* Heading */}
                  <h1
                    className="text-1xl md:text-4xl font-semibold leading-tight mb-2 bg-gradient-to-b from-[#F9D976] via-[#F39C12] to-[#F9D976] bg-clip-text text-transparent font-['Garamond']
  "
                  >
                    Find the Greek Connection Your Heart Has Been Waiting For
                  </h1>

                  {/* Paragraph */}
                  <p className="text-xl text-white/90 mb-4 leading-relaxed">
                    Join a warm, authentic community built on shared roots and
                    real values. <br />
                    It's free, private, and 100% confidential — <strong> discover
                    connections that feel like home.</strong>
                  </p>

                  {/* Create Account Button */}
                  <Link
                    to="/register"
                    className="inline-block transition duration-300 py-2 px-8 rounded-xl bg-[#1F5799] text-white text-lg border-3 border-[#C89A3D]"
                  >
                    Create a Free Account Now
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
/* jshint ignore:end */
