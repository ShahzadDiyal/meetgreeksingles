/* jshint esversion: 6 */
/* jshint ignore:start */
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../Context/MyProvider";
import axios from "axios";
import { Formik } from "formik";
import { TodoContext } from "../Context";
import { showTost } from "../showTost";

const Imagecom = () => {
  const { demo, setDemo } = useContext(TodoContext);
  const { 
    name, email, password, bio, number, ccode, birthdate, gender, 
    goal, nearby, country, state, city, hobbies, languages, religion, 
    preference, basUrl, longitude, latitude, setLatitude, setLongitude 
  } = useContext(MyContext);
  const navigate = useNavigate();

  const inp1 = useRef();
  const inp2 = useRef();
  const inp3 = useRef();
  const inp4 = useRef();
  const inp5 = useRef();
  const inp6 = useRef();

  const [input1, setInput1] = useState();
  const [input2, setInput2] = useState();
  const [input3, setInput3] = useState();
  const [input4, setInput4] = useState();
  const [input5, setInput5] = useState();
  const [input6, setInput6] = useState();
  const [Error, seterror] = useState(0);

  const [selectedImages, setSelectedImages] = useState({
    pic0: null,
    pic1: null,
    pic2: null,
    pic3: null,
    pic4: null,
    pic5: null
  });

  const ImageHandler = (id) => {
    if (id === "1") {
      inp1.current.click();
    } else if (id === "2") {
      inp2.current.click();
    } else if (id === "3") {
      inp3.current.click();
    } else if (id === "4") {
      inp4.current.click();
    } else if (id === "5") {
      inp5.current.click();
    } else if (id === "6") {
      inp6.current.click();
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(String(position.coords.latitude));
      setLongitude(String(position.coords.longitude));
    });
  }, []);

  // Count how many images have been selected
  useEffect(() => {
    const count = Object.values(selectedImages).filter(img => img !== null).length;
    seterror(count);
  }, [selectedImages]);

  const handleFileSelect = (id, file) => {
    if (!file) return;
    
    const newSelectedImages = { ...selectedImages };
    if (id === "1") {
      setInput1(file);
      newSelectedImages.pic0 = file;
    } else if (id === "2") {
      setInput2(file);
      newSelectedImages.pic3 = file;
    } else if (id === "3") {
      setInput3(file);
      newSelectedImages.pic4 = file;
    } else if (id === "4") {
      setInput4(file);
      newSelectedImages.pic1 = file;
    } else if (id === "5") {
      setInput5(file);
      newSelectedImages.pic2 = file;
    } else if (id === "6") {
      setInput6(file);
      newSelectedImages.pic5 = file;
    }
    setSelectedImages(newSelectedImages);
  };

  const SubmitHandler = () => {
    // Check if at least 3 images are selected
    const selectedCount = Object.values(selectedImages).filter(img => img !== null).length;
    
    if (selectedCount >= 3) {
      // Store images in context or localStorage to use on next page
      const imagesData = {
        images: selectedImages,
        imageCount: selectedCount
      };
      
      // You can store in localStorage or context
      localStorage.setItem('selectedProfileImages', JSON.stringify(imagesData));
      
      // Redirect to the next page
      navigate("/about"); // Change this to your desired route
    } else {
      showTost({ title: "Please Select Minimum 3 Images" });
    }
  };

  return (
    <div>
      <div className="w-[100%] multisteup-wrapper pt-[20px]">
        <div className="container mx-auto">
          <section className="steps step-1 active rounded-[40px] relative">
            <div className="w-[100%] bg-[#EFEDEE]  pt-[30px] z-[999]  pb-[20px] fixed top-[0px] ">
              <div className="bg-white w-[83%] h-[5px] mx-auto rounded-full">
                <div className="bg-[#0066CC]  rounded-full w-[95%] h-[5px] "></div>
              </div>
            </div>
            <div className="mt-[10px]">
              <h1 className="text-[28px] max-_430_:text-[27px] font-[600] max-_430_:w-[260px]">
                Show your best self 📸
              </h1>
              <p className="text-[20px] mt-[10px] max-_430_:text-[16px]">
                Upload a clear photo to help others get to know you<br /> video to make
                a fantastic first impression. <br />
                Let your personality shine.
              </p>
              <p className="text-[16px] mt-[5px] text-gray-600 font-medium">
                Minimum 3 images required
              </p>
            </div>

            <div className="mt-[20px] w-[100%]">
              <div>
                <div className="flex">
                  <div className="w-[65%] relative ">
                    <button
                      type="button"
                      onClick={() => ImageHandler("1")}
                      className={`w-[100%] border-[2px] ${input1 ? "" : "border-[#0066CC]"
                        } h-[210px] max-_430_:h-[170px] p-0 m-0 overflow-hidden rounded-tl-[15px] text-[30px] flex items-center justify-center`}
                    >
                      <input
                        ref={inp1}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          handleFileSelect("1", file);
                        }}
                      />
                      {input1 ? (
                        <img
                          src={URL.createObjectURL(input1)}
                          className="w-full h-full p-0 m-0 object-cover"
                          alt="Uploaded"
                        />
                      ) : (
                        <div className="text-4xl text-gray-400">+</div>
                      )}
                    </button>
                    <div className="flex">
                      <button
                        type="button"
                        disabled={!input3}
                        onClick={() => ImageHandler("2")}
                        className={`w-[100%] ${input2
                          ? "border-gray-300"
                          : input3
                            ? "border-[#0066CC]"
                            : ""
                          } border-[2px] h-[105px] max-_430_:h-[85px] overflow-hidden rounded-bl-[15px] flex items-center justify-center`}
                      >
                        <input
                          ref={inp2}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            handleFileSelect("2", file);
                          }}
                        />
                        {input2 ? (
                          <img
                            src={URL.createObjectURL(input2)}
                            className="w-full h-full object-cover"
                            alt="Uploaded"
                          />
                        ) : (
                          input3 && <div className="text-2xl text-gray-400">+</div>
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={!input6}
                        onClick={() => ImageHandler("3")}
                        className={`w-[100%] ${input3
                          ? "border-gray-300"
                          : input6
                            ? "border-[#0066CC]"
                            : ""
                          } border-[2px] h-[105px] max-_430_:h-[85px] flex items-center justify-center`}
                      >
                        <input
                          ref={inp3}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            handleFileSelect("3", file);
                          }}
                        />
                        {input3 ? (
                          <img
                            src={URL.createObjectURL(input3)}
                            className="w-full h-full object-cover"
                            alt="Uploaded"
                          />
                        ) : (
                          input6 && <div className="text-2xl text-gray-400">+</div>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="w-[35%]">
                    <button
                      type="button"
                      disabled={!input1}
                      onClick={() => ImageHandler("4")}
                      className={`w-[100%] border-[2px] ${input4
                        ? "border-gray-300"
                        : input1
                          ? "border-[#0066CC]"
                          : ""
                        } rounded-tr-[15px] overflow-hidden h-[105px] max-_430_:h-[85px] flex items-center justify-center`}
                    >
                      <input
                        ref={inp4}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          handleFileSelect("4", file);
                        }}
                      />
                      {input4 ? (
                        <img
                          src={URL.createObjectURL(input4)}
                          className="w-full h-full p-0 m-0 object-cover"
                          alt="Uploaded"
                        />
                      ) : (
                        input1 && <div className="text-2xl text-gray-400">+</div>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={!input4}
                      onClick={() => ImageHandler("5")}
                      className={`w-[100%] ${input5
                        ? "border-gray-300"
                        : input4
                          ? "border-[#0066CC]"
                          : ""
                        } border-[2px] h-[105px] max-_430_:h-[85px] flex items-center justify-center`}
                    >
                      <input
                        ref={inp5}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          handleFileSelect("5", file);
                        }}
                      />
                      {input5 ? (
                        <img
                          src={URL.createObjectURL(input5)}
                          className="w-full h-full p-0 m-0 object-cover"
                          alt="Uploaded"
                        />
                      ) : (
                        input4 && <div className="text-2xl text-gray-400">+</div>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={!input5}
                      onClick={() => ImageHandler("6")}
                      className={`w-[100%] ${input6
                        ? "border-gray-300"
                        : input5
                          ? "border-[#0066CC]"
                          : ""
                        } border-[2px] h-[105px] max-_430_:h-[85px] rounded-br-[15px] flex items-center overflow-hidden justify-center`}
                    >
                      <input
                        ref={inp6}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          handleFileSelect("6", file);
                        }}
                      />
                      {input6 ? (
                        <img
                          src={URL.createObjectURL(input6)}
                          className="w-full h-full object-cover"
                          alt="Uploaded"
                        />
                      ) : (
                        input5 && <div className="text-2xl text-gray-400">+</div>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Selected Images Counter */}
                <div className="mt-4 text-center">
                  <p className="text-gray-700">
                    Selected: <span className="font-bold">{Error}</span> / 6 images
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {Error >= 3 ? "✓ Minimum requirement met!" : "Select at least 3 more images"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                style={{ background: "#0066CC" }}
                onClick={SubmitHandler}
                className="btn btn-w-md nextstep mt-[50px] w-full"
                disabled={Error < 3}
              >
                <div className="flex items-center justify-center gap-[10px]">
                  <span className="font-bold text-[1.25rem] text-white">
                    Continue to Next Step
                  </span>
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
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Imagecom;
/* jshint ignore:end */