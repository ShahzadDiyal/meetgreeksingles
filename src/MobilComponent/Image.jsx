/* jshint esversion: 6 */
/* jshint ignore:start */
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../Context/MyProvider";
import { showTost } from "../showTost";
import logo from "../images/logos/meet-greek.png";
import { useTranslation } from "react-i18next";


const Imagecom = () => {
  const {t} = useTranslation();
  const {
    setLatitude,
    setLongitude,
    profileImages,
    setProfileImages,
    setImageCount,
    registrationStep,
    setRegistrationStep,
  } = useContext(MyContext);

  const navigate = useNavigate();

  const inp1 = useRef();
  const inp2 = useRef();
  const inp3 = useRef();
  const inp4 = useRef();
  const inp5 = useRef();
  const inp6 = useRef();

  const [input1, setInput1] = useState(profileImages.pic0 || null);
  const [input2, setInput2] = useState(profileImages.pic1 || null);
  const [input3, setInput3] = useState(profileImages.pic2 || null);
  const [input4, setInput4] = useState(profileImages.pic3 || null);
  const [input5, setInput5] = useState(profileImages.pic4 || null);
  const [input6, setInput6] = useState(profileImages.pic5 || null);

  const [selectedImages, setSelectedImages] = useState(profileImages);
  const [selectedCount, setSelectedCount] = useState(0);

  const isButtonEnabled = (buttonId) => {
    if (buttonId === "1") return true;
    if (buttonId === "2") return !!input1;
    if (buttonId === "3") return !!input2;
    if (buttonId === "4") return !!input3;
    if (buttonId === "5") return !!input4;
    if (buttonId === "6") return !!input5;

    return false;
  };

  const ImageHandler = (id) => {
    if (!isButtonEnabled(id)) return;

    if (id === "1") inp1.current.click();
    else if (id === "2") inp2.current.click();
    else if (id === "3") inp3.current.click();
    else if (id === "4") inp4.current.click();
    else if (id === "5") inp5.current.click();
    else if (id === "6") inp6.current.click();
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(String(position.coords.latitude));
      setLongitude(String(position.coords.longitude));
    });
  }, []);

  useEffect(() => {
    const count = Object.values(selectedImages).filter(
      (img) => img !== null
    ).length;
    setSelectedCount(count);
    if (setImageCount) {
      setImageCount(count);
    }
  }, [selectedImages]);

  const handleFileSelect = (id, file) => {
    if (!file) return;

    const newSelectedImages = { ...selectedImages };

    if (id === "1") {
      setInput1(file);
      newSelectedImages.pic0 = file;
    } else if (id === "2") {
      setInput2(file);
      newSelectedImages.pic1 = file;
    } else if (id === "3") {
      setInput3(file);
      newSelectedImages.pic2 = file;
    } else if (id === "4") {
      setInput4(file);
      newSelectedImages.pic3 = file;
    } else if (id === "5") {
      setInput5(file);
      newSelectedImages.pic4 = file;
    } else if (id === "6") {
      setInput6(file);
      newSelectedImages.pic5 = file;
    }

    setSelectedImages(newSelectedImages);
    setProfileImages(newSelectedImages);
  };

  const SubmitHandler = () => {
    if (selectedCount >= 3) {
      setRegistrationStep(registrationStep + 1);
      navigate("/info");
      showTost({ title: "Images saved successfully!" });
    } else {
      showTost({ title: "Please Select Minimum 3 Images" });
    }
  };

  return (
    <div>
      <div className="w-[100%] multisteup-wrapper pt-[20px]">
        <div className="container mx-auto">
          <section className="steps step-1 active rounded-[40px] relative">
            <div className="w-[100%] bg-[#EFEDEE] pt-[30px] z-[999] pb-[20px] fixed top-[0px]">
              <div className="bg-white w-[83%] h-[5px] mx-auto rounded-full">
                <div className="bg-[#0066CC] rounded-full w-[9%] h-[5px]"></div>
              </div>
            </div>
            <div className="mt-[10px] flex items-start gap-3">
              <img
                src={logo}
                alt=""
                width={60}
                height={60}
                className="mt-1 flex-shrink-0"
              />
              <div className="flex-1">
                <h1 className="text-[28px] max-_430_:text-[27px] font-[600] max-_430_:w-[260px]">
                  {t("title")} {/* Updated */}
                </h1>
                <p className="text-[20px] mt-[10px] max-_430_:text-[16px]">
                  {t("description")} {/* Updated */}
                </p>
              </div>
            </div>

            <div className="mt-[20px] w-[100%]">
              <div>
                <div className="flex">
                  <div className="w-[65%] relative">
                    <button
                      type="button"
                      onClick={() => ImageHandler("1")}
                      className={`w-[100%] border-[2px] ${
                        input1 ? "" : "border-[#C89A3D]"
                      } h-[210px] max-_430_:h-[170px] p-0 m-0 overflow-hidden rounded-tl-[15px] text-[30px] flex items-center justify-center`}
                    >
                      <input
                        ref={inp1}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileSelect("1", e.target.files[0])
                        }
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
                        onClick={() => ImageHandler("2")}
                        disabled={!isButtonEnabled("2")}
                        className={`w-[100%] border-[2px] ${
                          input2
                            ? "border-gray-300"
                            : isButtonEnabled("2")
                            ? "border-[#C89A3D]"
                            : "border-gray-200 opacity-50"
                        } h-[105px] max-_430_:h-[85px] overflow-hidden rounded-bl-[15px] flex items-center justify-center`}
                      >
                        <input
                          ref={inp2}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileSelect("2", e.target.files[0])
                          }
                        />
                        {input2 ? (
                          <img
                            src={URL.createObjectURL(input2)}
                            className="w-full h-full object-cover"
                            alt="Uploaded"
                          />
                        ) : (
                          <div
                            className={`text-2xl ${
                              isButtonEnabled("2")
                                ? "text-gray-400"
                                : "text-gray-300"
                            }`}
                          >
                            +
                          </div>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => ImageHandler("3")}
                        disabled={!isButtonEnabled("3")}
                        className={`w-[100%] border-[2px] ${
                          input3
                            ? "border-gray-300"
                            : isButtonEnabled("3")
                            ? "border-[#C89A3D]"
                            : "border-gray-200 opacity-50"
                        } h-[105px] max-_430_:h-[85px] flex items-center justify-center`}
                      >
                        <input
                          ref={inp3}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileSelect("3", e.target.files[0])
                          }
                        />
                        {input3 ? (
                          <img
                            src={URL.createObjectURL(input3)}
                            className="w-full h-full object-cover"
                            alt="Uploaded"
                          />
                        ) : (
                          <div
                            className={`text-2xl ${
                              isButtonEnabled("3")
                                ? "text-gray-400"
                                : "text-gray-300"
                            }`}
                          >
                            +
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="w-[35%]">
                    <button
                      type="button"
                      onClick={() => ImageHandler("4")}
                      disabled={!isButtonEnabled("4")}
                      className={`w-[100%] border-[2px] ${
                        input4
                          ? "border-gray-300"
                          : isButtonEnabled("4")
                          ? "border-[#C89A3D]"
                          : "border-gray-200 opacity-50"
                      } rounded-tr-[15px] overflow-hidden h-[105px] max-_430_:h-[85px] flex items-center justify-center`}
                    >
                      <input
                        ref={inp4}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileSelect("4", e.target.files[0])
                        }
                      />
                      {input4 ? (
                        <img
                          src={URL.createObjectURL(input4)}
                          className="w-full h-full p-0 m-0 object-cover"
                          alt="Uploaded"
                        />
                      ) : (
                        <div
                          className={`text-2xl ${
                            isButtonEnabled("4")
                              ? "text-gray-400"
                              : "text-gray-300"
                          }`}
                        >
                          +
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => ImageHandler("5")}
                      disabled={!isButtonEnabled("5")}
                      className={`w-[100%] border-[2px] ${
                        input5
                          ? "border-gray-300"
                          : isButtonEnabled("5")
                          ? "border-[#C89A3D]"
                          : "border-gray-200 opacity-50"
                      } h-[105px] max-_430_:h-[85px] flex items-center justify-center`}
                    >
                      <input
                        ref={inp5}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileSelect("5", e.target.files[0])
                        }
                      />
                      {input5 ? (
                        <img
                          src={URL.createObjectURL(input5)}
                          className="w-full h-full p-0 m-0 object-cover"
                          alt="Uploaded"
                        />
                      ) : (
                        <div
                          className={`text-2xl ${
                            isButtonEnabled("5")
                              ? "text-gray-400"
                              : "text-gray-300"
                          }`}
                        >
                          +
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => ImageHandler("6")}
                      disabled={!isButtonEnabled("6")}
                      className={`w-[100%] border-[2px] ${
                        input6
                          ? "border-gray-300"
                          : isButtonEnabled("6")
                          ? "border-[#C89A3D]"
                          : "border-gray-200 opacity-50"
                      } h-[105px] max-_430_:h-[85px] rounded-br-[15px] flex items-center overflow-hidden justify-center`}
                    >
                      <input
                        ref={inp6}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileSelect("6", e.target.files[0])
                        }
                      />
                      {input6 ? (
                        <img
                          src={URL.createObjectURL(input6)}
                          className="w-full h-full object-cover"
                          alt="Uploaded"
                        />
                      ) : (
                        <div
                          className={`text-2xl ${
                            isButtonEnabled("6")
                              ? "text-gray-400"
                              : "text-gray-300"
                          }`}
                        >
                          +
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-gray-700">
                    {t("selectedCount")} {/* Updated */}
                    <span className="font-bold">{selectedCount}</span>{" "}
                    {t("of")} 6 {t("images")} {/* Updated */}
                    {selectedCount >= 3 && " ✓"}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      selectedCount >= 3 ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {selectedCount >= 3
                      ? t("minimumMet") // Updated
                      : t("selectMore", {
                          count: 3 - selectedCount,
                        })}{" "}
                    {/* Updated */}
                  </p>
                </div>
              </div>

              <button
                type="button"
                style={{
                  background: selectedCount >= 3 ? "#0066CC" : "#CCCCCC",
                  borderRadius: "999px",
                  cursor: selectedCount >= 3 ? "pointer" : "not-allowed",
                }}
                onClick={SubmitHandler}
                className="btn btn-w-md nextstep mt-[50px] w-full py-3 rounded-full transition-all duration-300"
                disabled={selectedCount < 3}
              >
                <div className="flex items-center justify-center gap-[10px]">
                  <span className="font-bold text-[1.25rem] text-white rounded-xl">
                    {selectedCount >= 3
                      ? t("continueButton") // Updated
                      : t("selectMoreButton")}{" "}
                    {/* Updated */}
                  </span>
                  {selectedCount >= 3 && (
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
                  )}
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
