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
import { Link } from "react-router-dom";
import logo from "../images/logos/meet-greek.png";
import { useTranslation } from "react-i18next";
// import Aries from "../images/zodiac/aries.png";
// import Taurus from "../images/zodiac/taurus.png";
// import Gemini from "../images/zodiac/gemini.png";
// import Cancer from "../images/zodiac/cancer.png";
// import Leo from "../images/zodiac/leo.png";
// import Virgo from "../images/zodiac/virgo.png";
// import Libra from "../images/zodiac/libra.png";
// import Scorpio from "../images/zodiac/scorpion.png";
// import Sagittarius from "../images/zodiac/sagittarius.png";
// import Capricorn from "../images/zodiac/capricorn.png";
// import Aquarius from "../images/zodiac/aquarius.png";
// import Pisces from "../images/zodiac/pisces.png";

const Register = () => {
  const { t } = useTranslation();

  const [Email, setemail] = useState("");
  const [Phone, setPhone] = useState("0123456789");
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
  // const [City, setCity] = useState("");
  const [Cities, setCities] = useState([]);
  const [Agreed, setAgreed] = useState(false);
  const [EligibilityConfirmation, setEligibilityConfirmation] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  // const [Zodiac, setZodiac] = useState("");
  const [open, setOpen] = useState(false);
  const [isGreece, setIsGreece] = useState(false);

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

  // const zodiacSigns = [
  //   { name: "Aries", icon: Aries, range: "March 21 - April 20" },
  //   { name: "Taurus", icon: Taurus, range: "April 21 - May 20" },
  //   { name: "Gemini", icon: Gemini, range: "May 21 - June 20" },
  //   { name: "Cancer", icon: Cancer, range: "June 21 - July 22" },
  //   { name: "Leo", icon: Leo, range: "July 23 - August 22" },
  //   { name: "Virgo", icon: Virgo, range: "August 23 - September 22" },
  //   { name: "Libra", icon: Libra, range: "September 23 - October 22" },
  //   { name: "Scorpio", icon: Scorpio, range: "October 23 - November 21" },
  //   {
  //     name: "Sagittarius",
  //     icon: Sagittarius,
  //     range: "November 22 - December 21",
  //   },
  //   // { name: "Capricorn", icon: Capricorn, range: "December 22 - January 19" },
  //   // { name: "Aquarius", icon: Aquarius, range: "January 20 - February 18" },
  //   // { name: "Pisces", icon: Pisces, range: "February 19 - March 20" },
  // ];

  const GREECE_REGIONS = [
    { id: "54455", name: "Attica (Athens area)" },
    { id: "54456", name: "Northern Greece (Thessaloniki & North)" },
    { id: "54457", name: "Central Greece" },
    { id: "54458", name: "Peloponnese" },
    { id: "54459", name: "Crete" },
    { id: "544510", name: "Cyclades (Mykonos, Naxos, Paros, Santorini)" },
    { id: "544511", name: "Dodecanese (Rhodes, Kos, Patmos)" },
    { id: "544512", name: "Ionian Islands (Corfu, Zakynthos, Kefalonia)" },
    { id: "544513", name: "North Aegean Islands (Lesvos, Chios, Samos)" },
    { id: "544514", name: "Saronic Islands (Aegina, Hydra, Poros, Spetses)" },
    { id: "544515", name: "Other area in Greece" },
  ];

  useEffect(() => {
    if (accepted) {
      axios
        .get("https://meetgreek.dhsol.net/location_api.php")
        .then((res) => {
          setCountries(res.data.countries);
        })
        .catch((err) => {
          console.error("Error fetching countries:", err);
          showTost({ title: t("Failed to load countries") });
        });
    }
  }, [accepted]);

  useEffect(() => {
    if (!Country) {
      setStates([]);
      setCities([]);
      setState("");
      // setCity("");
      return;
    }
    setLoadingStates(true);
    axios
      .get(`https://meetgreek.dhsol.net/location_api.php?country_id=${Country}`)
      .then((res) => {
        setStates(res.data.states || []);
        setState("");
        setCities([]);
        // setCity("");
      })
      .catch((err) => {
        console.error("Error fetching states:", err);
        showTost({ title: t("Failed to load states") });
      })
      .finally(() => setLoadingStates(false));
  }, [Country]);

  useEffect(() => {
    if (!State) {
      setCities([]);
      // setCity("");
      return;
    }
    setLoadingCities(true);
    axios
      .get(`https://meetgreek.dhsol.net/location_api.php?state_id=${State}`)
      .then((res) => {
        setCities(res.data.cities || []);
        // setCity("");
      })
      .catch((err) => {
        console.error("Error fetching cities:", err);
        showTost({ title: t("Failed to load cities") });
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

  useEffect(() => {
    if (Country && Countries.length > 0) {
      const selectedCountry = Countries.find((c) => c.id == Country);
      setIsGreece(selectedCountry?.name === "Greece");
    } else {
      setIsGreece(false);
    }
  }, [Country, Countries]);

  const SubmitHandler = async () => {
    // Prevent multiple clicks
    if (isRegistering) return;

    // Basic validations
    // if (!Phone?.trim()) return showTost({ title: t("Please Enter Phone Number") });
    if (!Email?.trim()) return showTost({ title: t("Please Enter Email") });
    if (!Password?.trim()) return showTost({ title: t("Please Enter Password") });
    if (Password.length < 8)
      return showTost({ title: t("Password must be at least 8 characters") });
    if (!Gender) return showTost({ title: t("Please select your gender") });
    // if (!GreekStatus)
    //   return showTost({ title: t("Please select your Greek status") });
    if (!BirthDay || !BirthMonth || !BirthYear)
      return showTost({ title: t("Please select your birthdate") });
    // if (!Zodiac) return showTost({ title: t("Please select your Zodiac Sign") });
    if (!Country) return showTost({ title: t("Please select your country") });
    if (!State) return showTost({ title: t("Please select your state") });
    // if (!City) return showTost({ title: t("Please select your city") });
    if (!Agreed)
      return showTost({ title: t("Please agree to Terms & Conditions") });
    if (!EligibilityConfirmation)
      return showTost({ title: t("Please agree to Eligibility Confirmation") });

    // Email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(Email)) return showTost({ title: t("Invalid Email") });

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
    if (age < 18) return showTost({ title: t("You must be 18 years or older") });

    // Set loading state
    setIsRegistering(true);

    try {
      // Format birthdate to YYYY-MM-DD
      const formattedBirthdate = `${BirthYear}-${String(
        months.indexOf(BirthMonth) + 1
      ).padStart(2, "0")}-${String(BirthDay).padStart(2, "0")}`;

      // Get country name from selected country ID
      const selectedCountry = Countries.find((c) => c.id == Country);

      let selectedState;
      let stateIdToSend;
      let stateNameToSend;

      if (isGreece) {
        const selectedRegion = GREECE_REGIONS.find(
          (region) => region.id === State
        );
        selectedState = selectedRegion;
        stateIdToSend = State;
        stateNameToSend = selectedRegion ? selectedRegion.name : "";
      } else {
        const selectedState = States.find((s) => s.id == State);
        stateIdToSend = State;
        stateNameToSend = selectedState ? selectedState?.name : "";
      }
      // const selectedCity = Cities.find((c) => c.id == City);

      // Prepare FormData with exact fields you need
      const formData = new FormData();

      // REQUIRED FIELDS as per your specification:
      formData.append("gender", Gender);
      // formData.append("origin", GreekStatus);
      formData.append("country", selectedCountry ? selectedCountry.name : "");
      formData.append("state", stateNameToSend);
      // formData.append("city", selectedCity ? selectedCity.name : "");
      formData.append("country_id", Country);
      formData.append("state_id", stateIdToSend);
      // formData.append("city_id", City);
      formData.append("bday", formattedBirthdate);
      // formData.append("zodiac_sign", Zodiac);
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
          title: response.data.ResponseMsg || t("Registration successful!"),
        });

        setUserId(response.data.User?.id);
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
            t("Registration failed. Please try again."),
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      showTost({ title: t("Network error. Please try again.") });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleAccept = () => setAccepted(true);
  const handleDecline = () => {
    showTost({ title: t("You must accept the terms to register.") });
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

              <h1 className="text-2xl md:text-3xl font-extrabold text-[#222222] mb-3 leading-tight">
                {t("Welcome to Meet Greek Singles!")}
              </h1>

              <p className="text-md md:text-[16px] text-[#222222] mb-6 max-w-xl">
                {t("We're delighted to have you here.")} <br />
                {t("Find love, friendship & Greek connection — wherever you are.")}
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-[#222222] mb-4 border-b-4 border-[#222222] pb-2">
                {t("To Join Our Community:")}
              </h2>

              <ul className="text-[18px] text-start text-gray-700 mb-5 space-y-3 max-w-xl">
                <li className="flex items-center gap-3">
                  <AiOutlineCheckCircle className="text-[#222222] w-6 h-6 flex-shrink-0" />
                  <p className="leading-snug">
                    {t("You must be")} <strong>{t("18 years or older")}</strong> {t("to join.")}
                  </p>
                </li>
                <li className="flex items-center gap-3">
                  <AiOutlineCheckCircle className="text-[#222222] w-6 h-6 flex-shrink-0" />
                  <p className="leading-snug">
                    {t("This site is strictly for single, separated, divorced, or widowed individuals, seeking meaningful connections with Greek-origin singles.")}
                  </p>
                </li>
                <li className="flex items-center gap-3">
                  <AiOutlineCloseCircle className="text-[#C95B5B] w-6 h-6 flex-shrink-0" />
                  <p className="leading-snug">
                    <strong>{t("Married individuals")}</strong> {t("are not permitted.")}
                  </p>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button
                  onClick={handleAccept}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#0066CC] text-white font-semibold rounded-full hover:bg-[#0055aa] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <AiOutlineCheckCircle /> {t("Accept")}
                </button>
                <button
                  onClick={handleDecline}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-full hover:bg-gray-400 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <AiOutlineCloseCircle /> {t("Decline")}
                </button>
              </div>
            </div>
          )}

          {accepted && (
            <>
              <div>
                <div className="flex justify-center items-center">
                  <img src={logo} alt="" width={100} height={100} />
                </div>
                <h1 className="text-[28px] max-_430_:text-[27px] font-[600] text-[#222222] text-center">
                  {t("Your Story Begins Here😎")}
                </h1>
                <p className="text-[20px] mt-[10px] max-_430_:text-[20px] max-_380_:text-[16px] text-[#333333] font-normal text-center mb-3">
                  {t("Create your free account and begin your journey toward meaningful Greek connections")}
                </p>
                <h2 className="text-start text-gray-600 mt-2">
                  {t("Your information is always confidential.")}
                </h2>
              </div>

              <div className="mt-[20px] w-[100%] space-y-6">
                {/* <div className="bg-white border-2 border-gray-300 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <label className="block font-medium text-gray-700">
                    {t("I am: *")}
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer rounded-lg transition-colors duration-150">
                      <input
                        type="radio"
                        name="greekStatus"
                        value="Greek"
                        checked={GreekStatus === "Greek"}
                        onChange={(e) => setGreekStatus(e.target.value)}
                        className="w-5 h-5 "
                      />
                      <span className="text-gray-700 font-medium">{t("Greek")}</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer rounded-lg transition-colors duration-150">
                      <input
                        type="radio"
                        name="greekStatus"
                        value="Of Greek origin"
                        checked={GreekStatus === "Of Greek origin"}
                        onChange={(e) => setGreekStatus(e.target.value)}
                        className="w-5 h-5 "
                      />
                      <span className="text-gray-700 font-medium">
                        {t("Of Greek origin")}
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer rounded-lg transition-colors duration-150">
                      <input
                        type="radio"
                        name="greekStatus"
                        value="Philhellene"
                        checked={GreekStatus === "Philhellene"}
                        onChange={(e) => setGreekStatus(e.target.value)}
                        className="w-5 h-5 "
                      />
                      <span className="text-gray-700 font-medium">
                        {t("Philhellene")}
                      </span>
                    </label>
                  </div>
                </div> */}

                {/* Email */}
                <div className="relative">
                  <label htmlFor="" className="font-semibold">
                    {t("Email")}
                  </label>
                  <p>{t("We will never share your email with anyone.")}</p>
                  <input
                    onChange={(e) => setemail(e.target.value)}
                    value={Email}
                    className="text-black w-[100%] border-2 outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 bg-white px-[15px] py-[15px] rounded-xl shadow-sm transition-all duration-200"
                    type="email"
                    placeholder={t("Email *")}
                  />
                  {Email && (
                    <VscVerifiedFilled className="w-[25px] h-[25px] absolute bottom-[12px] right-5 text-green-500" />
                  )}
                </div>

                {/* Phone Number */}
                {/* <div className="relative">
                  <label htmlFor="" className="font-semibold">
                    {t("Phone Number")}
                  </label>
                  <p>{t("Used only for verification — never shared or displayed.")}</p>
                  <input
                    onChange={(e) => setPhone(e.target.value)}
                    value={Phone}
                    className="text-black w-[100%] border-2 outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 bg-white px-[15px] py-[15px] rounded-xl shadow-sm transition-all duration-200"
                    type="number"
                    placeholder={t("Phone Number *")}
                  />
                  {Phone && (
                    <VscVerifiedFilled className="w-[25px] h-[25px] absolute bottom-[12px] right-5 text-green-500" />
                  )}
                </div> */}

                {/* Password */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {t("Password *")}
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    {t("Minimum 8 characters.")}
                  </p>
                  <div className="relative">
                    <input
                      onChange={(e) => setpassword(e.target.value)}
                      value={Password}
                      id="input"
                      className="text-black w-[100%] border-2 items-center outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 bg-white px-[15px] py-[15px] rounded-xl shadow-sm transition-all duration-200"
                      type="password"
                      placeholder={t("Create a password")}
                    />
                    <button
                      onClick={myFunction}
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <img
                        ref={Show}
                        alt="Show"
                        src={ShowPassword}
                        className="w-5 h-5 hidden"
                      />
                      <img
                        ref={Hide}
                        alt="Hide"
                        src={HidePassword}
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                  {Password && (
                    <p
                      className={`text-xs mt-1 ${Password.length >= 8 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {Password.length >= 8
                        ? t("✓ Password is valid")
                        : t("Password must be at least 8 characters")}
                    </p>
                  )}
                </div>

                {/* Birthdate */}
                <div className="bg-white border-2 border-gray-300 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <label className="block font-medium text-gray-700">
                    {t("Birthdate: *")}
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <select
                      value={BirthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      className="text-gray-700 border-2 outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 bg-white px-4 py-3 rounded-xl shadow-sm transition-all duration-200"
                    >
                      <option value="" className="text-gray-400">
                        {t("Day")}
                      </option>
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <select
                      value={BirthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="text-gray-700 border-2 outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 bg-white px-4 py-3 rounded-xl shadow-sm transition-all duration-200"
                    >
                      <option value="" className="text-gray-400">
                        {t("Month")}
                      </option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      value={BirthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="text-gray-700 border-2 outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 bg-white px-4 py-3 rounded-xl shadow-sm transition-all duration-200"
                    >
                      <option value="" className="text-gray-400">
                        {t("Year")}
                      </option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Gender */}
                <div className="bg-white border-2 border-gray-300 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <label className="block font-medium text-gray-700">
                    {t("I am a: *")}
                  </label>
                  <div className="flex flex-row gap-[50px]">
                    <label className="flex items-center space-x-3 cursor-pointer rounded-lg py-2 transition-colors duration-150">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={Gender === "Male"}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-5 h-5 "
                      />
                      <span className="text-gray-700 font-medium">{t("Man")}</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer rounded-lg py-2 transition-colors duration-150">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={Gender === "Female"}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-5 h-5 "
                      />
                      <span className="text-gray-700 font-medium">{t("Woman")}</span>
                    </label>
                  </div>
                </div>

                {/* Zodiac */}
                {/* <div className="relative">
                  <label className="font-semibold">{t("Zodiac Sign")}</label>
                  <p className="text-gray-600">
                    {t("Many members enjoy this part of getting to know each other.")}
                  </p>

                  <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-xl
    bg-white flex items-center justify-between
    focus:border-amber-500 transition"
                  >
                    {Zodiac ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={zodiacSigns.find((z) => z.name === Zodiac)?.icon}
                          className="w-6 h-6"
                          alt=""
                        />
                        <span className="text-gray-800">{t(Zodiac)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        {t("Select your zodiac sign")}
                      </span>
                    )}
                    <span className="text-gray-400">▼</span>
                  </button>

                  {open && (
                    <ul
                      className="absolute z-50 mt-2 w-full bg-white border rounded-xl
      shadow-lg max-h-64 overflow-y-auto"
                    >
                      {zodiacSigns.map((sign) => (
                        <li
                          key={sign.name}
                          onClick={() => {
                            setZodiac(sign.name);
                            setOpen(false);
                          }}
                          className="flex items-center gap-3 px-2 py-3
          hover:bg-amber-50 cursor-pointer transition"
                        >
                          <img src={sign.icon} className="w-6 h-6" alt="" />
                          <div>
                            <p className="font-medium">
                              {t(sign.name)} ({sign.range})
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div> */}

                {/* Country */}
                <div>
                  <label htmlFor="" className="font-semibold">
                    {t("I live in:")}
                  </label>
                  <p>{t("Country")}</p>
                  <select
                    value={Country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="text-gray-700 w-[100%] border-2 outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 bg-white px-[15px] py-[15px] rounded-xl shadow-sm transition-all duration-200"
                  >
                    <option value="" className="text-gray-400">
                      {t("Select Country *")}
                    </option>
                    {Countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {t(country.name)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div>
                  <label htmlFor="">{t("State / Region")}</label>
                  <p>
                    {t("Choose the region you live in. Not sure? Select the closest area.")}
                  </p>
                  <select
                    value={State}
                    onChange={(e) => setState(e.target.value)}
                    disabled={!Country || loadingStates}
                    className="text-gray-700 w-[100%] border-2 outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 bg-white px-[15px] py-[15px] rounded-xl shadow-sm transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <option value="" className="text-gray-400">
                      {loadingStates ? t("Loading states...") : t("Select State *")}
                    </option>
                    {(isGreece ? GREECE_REGIONS : States).map((state) => (
                      <option key={state.id} value={state.id}>
                        {t(state.name)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                {/* <select
                  value={City}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!State || loadingCities}
                  className="text-gray-700 w-[100%] border-2 outline-none focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] border-gray-300 bg-white px-[15px] py-[15px] rounded-xl shadow-sm transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="" className="text-gray-400">
                    {loadingCities ? t("Loading cities...") : t("Select City *")}
                  </option>
                  {Cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {t(city.name)}
                    </option>
                  ))}
                </select> */}

                {/* Terms Agreement */}
                <div className="bg-white rounded-xl p-1 ">
                  <label className="flex items-start space-x-4 cursor-pointer  rounded-lg transition-colors duration-150">
                    <input
                      type="checkbox"
                      checked={EligibilityConfirmation}
                      onChange={(e) =>
                        setEligibilityConfirmation(e.target.checked)
                      }
                      className="mt-1 w-5 h-5 "
                      id="agreement"
                    />
                    <span className="text-gray-700 leading-relaxed">
                      {t("I confirm that I am at least 18 years old and that I am single, separated, divorced, or widowed. I understand that married individuals are not allowed to join. *")}
                    </span>
                  </label>
                </div>

                {/* Terms Agreement */}
                <div className="bg-white rounded-xl p-1 ">
                  <label className="flex items-start space-x-4 cursor-pointer  rounded-lg transition-colors duration-150">
                    <input
                      type="checkbox"
                      checked={Agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-5 h-5 "
                      id="agreement"
                    />
                    <span className="text-gray-700 leading-relaxed">
                      {t("I agree to the")}{" "}
                      <Link
                        to="/page/terms_&_conditions"
                        className="text-amber-600 hover:text-amber-700 underline font-medium transition-colors duration-150"
                      >
                        {t("Terms & Conditions")}
                      </Link>{" "}
                      ,{" "}
                      <Link
                        to="/page/privacy_policy_"
                        className="text-amber-600 hover:text-amber-700 underline font-medium transition-colors duration-150"
                      >
                        {t("Privacy Policy")}
                      </Link>{" "}
                      {t("and")}{" "}
                      <Link
                        to="/page/cookie_policy_"
                        className="text-amber-600 hover:text-amber-700 underline font-medium transition-colors duration-150"
                      >
                        {t("Cookie Policy")}
                      </Link>
                    </span>
                  </label>
                </div>
              </div>

              {/* Create Account Button */}
              <button
                style={{
                  background: isRegistering ? "#70859cff" : "#1F5799",
                  borderRadius: "999px",
                }}
                onClick={SubmitHandler}
                disabled={isRegistering}
                className="btn btn-w-md nextstep mt-[20px] w-full py-3 rounded-full transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-[10px]">
                  {isRegistering ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-[#333333]"
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
                      <span className="font-bold text-[1.25rem] text-black">
                        {t("Creating Account...")}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-[1.25rem] text-white ">
                        {t("Create Account")}
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
                  <p>{t("Please wait while we create your account...")}</p>
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