/* jshint esversion: 6 */
/* jshint ignore:start */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../Context/MyProvider";
import axios from "axios";

const LocationSelection = () => {
  const { setCountry, setState, setCity } = useContext(MyContext);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const navigation = useNavigate();

  // Fetch countries on mount
  useEffect(() => {
    axios.get("https://meetgreek.dhsol.net/location_api.php")
      .then(res => {
        setCountries(res.data.countries);
      })
      .catch(err => console.error("Error fetching countries:", err));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!selectedCountry) return;
    setLoadingStates(true);
    axios.get(`https://meetgreek.dhsol.net/location_api.php?country_id=${selectedCountry}`)
      .then(res => {
        setStates(res.data.states);
        setSelectedState(""); // reset state selection
        setCities([]);        // reset cities
        setSelectedCity("");  // reset city selection
      })
      .catch(err => console.error("Error fetching states:", err))
      .finally(() => setLoadingStates(false));
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedState) return;
    setLoadingCities(true);
    axios.get(`https://meetgreek.dhsol.net/location_api.php?state_id=${selectedState}`)
      .then(res => {
        setCities(res.data.cities);
        setSelectedCity(""); // reset city selection
      })
      .catch(err => console.error("Error fetching cities:", err))
      .finally(() => setLoadingCities(false));
  }, [selectedState]);

  const handleSubmit = () => {
    if (!selectedCountry || !selectedState || !selectedCity) {
      alert("Please select Country, State, and City.");
      return;
    }
    setCountry(selectedCountry);
    setState(selectedState);
    setCity(selectedCity);
    navigation("/nearby"); // move to next step
  };

  return (
    <div className="w-[100%] multisteup-wrapper pt-[20px] max-_430_:pt-[0px]">
      <div className="container mx-auto">
        <section className="steps step-1 active rounded-[40px] relative">
          <div className="w-[100%] bg-[#EFEDEE] pt-[30px] z-[999] pb-[20px] fixed top-[0px] ">
            <div className="bg-white w-[83%] h-[5px] mx-auto rounded-full">
              <div className="bg-[#0066CC] rounded-full w-[54%] h-[5px]"></div>
            </div>
          </div>

          {/* Title */}
          <div className="mt-[10px]">
            <h1 className="text-[28px] max-_430_:text-[27px] font-[600]">
              Select Your Location 📍
            </h1>
            <p className="text-[20px] mt-[10px] max-_430_:text-[16px]">
              Choose your country, state, and city to discover matches nearby.
            </p>
          </div>

          {/* Location dropdowns */}
          <div className="mt-[20px] w-[100%] flex flex-col">
            <div>
              <label className="text-[16px] font-semibold mb-2 mt-3 block">Country</label>
              <select
                className="w-full border-[2px] border-gray-300 rounded-[10px] px-4 py-3 outline-[#0066CC]"
                value={selectedCountry}
                onChange={e => setSelectedCountry(e.target.value)}
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[16px] font-semibold mb-2 mt-3 block">State</label>
              <select
                className="w-full border-[2px] border-gray-300 rounded-[10px] px-4 py-3 outline-[#0066CC]"
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                disabled={!selectedCountry || loadingStates}
              >
                <option value="">{loadingStates ? "Loading states..." : "Select State"}</option>
                {states.map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[16px] font-semibold mb-2 mt-3 block">City</label>
              <select
                className="w-full border-[2px] border-gray-300 rounded-[10px] px-4 py-3 outline-[#0066CC]"
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                disabled={!selectedState || loadingCities}
              >
                <option value="">{loadingCities ? "Loading cities..." : "Select City"}</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Next Button */}
          <button
            style={{ background: "#0066CC" }}
            onClick={handleSubmit}
            className="btn btn-w-md nextstep mt-[50px]"
          >
            <div className="flex items-center justify-center gap-[10px]">
              <span className="font-bold text-[1.25rem] text-white">Next</span>
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
        </section>
      </div>
    </div>
  );
};

export default LocationSelection;

/* jshint ignore:end */
