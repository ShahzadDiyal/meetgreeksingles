/* jshint esversion: 6 */
/* jshint ignore:start */

import { useContext, useRef, useState, useEffect } from "react";
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
  const [Email, setemail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Password, setpassword] = useState("");
  const [Gender, setGender] = useState("");
  const [GreekStatus, setGreekStatus] = useState("");
  const [BirthDay, setBirthDay] = useState("");
  const [BirthMonth, setBirthMonth] = useState("");
  const [BirthYear, setBirthYear] = useState("");
  const [Country, setCountry] = useState("");
  const [Countries, setCountries] = useState([]);
  const [State, setState] = useState("");
  const [States, setStates] = useState([]);
  const [City, setCity] = useState("");
  const [Cities, setCities] = useState([]);
  const [Agreed, setAgreed] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Registration loading state
  const [isRegistering, setIsRegistering] = useState(false);

  const Show = useRef();
  const Hide = useRef();

  const { basUrl, setUserId } = useContext(MyContext);

  const navigation = useNavigate();

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (accepted) {
      axios
        .get("https://meetgreek.dhsol.net/location_api.php")
        .then((res) => {
          setCountries(res.data.countries);
        })
        .catch((err) => {
          console.error("Error fetching countries:", err);
          showTost({ title: "Failed to load countries" });
        });
    }
  }, [accepted]);

  useEffect(() => {
    if (!Country) {
      setStates([]);
      setCities([]);
      setState("");
      setCity("");
      return;
    }
    setLoadingStates(true);
    axios
      .get(`https://meetgreek.dhsol.net/location_api.php?country_id=${Country}`)
      .then((res) => {
        setStates(res.data.states || []);
        setState(""); 
        setCities([]); 
        setCity(""); 
      })
      .catch((err) => {
        console.error("Error fetching states:", err);
        showTost({ title: "Failed to load states" });
      })
      .finally(() => setLoadingStates(false));
  }, [Country]);

  useEffect(() => {
    if (!State) {
      setCities([]);
      setCity("");
      return;
    }
    setLoadingCities(true);
    axios
      .get(`https://meetgreek.dhsol.net/location_api.php?state_id=${State}`)
      .then((res) => {
        setCities(res.data.cities || []);
        setCity(""); 
      })
      .catch((err) => {
        console.error("Error fetching cities:", err);
        showTost({ title: "Failed to load cities" });
      })
      .finally(() => setLoadingCities(false));
  }, [State]);

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

  const SubmitHandler = async () => {
    // Prevent multiple clicks
    if (isRegistering) return;

    // Basic validations
    if (!Phone?.trim()) return showTost({ title: "Please Enter Phone Number" });
    if (!Email?.trim()) return showTost({ title: "Please Enter Email" });
    if (!Password?.trim()) return showTost({ title: "Please Enter Password" });
    if (Password.length < 8)
      return showTost({ title: "Password must be at least 8 characters" });
    if (!Gender) return showTost({ title: "Please select your gender" });
    if (!GreekStatus)
      return showTost({ title: "Please select your Greek status" });
    if (!BirthDay || !BirthMonth || !BirthYear)
      return showTost({ title: "Please select your birthdate" });
    if (!Country) return showTost({ title: "Please select your country" });
    if (!State) return showTost({ title: "Please select your state" });
    if (!City) return showTost({ title: "Please select your city" });
    if (!Agreed)
      return showTost({ title: "Please agree to Terms & Conditions" });

    // Email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(Email)) return showTost({ title: "Invalid Email" });

    // Age validation (must be 18+)
    const birthDate = new Date(BirthYear, months.indexOf(BirthMonth), BirthDay);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    if (age < 18) return showTost({ title: "You must be 18 years or older" });

    // Set loading state
    setIsRegistering(true);

    try {
      // Format birthdate to YYYY-MM-DD
      const formattedBirthdate = `${BirthYear}-${String(
        months.indexOf(BirthMonth) + 1
      ).padStart(2, "0")}-${String(BirthDay).padStart(2, "0")}`;

      // Get country name from selected country ID
      const selectedCountry = Countries.find((c) => c.id == Country);
      const selectedState = States.find((s) => s.id == State);
      const selectedCity = Cities.find((c) => c.id == City);

      // Prepare FormData with exact fields you need
      const formData = new FormData();

      // REQUIRED FIELDS as per your specification:
      formData.append("gender", Gender);
      formData.append("origin", GreekStatus); 
      formData.append("country", selectedCountry ? selectedCountry.name : "");
      formData.append("state", selectedState ? selectedState.name : "");
      formData.append("city", selectedCity ? selectedCity.name : "");
      formData.append("country_id", Country);
      formData.append("state_id", State);
      formData.append("city_id", City);
      formData.append("bday", formattedBirthdate);
      formData.append("mobile", Phone);
      formData.append("email", Email);
      formData.append("password", Password);

      // For debugging: Log what's being sent
      console.log("Sending registration data:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      // Send registration request to backend
      const response = await axios.post(`${basUrl}reg_user.php`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Registration response:", response.data);

      if (response.data.Result === "true") {
        // Registration successful
        showTost({
          title: response.data.ResponseMsg || "Registration successful!",
        });
        
          setUserId(response.data.User?.id)
          localStorage.setItem("UserId", response.data.User?.id);

        // Store user data if returned
        // if (response.data.User?.id) {
        // }

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        // Navigate to next step
        navigation("/image");
      } else {
        // Registration failed
        showTost({
          title:
            response.data.ResponseMsg ||
            "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      showTost({ title: "Network error. Please try again." });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleAccept = () => setAccepted(true);
  const handleDecline = () => {
    showTost({ title: "You must accept the terms to register." });
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
            <div className="flex flex-col items-center justify-center pl-6 text-center">
              <img src="/favicon.ico" width={150} alt="Logo" className="mb-4" />

              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0066CC] mb-3 leading-tight">
                Welcome to Meet Greek Singles!
              </h1>

              <p className="text-md md:text-[16px] text-gray-700 mb-6 max-w-xl">
                We're delighted to have you here. <br />
                Find love, friendship & Greek connection — wherever you are.
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-[#C89A3D] mb-4 border-b-4 border-[#C89A3D] pb-2">
                To Join Our Community:
              </h2>

              <ul className="text-[18px] text-start text-gray-700 mb-5 space-y-3 max-w-xl">
                <li className="flex items-center gap-3">
                  <AiOutlineCheckCircle className="text-[#0066CC] w-6 h-6 flex-shrink-0" />
                  <p className="leading-snug">
                    You must be <strong>18 years or older</strong> to join.
                  </p>
                </li>
                <li className="flex items-center gap-3">
                  <AiOutlineCheckCircle className="text-[#0066CC] w-6 h-6 flex-shrink-0" />
                  <p className="leading-snug">
                    This site is strictly for single, separated, divorced, or
                    widowed individuals, seeking meaningful connections with
                    Greek-origin singles.
                  </p>
                </li>
                <li className="flex items-center gap-3">
                  <AiOutlineCloseCircle className="text-red-700 w-6 h-6 flex-shrink-0" />
                  <p className="leading-snug">
                    <strong>Married individuals</strong> are not permitted.
                  </p>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button
                  onClick={handleAccept}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#0066CC] text-white font-semibold rounded-lg hover:bg-[#0055aa] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <AiOutlineCheckCircle /> Accept
                </button>
                <button
                  onClick={handleDecline}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <AiOutlineCloseCircle /> Decline
                </button>
              </div>
            </div>
          )}

          {accepted && (
            <>
              <div className="mt-[10px]">
                <h1 className="text-[28px] max-_430_:text-[27px] font-[600]">
                  Can You elaborate on your identity? 😎
                </h1>
                <p className="text-[20px] mt-[10px] max-_430_:text-[20px] max-_380_:text-[16px]">
                  It will Display on your Profile and you will not able to
                  change it later
                </p>
              </div>

              <div className="mt-[20px] w-[100%] space-y-3">
                {/* Phone Number */}
                <div className="relative">
                  <input
                    onChange={(e) => setPhone(e.target.value)}
                    value={Phone}
                    className="text-black w-[100%] border-[2px] outline-[#0066CC] border-gray-300 px-[15px] py-[15px] rounded-[10px]"
                    type="number"
                    placeholder="Phone Number *"
                  />
                  {Phone && (
                    <VscVerifiedFilled className="w-[25px] h-[25px] absolute bottom-[12px] right-5 text-green-500" />
                  )}
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    onChange={(e) => setemail(e.target.value)}
                    value={Email}
                    className="text-black w-[100%] border-[2px] outline-[#0066CC] border-gray-300 px-[15px] py-[15px] rounded-[10px]"
                    type="email"
                    placeholder="Email *"
                  />
                  {Email && (
                    <VscVerifiedFilled className="w-[25px] h-[25px] absolute bottom-[12px] right-5 text-green-500" />
                  )}
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    onChange={(e) => setpassword(e.target.value)}
                    value={Password}
                    id="input"
                    className="text-black w-[100%] border-[2px] outline-[#0066CC] border-gray-300 px-[15px] py-[15px] rounded-[10px]"
                    type="password"
                    placeholder="Password (min. 8 characters) *"
                  />
                  <button
                    onClick={myFunction}
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <img
                      ref={Show}
                      alt="Show"
                      src={ShowPassword}
                      className="w-[25px] h-[25px] hidden"
                    />
                    <img
                      ref={Hide}
                      alt="Hide"
                      src={HidePassword}
                      className="w-[25px] h-[25px]"
                    />
                  </button>
                </div>
                {Password && (
                  <div
                    className={`ml-2 text-sm ${
                      Password.length >= 8 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {Password.length >= 8
                      ? "✓ Password is valid"
                      : "Password must be at least 8 characters"}
                  </div>
                )}

                {/* Gender */}
                <div className="border-[2px] border-gray-300 rounded-[10px] p-4">
                  <label className="block font-medium mb-3">I am a: *</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={Gender === "Male"}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-5 h-5 text-[#0066CC]"
                      />
                      <span className="text-gray-700">Man</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={Gender === "Female"}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-5 h-5 text-[#0066CC]"
                      />
                      <span className="text-gray-700">Woman</span>
                    </label>
                  </div>
                </div>

                {/* Greek Status (origin) */}
                <div className="border-[2px] border-gray-300 rounded-[10px] p-4">
                  <label className="block font-medium mb-3">I am: *</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="greekStatus"
                        value="Greek"
                        checked={GreekStatus === "Greek"}
                        onChange={(e) => setGreekStatus(e.target.value)}
                        className="w-5 h-5 text-[#0066CC]"
                      />
                      <span className="text-gray-700">Greek</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="greekStatus"
                        value="Of Greek origin"
                        checked={GreekStatus === "Of Greek origin"}
                        onChange={(e) => setGreekStatus(e.target.value)}
                        className="w-5 h-5 text-[#0066CC]"
                      />
                      <span className="text-gray-700">Of Greek origin</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="greekStatus"
                        value="Philhellene"
                        checked={GreekStatus === "Philhellene"}
                        onChange={(e) => setGreekStatus(e.target.value)}
                        className="w-5 h-5 text-[#0066CC]"
                      />
                      <span className="text-gray-700">Philhellene</span>
                    </label>
                  </div>
                </div>

                {/* Birthdate */}
                <div className="border-[2px] border-gray-300 rounded-[10px] p-4">
                  <label className="block font-medium mb-3">Birthdate: *</label>
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={BirthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      className="text-gray-700 border-[2px] outline-[#0066CC] border-gray-300 px-3 py-3 rounded-[10px]"
                    >
                      <option value="">Day</option>
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <select
                      value={BirthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="text-gray-700 border-[2px] outline-[#0066CC] border-gray-300 px-3 py-3 rounded-[10px]"
                    >
                      <option value="">Month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      value={BirthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="text-gray-700 border-[2px] outline-[#0066CC] border-gray-300 px-3 py-3 rounded-[10px]"
                    >
                      <option value="">Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Country */}
                <select
                  value={Country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="text-gray-700 w-[100%] border-[2px] outline-[#0066CC] border-gray-300 px-[15px] py-[15px] rounded-[10px]"
                >
                  <option value="">Select Country *</option>
                  {Countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>

                {/* State */}
                <select
                  value={State}
                  onChange={(e) => setState(e.target.value)}
                  disabled={!Country || loadingStates}
                  className="text-gray-700 w-[100%] border-[2px] outline-[#0066CC] border-gray-300 px-[15px] py-[15px] rounded-[10px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingStates ? "Loading states..." : "Select State *"}
                  </option>
                  {States.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>

                {/* City */}
                <select
                  value={City}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!State || loadingCities}
                  className="text-gray-700 w-[100%] border-[2px] outline-[#0066CC] border-gray-300 px-[15px] py-[15px] rounded-[10px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingCities ? "Loading cities..." : "Select City *"}
                  </option>
                  {Cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>

                {/* Terms Agreement */}
                <div className="rounded-[10px] pt-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-5 h-5 text-[#0066CC]"
                      id="agreement"
                    />
                    <span className="text-gray-700">
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-[#0066CC] underline font-medium"
                      >
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-[#0066CC] underline font-medium"
                      >
                        Privacy Policy
                      </a>
                      . *
                    </span>
                  </label>
                </div>
              </div>

              {/* Create Account Button */}
              <button
                style={{ background: isRegistering ? "#999" : "#0066CC" }}
                onClick={SubmitHandler}
                disabled={isRegistering}
                className="btn btn-w-md nextstep mt-[20px] w-full py-3 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-[10px]">
                  {isRegistering ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="font-bold text-[1.25rem] text-white">
                        Creating Account...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-[1.25rem] text-white">
                        Create Account
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
                    </>
                  )}
                </div>
              </button>

              {/* Registration Progress Note */}
              {isRegistering && (
                <div className="mt-4 text-center text-gray-600 text-sm">
                  <p>Please wait while we create your account...</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Register;

/* jshint ignore:end */
