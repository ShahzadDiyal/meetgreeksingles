/* jshint esversion: 6 */
/* jshint ignore:start */

import { useContext, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import ShowPassword from "../Icon/eye.svg";
import HidePassword from "../Icon/eye-slash.svg";
import { VscVerifiedFilled } from "react-icons/vsc";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../Context/MyProvider";
import axios from "axios";
import { showTost } from "../showTost";

const Register = () => {
  const [Bio, setbio] = useState();
  const [Name, setname] = useState();
  const [Email, setemail] = useState();
  const [Password, setpassword] = useState();
  const [accepted, setAccepted] = useState(false); // track if user accepted message
  const Show = useRef();
  const Hide = useRef();
  const { setName, setEmail, setPassword, setBio, basUrl } =
    useContext(MyContext);

  const navigation = useNavigate();

  const myFunction = () => {
    var x = document.getElementById("input");
    if (x.type === "password") {
      x.type = "text";
      Show.current.style.display = "block";
      Hide.current.style.display = "none";
    } else {
      x.type = "password";
      Hide.current.style.display = "block";
      Show.current.style.display = "none";
    }
  };

  const SubmitHandler = () => {
    if (!Name.trim()) return showTost({ title: "Please Enter Name" });
    if (!Email.trim()) return showTost({ title: "Please Enter Email" });
    if (!Password.trim()) return showTost({ title: "Please Enter Password" });

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(Email)) return showTost({ title: "Invalid Email" });

    axios
      .post(`${basUrl}email_check.php`, { email: Email })
      .then((res) => {
        if (res.data.Result === "true") {
          setName(Name);
          setEmail(Email);
          setPassword(Password);
          setBio(Bio);
          navigation("/phonenumber");
        } else {
          showTost({ title: res.data.ResponseMsg });
        }
      })
      .catch(() => showTost({ title: "Network error" }));
  };

  const handleAccept = () => setAccepted(true);
  const handleDecline = () => {
    showTost({ title: "You must accept the terms to register." });
    // optional: redirect user back to home page
    navigation("/");
  };

  return (
    <div className="w-[100%] multisteup-wrapper pt-[20px] Test">
      <div className="container mx-auto">
        <section className="steps step-1 active rounded-[40px] relative">
          {/* ----- Progress Bar ----- */}
          <div className="w-[100%] bg-[#EFEDEE] pt-[30px] z-[999] pb-[20px] fixed top-[0px]">
            <div className="bg-white w-[83%] h-[5px] mx-auto rounded-full">
              <div className="bg-[#0066CC] rounded-full w-[9%] h-[5px]"></div>
            </div>
          </div>

          {!accepted && (
            <div className="flex flex-col items-center justify-center pl-6  text-center">
              <img src="/favicon.ico" width={150} alt="" />
              <h2 className="text-[30px] font-[700] text-[#0066CC] mb-3">
                Welcome to Meet Greek Singles!
              </h2>
             <ul className="text-[18px] text-start text-gray-700 mb-5 space-y-3">
  <li className="flex items-center gap-2">
    <AiOutlineCheckCircle className="text-[#0066CC] w-[20px] h-[20px] flex-shrink-0" />
    <p>
      You must be <strong>18 years or older</strong> to join.
    </p>
  </li>
  <li className="flex  gap-2">
    <AiOutlineCheckCircle className="text-[#0066CC] w-[20px] h-[20px] flex-shrink-0" />
    <p>
      This site is strictly for single, separated, divorced, or widowed individuals, seeking meaningful connections with Greek-origin singles.
    </p>
  </li>
  <li className="flex items-center gap-2">
    <AiOutlineCloseCircle className="text-red-700 w-[20px] h-[20px] flex-shrink-0" />
    <p>
      <strong>Married individuals</strong> are not permitted.
    </p>
  </li>
</ul>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                  onClick={handleAccept}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0066CC] text-white font-semibold rounded-lg hover:bg-[#0055aa] transition"
                >
                  <AiOutlineCheckCircle /> Accept
                </button>
                <button
                  onClick={handleDecline}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition"
                >
                  <AiOutlineCloseCircle /> Decline
                </button>
              </div>
            </div>
          )}

          {/* ----- Registration Form ----- */}
          {accepted && (
            <>
              <div className="mt-[80px]">
                <h1 className="text-[28px] max-_430_:text-[27px] font-[600]">
                  Can You elaborate on your identity? 😎
                </h1>
                <p className="text-[20px] mt-[10px] max-_430_:text-[20px] max-_380_:text-[16px]">
                  It will Display on your Profile and you will not able to
                  change it later
                </p>
              </div>

              <div className="mt-[20px] w-[100%]">
                <div className="relative">
                  <input
                    onChange={(e) => setname(e.target.value)}
                    className="text-black w-[100%] border-[2px] outline-[#0066CC] border-gray-300 px-[20px] py-[15px] rounded-[10px]"
                    type="text"
                    placeholder="First Name"
                  />
                  {Name && (
                    <VscVerifiedFilled className="w-[25px] h-[25px] absolute bottom-[12px] right-5" />
                  )}
                </div>

                <div className="relative">
                  <input
                    onChange={(e) => setemail(e.target.value)}
                    className="text-black mt-[10px] w-[100%] border-[2px] outline-[#0066CC;] border-gray-300 px-[15px] py-[15px] rounded-[10px]"
                    type="email"
                    placeholder="Email"
                  />
                  {Email && (
                    <VscVerifiedFilled className="w-[25px] h-[25px] absolute bottom-[12px] right-5" />
                  )}
                </div>

                <div className="relative">
                  <input
                    onChange={(e) => setpassword(e.target.value)}
                    id="input"
                    className="text-black mt-[10px] w-[100%] border-[2px] outline-[#0066CC] border-gray-300 px-[15px] py-[15px] rounded-[10px]"
                    type="text"
                    placeholder="Password"
                  />
                  <button onClick={myFunction}>
                    <img
                      ref={Show}
                      alt="Show"
                      src={ShowPassword}
                      className="w-[25px] h-[25px] absolute bottom-[17px] right-5"
                    />
                    <img
                      ref={Hide}
                      alt="Hide"
                      src={HidePassword}
                      className="w-[25px] h-[25px] hidden absolute bottom-[17px] right-5"
                    />
                  </button>
                </div>

                <input
                  className="text-black mt-[10px] w-[100%] border-[2px] outline-[#0066CC;] border-gray-300 px-[15px] py-[15px] rounded-[10px]"
                  type="text"
                  placeholder="Referral Code"
                />

                <input
                  onChange={(e) => setbio(e.target.value)}
                  className="text-black mt-[10px] w-[100%] border-[2px] outline-[#0066CC;] border-gray-300 px-[15px] py-[15px] rounded-[10px]"
                  type="text"
                  placeholder="Bio"
                />
              </div>

              <button
                style={{ background: "#0066CC" }}
                onClick={SubmitHandler}
                className="btn btn-w-md nextstep mt-[50px]"
              >
                <div className="flex items-center justify-center gap-[10px]">
                  <span className="font-bold text-[1.25rem] text-white">
                    Next
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
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Register;

/* jshint ignore:end */
