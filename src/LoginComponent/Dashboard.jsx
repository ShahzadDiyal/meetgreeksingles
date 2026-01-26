/* jshint esversion: 6 */
/* jshint esversion: 8 */
/* jshint esversion: 9 */
/* jshint esversion: 11 */
/* jshint ignore:start */
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import CloseIcon from "../Icon/times.svg";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Lottie from "lottie-react";
import DisLike from "../JSON File/dislike.json";
import Like from "../JSON File/like.json";
import { MyContext } from "../Context/MyProvider";
import axios from "axios";
import Crown from "../Icon/crown-alt.png";
import { useTranslation } from "react-i18next";
import UserChat from "./UserChat";
import HeartIcon from "../Icon/heartRed.svg";
import ChatIcon from "../Icon/chat.svg";
import GiftIcon from "../Icon/gift.svg";
import { showTost } from "../showTost";
import CoinIcon from "../images/icons/buycoin-package.png";
import Slider from "react-slick";
import imag from "../images/logos/meet-greek.png";
import CookiePopup from "./CookiePopup";
import Footer from "./Footer";

const Dashboard = () => {
  const { t } = useTranslation();

  const {
    basUrl,
    setProfileId,
    imageBaseURL,
    setDetails,
    setBlockId,
    setChatId,
    chatId,
    setChatUserName,
    setCurrency,
  } = useContext(MyContext);

  const [api, setApi] = useState([]);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [preference, setPreference] = useState("");
  const [distance, setDistance] = useState("anywhere");
  const [agemin, setAgemin] = useState(18);
  const [agemax, setAgemax] = useState(100);
  const [isVisible, setIsVisible] = useState(false);
  const [giftid, setGiftId] = useState([]);
  const [interestId, setInterestId] = useState([]);
  const [language, setLanguage] = useState([]);
  const [religion, setReligion] = useState(-1);
  const [relationship, setRelationship] = useState(-1);
  const [verify, setVerify] = useState("");
  const [close, setClose] = useState([]);
  const [bg, setBg] = useState([]);
  const [gifterror, setGiftError] = useState(0);
  const [like, setLike] = useState([]);
  const [likeDn, setLikeDn] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lazyLoading, setLazyLoading] = useState(false);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [locatio, setLocation] = useState(false);
  const [iconArray, setIconArray] = useState([]);
  const [youCoin, setYouCoin] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const [giftReceiverId, setGiftreceiverId] = useState();
  const [giftImg, setGiftImg] = useState([]);
  const [interestList, setInterestList] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [religionList, setReligionList] = useState([]);
  const [relationshipList, setRelationshipList] = useState([]);
  const [filterinclude, setFilterinclude] = useState();
  const [directchat, setDirectchat] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndex2, setCurrentIndex2] = useState(0);
  const [totalCards, setTotalCards] = useState(0);
  const [greekConnection, setGreekConnection] = useState("");
  const [otherLanguage, setOtherLanguage] = useState("");
  const otherLanguageInputRef = useRef(null);

  // New state for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    verification: false,
  });

  const kilometers = Math.floor(distance / 100);
  const centimeters = distance % 100;

  const AGEMIN = Math.max(agemin, 0);
  const AGEMAX = Math.max(agemax, 0);

  const Classadd = useRef();
  const BgDisplay = useRef();

  const min = 1;
  const max = 50000;

  const percent = ((distance - min) / (max - min)) * 100;
  const percentmin = ((agemin - 0) / (100 - 0)) * 100;
  const percentmax = ((agemax - 100) / (0 - 100)) * 100;

  const sliderStyle = {
    background: `linear-gradient(to right, #0066CC ${percent}%, #0066CC ${percent}%)`,
  };

  var settings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FilterHandler = () => {
    if (open) {
      Classadd.current.classList.remove("open");
    } else {
      Classadd.current.classList.add("open");
    }
    setOpen(!open);

    if (open2) {
      BgDisplay.current.style.display = "none";
    } else {
      BgDisplay.current.style.display = "block";
    }
    setOpen2(!open2);
  };

  const toggleBottomSheet = (e) => {
    if (e === "GidtSend") {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  const GiftHandler = (id, price, img) => {
    const giftPrice = parseInt(price);

    if (giftid.includes(id)) {
      setGiftId(giftid.filter((el) => el !== id));
      setTotalPrice(totalPrice - giftPrice);
      setGiftError(gifterror - 1);
      setGiftImg(giftImg.filter((el) => el !== img));
    } else {
      if (totalPrice + giftPrice > youCoin) {
        showTost({ title: "insufficient coins in wallet" });
      } else {
        setGiftId([...giftid, id]);
        setTotalPrice(totalPrice + giftPrice);
        setGiftError(gifterror + 1);
        setGiftImg([...giftImg, img]);
      }
    }
  };

  const SednHandler = () => {
    const localData = localStorage.getItem("Register_User");

    if (localData) {
      const userData = JSON.parse(localData);
      if (!gifterror) {
        showTost({ title: "Please Select Gift" });
      } else {
        const img = giftImg.join(";");
        axios
          .post(`${basUrl}giftbuy.php`, {
            sender_id: userData.id,
            coin: totalPrice,
            receiver_id: giftReceiverId,
            gift_img: img,
          })
          .then((res) => {
            if (res.data.Result == "true") {
              setGiftId("");
              setGiftError("");
              setTotalPrice("");
              CoinHandler();
              showTost({ title: "Gift Send Successfully!!" });
              setIsVisible(false);
            }
          });
      }
    }
  };

  const InterestMapHandler = (id) => {
    if (interestId.includes(id)) {
      setInterestId(interestId.filter((el) => el !== id));
    } else {
      if (interestId.length > 4) return;
      setInterestId([...interestId, id]);
    }
  };

  const LanguageMapHandler = (id) => {
    if (language.includes(id)) {
      setLanguage(language.filter((el) => el !== id));
    } else {
      if (language.length > 4) return;
      setLanguage([...language, id]);
    }
  };

  const IdHandler = (i, index, name) => {
    const Title = name.replace(/\s+/g, "_");
    const FinalText = Title.toLowerCase();
    navigate(`/detail/${FinalText}/${index}`);
    setDetails(i);
    setBlockId(index);
    localStorage.setItem("DetailsId", index);
  };

  const CloseAnimationHandler = (Id, Name) => {
    setClose((e) => [...e, Id]);

    const localData = localStorage.getItem("Register_User");
    const userData = JSON.parse(localData);

    setTimeout(() => {
      setBg((e) => [...e, Name]);
    }, 1600);

    axios
      .post(`${basUrl}like_dislike.php`, {
        uid: userData.id,
        profile_id: Id,
        action: "UNLIKE",
      })
      .then((res) => {
        showTost({ title: res.data.ResponseMsg });
      });
  };

  const ProfileLikeHandler = (id) => {
    const Local = localStorage.getItem("Register_User");
    if (id && Local) {
      const UserData = JSON.parse(Local);

      axios
        .post(`${basUrl}like_dislike.php`, {
          uid: UserData.id,
          profile_id: id,
          action: "LIKE",
        })
        .then((res) => {
          if (res.data.Result === "true") {
            showTost({ title: res.data.ResponseMsg });
            const Page = sessionStorage.getItem("Icon-Color");

            if (Page === "Home") {
              navigate("/");
            } else {
              navigate("/explore");
            }
          }
        });
    }
  };

  const LikeAnimationHandler = (Id, Name) => {
    const localData = localStorage.getItem("Register_User");
    const userData = JSON.parse(localData);

    setLike((e) => [...e, Id]);
    setTimeout(() => {
      setLikeDn((e) => [...e, Name]);
    }, 1600);

    axios
      .post(`${basUrl}like_dislike.php`, {
        uid: userData.id,
        profile_id: Id,
        action: "LIKE",
      })
      .then((res) => {
        showTost({ title: res.data.ResponseMsg });
      });
  };

  const fetchUserData = async () => {
    const localData = localStorage.getItem("Register_User");

    if (localData) {
      const userData = JSON.parse(localData);

      const savedFilterData = localStorage.getItem("FilterData");
      if (savedFilterData) {
        FilterDataGetHandler("");
        return;
      }

      if (currentIndex < 0) {
        setLoading(true);
      } else {
        setLazyLoading(true);
      }

      try {
        const response = await axios.post(`${basUrl}home_data.php`, {
          uid: userData.id,
          lats: latitude,
          longs: longitude,
        });

        if (response.data.Result === "true") {
          if (currentIndex > 0) {
            setApi((prevCards) => [
              ...prevCards,
              ...response.data.profilelist.slice(
                currentIndex,
                currentIndex + 12
              ),
            ]);
          } else {
            setApi(response.data.profilelist.slice(0, currentIndex + 12));
          }
          setTotalCards(response.data.profilelist.length);

          const profileList = response.data.profilelist;
          const lastProfile =
            profileList?.length > 0
              ? profileList[profileList.length - 1]
              : null;
          setProfileId(lastProfile ? lastProfile.profile_id : null);

          setCurrency(response.data.currency);
          await setFilterinclude(response.data.filter_include);
          await setDirectchat(response.data.direct_chat);

          localStorage.setItem(
            "Profile_ratio",
            response.data.profile_percentage
          );
          localStorage.setItem("PurchaseId", response.data.plan_id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
        setLazyLoading(false);
      }
    }
  };

  useEffect(() => {
    const savedFilterData = localStorage.getItem("FilterData");
    if (savedFilterData) {
      try {
        const filter = JSON.parse(savedFilterData);

        if (filter.radius_search === "0") {
          setDistance("sameCity");
        } else if (filter.radius_search === "50") {
          setDistance("50");
        } else if (filter.radius_search === "200") {
          setDistance("200");
        } else if (parseInt(filter.radius_search) >= 9999) {
          setDistance("anywhere");
        }

        setPreference(filter.search_preference || "");
        setAgemin(parseInt(filter.minage) || 18);
        setAgemax(parseInt(filter.maxage) || 100);
        setReligion(parseInt(filter.religion) || -1);
        setRelationship(parseInt(filter.relation_goal) || -1);
        setVerify(filter.is_verify || "");

        if (filter.language && filter.language !== "0") {
          const langIds = filter.language.split(",");
          setLanguage(langIds);
        }

        if (filter.custom_language) {
          setOtherLanguage(filter.custom_language);
        }

        setGreekConnection(filter.greek_connection || "");
      } catch (error) {
        console.error("Error restoring filter data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("FilterData")) {
      fetchUserData();
    } else {
      FilterDataGetHandler("");
    }
  }, [currentIndex, currentIndex2]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.scrollHeight
    ) {
      if (api.length < totalCards) {
        const newIndex = currentIndex + 12;
        if (!localStorage.getItem("FilterData")) {
          setCurrentIndex(newIndex);
        } else {
          setCurrentIndex2(newIndex);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(String(position.coords.latitude));
        setLongitude(String(position.coords.longitude));
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocation(true);
        } else {
          setLocation(false);
        }
      }
    );
    fetchUserData();
    FilterDataGetHandler("");
  }, [longitude, latitude]);

  const CoinHandler = () => {
    const localData = localStorage.getItem("Register_User");

    if (localData) {
      const userData = JSON.parse(localData);
      axios
        .post(`${basUrl}coin_report.php`, { uid: userData.id })
        .then((res) => {
          setYouCoin(res.data.coin);
        });
    }
  };

  useEffect(() => {
    axios.post(`${basUrl}gift_list.php`).then((res) => {
      setIconArray(res.data.giftlist);
    });

    CoinHandler();
    GetHandler();
  }, []);

  const FilterResetHandler = async (id) => {
    if (id) {
      setLoading(true);
      setApi("");
      setCurrentIndex(0);
      setCurrentIndex2(0);
      setTotalCards(0);
      fetchUserData();
    }
    showTost({ title: "Filter Reset Successfully!!" });

    setDistance("anywhere");
    setAgemin(18);
    setAgemax(100);
    setPreference("");
    setInterestId([]);
    setLanguage([]);
    setReligion(-1);
    setRelationship(-1);
    setVerify("");
    setGreekConnection("");
    setOtherLanguage("");

    localStorage.setItem("FilterData", "");
  };

  const FilterApplyHandler = async () => {
    const localData = localStorage.getItem("Register_User");

    if (!localData) return;
    const userData = JSON.parse(localData);

    let radiusValue = 0;
    if (distance === "sameCity") {
      radiusValue = 0;
    } else if (distance === "50") {
      radiusValue = 50;
    } else if (distance === "200") {
      radiusValue = 200;
    } else if (distance === "anywhere") {
      radiusValue = 9999;
    }

    let formattedLanguages = "0";
    if (language.length > 0) {
      formattedLanguages = language.join(",");
    }

    let backendGreekConnection = "0";
    if (greekConnection) {
      backendGreekConnection = greekConnection;
    }

    const customLanguageText = otherLanguage || "";

    const FilterData = {
      uid: userData.id,
      radius_search: String(radiusValue),
      search_preference: preference || "0",
      lats: latitude,
      longs: longitude,
      minage: String(agemin),
      maxage: String(agemax),
      relation_goal: relationship === -1 ? "0" : String(relationship),
      interest: interestId.length > 0 ? interestId.join(",") : "0",
      religion: religion === -1 ? "0" : String(religion),
      language: formattedLanguages,
      is_verify: verify || "0",
      greek_connection: backendGreekConnection,
      custom_language: customLanguageText,
    };

    console.log("Sending filter data:", FilterData);

    await localStorage.setItem("FilterData", JSON.stringify(FilterData));

    await setApi("");
    setCurrentIndex(0);
    setTotalCards(0);

    FilterDataGetHandler(1);
  };

  const FilterDataGetHandler = async (id) => {
    try {
      const localData = await localStorage.getItem("Register_User");
      const filterData = await localStorage.getItem("FilterData");

      if (!localData || !filterData) return;

      const userData = JSON.parse(localData);
      const filter = JSON.parse(filterData);

      const filterParams = {
        uid: userData.id,
        radius_search: filter.radius_search || "0",
        search_preference: filter.search_preference || "0",
        lats: latitude,
        longs: longitude,
        minage: filter.minage || "18",
        maxage: filter.maxage || "100",
        relation_goal: filter.relation_goal || "0",
        interest: filter.interest || "0",
        religion: filter.religion || "0",
        language: filter.language || "0",
        is_verify: filter.is_verify || "0",
        greek_connection: filter.greek_connection || "0",
        custom_language: filter.custom_language || "",
      };

      console.log("Fetching with params:", filterParams);

      if (currentIndex2 < 0) {
        setLoading(true);
      } else {
        setLazyLoading(true);
      }

      const response = await axios.post(`${basUrl}filter.php`, filterParams);

      if (response.data.Result === "true") {
        const newProfiles = response.data.profilelist.slice(
          currentIndex2,
          currentIndex2 + 12
        );

        setApi((prevCards) =>
          currentIndex2 > 0 ? [...prevCards, ...newProfiles] : newProfiles
        );

        if (id) {
          FilterHandler();
          showTost({ title: response.data.ResponseMsg });
        }

        setTotalCards(response.data.profilelist.length);
        setLoading(false);
        setLazyLoading(false);
      } else {
        showTost({ title: response.data.ResponseMsg || "No results found" });
        setApi([]);
        setLoading(false);
        setLazyLoading(false);
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      showTost({ title: "Filter error occurred" });
      setLoading(false);
      setLazyLoading(false);
    }
  };

  const GetHandler = () => {
    // axios.post(`${basUrl}interest.php`).then((res) => {
    //   setInterestList(res.data.interestlist);
    // });

    axios.post(`${basUrl}languagelist.php`).then((res) => {
      setLanguageList(res.data.languagelist);
    });

    axios.post(`${basUrl}religionlist.php`).then((res) => {
      setReligionList(res.data.religionlist);
    });

    axios.post(`${basUrl}goal.php`).then((res) => {
      setRelationshipList(res.data.goallist);
    });
  };

  const ChatHandler = (UserId, name) => {
    if (directchat === "1") {
      setChatId(UserId);
      sessionStorage.setItem("ChatId", UserId);
      localStorage.setItem("ChatId", UserId);
      setChatUserName(name);
    } else {
      showTost({ title: "No Direct Chat any User" });
      navigate("/upgrade");
    }
  };

  const ChatCloseHandle = () => {
    setChatId("");
    sessionStorage.setItem("ChatId", "");
  };

  return (
    <>
      <div className="" style={{ userSelect: "none", cursor: "default" }}>
        {loading ? (
          <div className="w-[100%] h-[100vh] ms-[8rem] max-_991_:ms-0 bg-white fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 z-[555]">
            <div>
              <h2 className="">{t("Loading...")}</h2>
            </div>
          </div>
        ) : api.length > 0 ? (
          <div className="main-wrapper bg-[#e5e5e5] dashboard">
            <div className="content-body ">
              <div className="container-fluid my-4">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="card card-rounded mb-4">
                      <div className="card-body">
                        <div className="fw-medium fs-18 px-3 text-gray-800 d-flex align-items-center gap-2 mb-3">
                          <img
                            src={imag}
                            alt="Logo"
                            style={{ width: "50px", height: "50px" }}
                          />
                          <h2>
                            {t("Welcome back")},{" "}
                            <strong>
                              {" "}
                              {localStorage.getItem("Register_User")
                                ? JSON.parse(
                                  localStorage.getItem("Register_User")
                                ).name
                                : ""}
                            </strong>
                          </h2>
                        </div>

                        <div className="person-header d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between">
                          <div className="fw-medium fs-16 px-3">
                            {t("Start Your Search for the Perfect Partner")}
                          </div>

                          {filterinclude == "1" &&
                            (localStorage.getItem("FilterData") ? (
                              <button
                                onClick={() => FilterResetHandler(1)}
                                className="btn gap-2 df-center text-white font-medium transition-all duration-200 align-self-end align-self-md-auto"
                                id="toggleFilterBtn"
                                style={{
                                  background: "#1F5799",
                                  borderRadius: "999px",
                                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                                  padding: "10px 18px",
                                }}
                                onMouseOver={(e) =>
                                  (e.currentTarget.style.background = "#174173")
                                }
                                onMouseOut={(e) =>
                                  (e.currentTarget.style.background = "#1F5799")
                                }
                              >
                                <svg
                                  width="15"
                                  height="10"
                                  viewBox="0 0 15 10"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mx-1"
                                >
                                  <path
                                    d="M6.15855 9.96157H9.3457V8.368H6.15855V9.96157ZM0.581055 0.400146V1.99372H14.9232V0.400146H0.581055ZM2.97141 5.97765H12.5328V4.38407H2.97141V5.97765Z"
                                    fill="white"
                                  />
                                </svg>
                                {t("Reset")}
                              </button>
                            ) : (
                              <button
                                onClick={FilterHandler}
                                className="btn gap-2 df-center text-white font-medium transition-all duration-200 align-self-start md:align-self-end align-self-md-auto ml-4 mt-2"
                                id="toggleFilterBtn"
                                style={{
                                  background: "#1F5799",
                                  borderRadius: "999px",
                                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                                  padding: "10px 20px",
                                }}
                                onMouseOver={(e) =>
                                  (e.currentTarget.style.background = "#174173")
                                }
                                onMouseOut={(e) =>
                                  (e.currentTarget.style.background = "#1F5799")
                                }
                              >
                                <svg
                                  width="15"
                                  height="10"
                                  viewBox="0 0 15 10"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mx-1"
                                >
                                  <path
                                    d="M6.15855 9.96157H9.3457V8.368H6.15855V9.96157ZM0.581055 0.400146V1.99372H14.9232V0.400146H0.581055ZM2.97141 5.97765H12.5328V4.38407H2.97141V5.97765Z"
                                    fill="white"
                                  />
                                </svg>
                                <span className="text-white">
                                  {t("Filter")}
                                </span>
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-[20px]">
                    <div className="grid grid-cols-1 min-[425px]:grid-cols-3 min-[768px]:grid-cols-6 min-[1024px]:grid-cols-4 min-[1260px]:grid-cols-5 min-[1360px]:grid-cols-6 gap-x-1 md:gap-x-2 gap-y-6">
                      {api.map((el, i) => {
                        return (
                          <div
                            key={i}
                            className={`${bg.includes(el.profile_name) ? "hidden" : "block"
                              } ${likeDn.includes(el.profile_name)
                                ? "hidden"
                                : "block"
                              } custom-card cursor-pointer bg-amber-200 md:bg-gray-100 card-rounded-1 relative z-[444] overflow-hidden`}
                          >
                            {close.includes(el.profile_id) && (
                              <Lottie
                                className="w-[100%] absolute top-[120px] right-[0px] z-[777]"
                                key={i}
                                animationData={DisLike}
                                loop={true}
                              />
                            )}
                            {like.includes(el.profile_id) && (
                              <Lottie
                                className="w-[100%] absolute top-[120px] right-[0px] z-[777]"
                                key={i}
                                animationData={Like}
                                loop={true}
                              />
                            )}
                            <div
                              className={`${close?.includes(el?.profile_id) ||
                                  like?.includes(el?.profile_id)
                                  ? "opacity-0"
                                  : "opacity-[1]"
                                } duration-[0.7s] ease-in`}
                            >
                              <div className="position-relative rounded-[1rem] overflow-hidden">
                                <div
                                  className="card-title"
                                  onClick={() =>
                                    IdHandler(i, el.profile_id, el.profile_name)
                                  }
                                >
                                  <div className="Coloreffect">
                                    {el?.profile_images.length > 1 ? (
                                      <Slider
                                        {...settings2}
                                        className="w-[100%]"
                                      >
                                        {el?.profile_images.map(
                                          (img, index) => {
                                            return (
                                              <div key={index}>
                                                <img
                                                  className="img-fluid HEIGHT w-[100%] object-cover"
                                                  src={`${imageBaseURL}${img}`}
                                                  alt=""
                                                />
                                              </div>
                                            );
                                          }
                                        )}
                                      </Slider>
                                    ) : (
                                      <img
                                        src={`${imageBaseURL}${el?.profile_images[0]}`}
                                        alt="img"
                                        className="img-fluid rounded-[3rem] BEFORE HEIGHT w-[100%] object-cover"
                                      />
                                    )}
                                  </div>

                                  <div className="card-content absolute bottom-[2rem] px-[15px] w-[100%] z-[2]">
                                    <div className="flex items-end wrap justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <h6 className="fw-semi-bold text-white text-[18px] overflow-hidden text-ellipsis whitespace-nowrap mb-1 flex-1">
                                          {el.profile_name}, {el.profile_age}
                                        </h6>

                                        <div className="KM text-start hidden sm:block">
                                          <h6 className="m-0 flex items-center gap-[2px] text-white">
                                            <HiOutlineLocationMarker />
                                            {el.profile_distance}
                                          </h6>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="-mt-[25px] max-_430_:-mt-[20px]">
                                <div className="image-action-icon items-center cursor-default ">
                                  <div className="relative group/btn">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        CloseAnimationHandler(
                                          el.profile_id,
                                          el.profile_name
                                        );
                                      }}
                                      title="Remove"
                                      className="action-btn avatar avatar-lg rounded-full z-1 bg-white shadow-md hover:shadow-lg transition-shadow"
                                    >
                                      <RxCross2 className="w-[24px] h-[24px] text-red-500" />
                                    </button>
                                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[999]">
                                      Pass
                                    </span>
                                  </div>

                                  <div className="relative group/btn">
                                    <button
                                      onClick={() =>
                                        ProfileLikeHandler(api.profile_id)
                                      }
                                      style={{
                                        background: "white",
                                      }}
                                      title="Like"
                                      className="action-btn avatar avatar-lg rounded-full z-1 shadow-lg hover:shadow-xl transition-shadow"
                                    >
                                      <img
                                        src={HeartIcon}
                                        alt="Heart icon"
                                        className="w-[30px]"
                                      />
                                    </button>
                                  </div>

                                  <div className="relative group/btn">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        ChatHandler(
                                          el.profile_id,
                                          el.profile_name
                                        );
                                      }}
                                      title="Chat"
                                      style={{
                                        background: "white",
                                      }}
                                      className="action-btn avatar avatar-lg rounded-full z-1 shadow-md hover:shadow-lg transition-shadow"
                                    >
                                      <img
                                        src={ChatIcon}
                                        alt="Chat icon"
                                        className="w-[30px]"
                                      />
                                    </button>

                                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[999]">
                                      Chat
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {lazyLoading && <div>Loading...</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : localStorage.getItem("FilterData") ? (
          <div className="h-[100vh] ms-[16rem] max-_991_:ms-0 flex justify-center items-center">
            <div className="text-center">
              <h3>{t("No Any Match Profile...")}</h3>
              <button
                onClick={() => FilterResetHandler(1)}
                className="text-[18px] font-[600] mt-[20px] bg-[#0066CC] text-[#333333] w-[50%] py-[10px] rounded-[10px]"
              >
                {t("Reset")}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-[100vh] ms-[16rem] max-_991_:ms-0 flex justify-center items-center">
            <h3>{t("No Any New Profile...")}</h3>
          </div>
        )}

        <div ref={Classadd} className="filter-area overflow-y-scroll w-[100%]">
          <div className="filter-content">
            <div className="filter-heading">
              <div className="flex flex-col mb-2">
                <h3 className="fw-semi-bold mb-0">{t("Filter & Show")}</h3>
                <p className=" mb-0">{t("FilterSubText")}</p>
              </div>
              <button onClick={FilterHandler}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="button"
                  className="close-btn"
                >
                  <path
                    d="M11.0245 8.06519L16.3109 2.77875C16.614 2.47564 16.7812 2.07223 16.7812 1.6437C16.7812 1.21517 16.614 0.811761 16.3109 0.508654C16.0078 0.205546 15.6044 0.0383301 15.1759 0.0383301C14.7474 0.0383301 14.3439 0.205546 14.0408 0.508654L8.75439 5.79509L3.46796 0.508654C3.16485 0.205546 2.76144 0.0383301 2.33291 0.0383301C1.90438 0.0383301 1.50097 0.205546 1.19786 0.508654C0.894755 0.811761 0.727539 1.21517 0.727539 1.6437C0.727539 2.07223 0.894755 2.47564 1.19786 2.77875L6.4843 8.06519L1.19786 13.3516C0.894755 13.6547 0.727539 14.0581 0.727539 14.4867C0.727539 14.9152 0.894755 15.3186 1.19786 15.6217C1.50147 15.9248 1.90438 16.092 2.33291 16.092C2.76144 16.092 3.16435 15.9248 3.46796 15.6217L8.75439 10.3353L14.0408 15.6217C14.3444 15.9248 14.7474 16.092 15.1759 16.092C15.6044 16.092 16.0073 15.9248 16.3109 15.6217C16.614 15.3186 16.7812 14.9152 16.7812 14.4867C16.7812 14.0581 16.614 13.6547 16.3109 13.3516L11.0245 8.06519Z"
                    fill="#808080"
                  ></path>
                </svg>
              </button>
            </div>

            {/* BASICS SECTION - Collapsible */}
            <div className="mb-4">



              <div className="mt-3 space-y-4">
                {/* Search Preference */}
                <div className="filter-element border-b-[2px] pb-[20px] border-gray-300">
                  <h6 className="text-[18px] font-[500] max-_430_:text-[16px]">
                    {t("Serach Preference")}
                  </h6>
                  <div className="">
                    <ul className="flex flex-wrap items-center gap-[10px]  m-0 p-0">
                      <li
                        onClick={() => setPreference("MALE")}
                        className={`${preference === "MALE" && "Active"
                          } text-[16px] cursor-pointer border-[2px] border-gray-300 rounded-full py-[5px] px-[15px]`}
                      >
                        {t("MALE")}
                      </li>
                      <li
                        onClick={() => setPreference("FEMALE")}
                        className={`${preference === "FEMALE"
                            ? "Active"
                            : "hover:bg-[#ddd]"
                          } text-[16px] cursor-pointer border-[2px] border-gray-300 rounded-full py-[5px] px-[15px]`}
                      >
                        {t("FEMALE")}
                      </li>
                      <li
                        onClick={() => setPreference("Both")}
                        className={`${preference === "Both" ? "Active" : "hover:bg-[#ddd]"
                          } text-[16px] cursor-pointer border-[2px] border-gray-300 rounded-full py-[5px] px-[15px]`}
                      >
                        {t("Both")}
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Age Range */}
                <div className="filter-element border-b-[2px] pb-[20px] border-gray-300">
                  <div
                    className="range-slider position-relative w-100 pb-3"
                    data-role="rangeslider"
                  >
                    <div className="range-label mb-3">
                      <label className="text-[18px] font-[500] max-_430_:text-[16px]">
                        {t("Age")}
                      </label>
                      <span id="range-value" className="form-label">
                        {AGEMIN}-{AGEMAX}
                      </span>
                    </div>
                    <div className="track position-absolute w-100"></div>
                    <div
                      style={{
                        left: percentmin + "%",
                        right: percentmax + "%",
                      }}
                      className="fill position-absolute"
                      id="fill"
                    ></div>

                    <input
                      type="range"
                      name="ageMin"
                      id="ageMin"
                      value={agemin}
                      onChange={(e) => {
                        const min = e.target.value;
                        min < agemax && setAgemin(min);
                      }}
                      min="0"
                      max="101"
                      className="position-absolute border-0 form-input-range"
                    />

                    <input
                      type="range"
                      name="ageMax"
                      id="ageMax"
                      value={agemax}
                      onChange={(e) => {
                        const max = e.target.value;
                        max > agemin && setAgemax(max);
                      }}
                      min="0"
                      max="100"
                      className="position-absolute border-0 form-input-range"
                    />
                  </div>
                </div>

                {/* Distance Range */}
                <div className="filter-element border-b-[2px] pb-[10px] border-gray-300">
                  <div className="">
                    <div className="flex justify-between items-center mb-2">
                      <h6 className="text-[18px] font-[500] max-_430_:text-[16px]">
                        {t("Distance Range")}
                      </h6>
                      <span className="form-label">
                        {distance === "anywhere"
                          ? t("Anywhere")
                          : `${distance} ${t("km")}`}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="sameCity"
                          name="distanceRange"
                          value="sameCity"
                          checked={distance === "sameCity"}
                          onChange={(e) => setDistance(e.target.value)}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                        />
                        <label
                          htmlFor="sameCity"
                          className="ml-2 text-[14px] font-[400] text-black cursor-pointer"
                        >
                          {t("Same city")}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="50km"
                          name="distanceRange"
                          value="50"
                          checked={distance === "50"}
                          onChange={(e) => setDistance(e.target.value)}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                        />
                        <label
                          htmlFor="50km"
                          className="ml-2 text-[14px] font-[400] text-black cursor-pointer"
                        >
                          50 {t("km")}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="200km"
                          name="distanceRange"
                          value="200"
                          checked={distance === "200"}
                          onChange={(e) => setDistance(e.target.value)}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                        />
                        <label
                          htmlFor="200km"
                          className="ml-2 text-[14px] font-[400] text-black cursor-pointer"
                        >
                          200 {t("km")}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="anywhere"
                          name="distanceRange"
                          value="anywhere"
                          checked={distance === "anywhere"}
                          onChange={(e) => setDistance(e.target.value)}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                        />
                        <label
                          htmlFor="anywhere"
                          className="ml-2 text-[14px] font-[400] text-black cursor-pointer"
                        >
                          {t("Anywhere")}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* GREEK CONNECTION & CULTURE SECTION - Collapsible */}
            <div className="mb-4">

              <h5 className="text-[18px] font-[600] mb-0">
                {t("GREEK CONNECTION & CULTURE")}
              </h5>



              <div className="mt-3 space-y-4">
                {/* Greek Connection */}
                <div className="filter-element border-b-[2px] pb-[20px] border-gray-300">
                  <h6 className="text-[18px] font-[500] max-_430_:text-[16px] mb-4">
                    {t("Greek Connection")}
                  </h6>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="Greek"
                        name="greekConnection"
                        value="Greek"
                        checked={greekConnection === "Greek"}
                        onChange={(e) => setGreekConnection(e.target.value)}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="Greek"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer flex items-center gap-2"
                      >
                        {t("greekOptionGreek")}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="Greek origin / Greek heritage"
                        name="greekConnection"
                        value="Greek origin / Greek heritage"
                        checked={
                          greekConnection === "Greek origin / Greek heritage"
                        }
                        onChange={(e) => setGreekConnection(e.target.value)}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="Greek origin / Greek heritage"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer flex items-center gap-2"
                      >
                        {t("greekOptionGreekOrigin")}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="Philhellene"
                        name="greekConnection"
                        value="Philhellene"
                        checked={greekConnection === "Philhellene"}
                        onChange={(e) => setGreekConnection(e.target.value)}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="Philhellene"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer flex items-center gap-2"
                      >
                        {t("greekOptionPhilhellene")}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div className="filter-element border-b-[2px] pb-[20px] border-gray-300">
                  <h6 className="text-[18px] font-[500] max-_430_:text-[16px] mb-4">
                    {t("Languages I Know")}
                  </h6>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="english"
                        value="1"
                        checked={language.includes("1")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLanguage([...language, "1"]);
                          } else {
                            setLanguage(
                              language.filter((item) => item !== "1")
                            );
                          }
                        }}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 rounded focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="english"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer"
                      >
                        {t("English")}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="greek"
                        value="2"
                        checked={language.includes("2")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLanguage([...language, "2"]);
                          } else {
                            setLanguage(
                              language.filter((item) => item !== "2")
                            );
                          }
                        }}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 rounded focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="greek"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer"
                      >
                        {t("Greek")}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="other"
                        value="3"
                        checked={
                          language.includes("3") || otherLanguage !== ""
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLanguage([...language, "3"]);
                            if (otherLanguageInputRef.current) {
                              setTimeout(() => {
                                otherLanguageInputRef.current.focus();
                              }, 100);
                            }
                          } else {
                            setLanguage(
                              language.filter((item) => item !== "3")
                            );
                            setOtherLanguage("");
                          }
                        }}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 rounded focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="other"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer"
                      >
                        {t("Other")}
                      </label>
                    </div>
                  </div>

                  {(language.includes("3") || otherLanguage !== "") && (
                    <div className="mt-3">
                      <label
                        htmlFor="otherLanguage"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("Please specify other language")}
                      </label>
                      <input
                        ref={otherLanguageInputRef}
                        type="text"
                        id="otherLanguage"
                        value={otherLanguage}
                        onChange={(e) => setOtherLanguage(e.target.value)}
                        placeholder={t("Enter language name")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F5799] focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* Religion */}
                <div className="filter-element border-b-[2px] pb-[20px] border-gray-300">
                  <h6 className="text-[18px] font-[500] max-_430_:text-[16px] mb-4">
                    {t("Religion")}
                  </h6>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="orthodox"
                        checked={religion === 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setReligion(0);
                          } else {
                            setReligion(-1);
                          }
                        }}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 rounded focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="orthodox"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer"
                      >
                        {t("Orthodox Christian")}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="christianOther"
                        checked={religion === 1}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setReligion(1);
                          } else {
                            setReligion(-1);
                          }
                        }}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 rounded focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="christianOther"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer"
                      >
                        {t("Christian (Other)")}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="jewish"
                        checked={religion === 2}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setReligion(2);
                          } else {
                            setReligion(-1);
                          }
                        }}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 rounded focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="jewish"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer"
                      >
                        {t("Jewish")}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="muslim"
                        checked={religion === 3}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setReligion(3);
                          } else {
                            setReligion(-1);
                          }
                        }}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 rounded focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="muslim"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer"
                      >
                        {t("Muslim")}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="noPreference"
                        checked={religion === 4}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setReligion(4);
                          } else {
                            setReligion(-1);
                          }
                        }}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 rounded focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="noPreference"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer"
                      >
                        {t("No preference")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RELATIONSHIP INTENT SECTION - Collapsible */}
            <div className="mb-4">

              <h5 className="text-[18px] font-[600] mb-0">
                {t("RELATIONSHIP INTENT")}
              </h5>




              <div className="mt-3 space-y-4">
                <div className="filter-element border-b-[2px] pb-[20px] border-gray-300">
                  <h6 className="text-[18px] font-[500] max-_430_:text-[16px] mb-4">
                    {t("Relationship Goals")}
                  </h6>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="marriage"
                        checked={relationship === 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRelationship(0);
                          } else {
                            setRelationship(-1);
                          }
                        }}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 rounded focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="marriage"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer"
                      >
                        {t("Marriage")}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="seriousRelationship"
                        checked={relationship === 1}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRelationship(1);
                          } else {
                            setRelationship(-1);
                          }
                        }}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 rounded focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="seriousRelationship"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer"
                      >
                        {t("Serious relationship")}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="companionship"
                        checked={relationship === 2}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRelationship(2);
                          } else {
                            setRelationship(-1);
                          }
                        }}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 rounded focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="companionship"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer"
                      >
                        {t("Companionship")}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="friendshipFirst"
                        checked={relationship === 3}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRelationship(3);
                          } else {
                            setRelationship(-1);
                          }
                        }}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 rounded focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="friendshipFirst"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer"
                      >
                        {t("Friendship first")}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notSureYet"
                        checked={relationship === 4}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRelationship(4);
                          } else {
                            setRelationship(-1);
                          }
                        }}
                        className="h-4 w-4 text-[#1F5799] border-gray-300 rounded focus:ring-[#1F5799]"
                      />
                      <label
                        htmlFor="notSureYet"
                        className="ml-3 text-[16px] font-[400] text-black cursor-pointer"
                      >
                        {t("Not sure yet")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* VERIFICATION SECTION - Collapsible */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("verification")}
                className="w-full flex items-center py-3  "
              >
                <h5 className="text-[18px] font-[600] mb-0 pr-2">
                  {t("More Filters")}
                </h5>
                {expandedSections.verification ? (
                  <FaChevronUp className="text-gray-600" />
                ) : (
                  <FaChevronDown className="text-gray-600" />
                )}
              </button>

              {expandedSections.verification && (
                <div className="mt-3 space-y-4">
                  <div className="filter-element">
                    <h6 className="text-[18px] font-[500] max-_430_:text-[16px] mb-4">
                      {t("Verify Profile")}
                    </h6>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="unverify"
                          checked={verify === "0"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setVerify("0");
                            } else {
                              setVerify("");
                            }
                          }}
                          className="h-4 w-4 text-[#1F5799] border-gray-300 rounded focus:ring-[#1F5799]"
                        />
                        <label
                          htmlFor="unverify"
                          className="ml-3 text-[16px] font-[400] text-black cursor-pointer"
                        >
                          {t("Unverify")}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="verify"
                          checked={verify === "2"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setVerify("2");
                            } else {
                              setVerify("");
                            }
                          }}
                          className="h-4 w-4 text-[#1F5799] border-gray-300 rounded focus:ring-[#1F5799]"
                        />
                        <label
                          htmlFor="verify"
                          className="ml-3 text-[16px] font-[400] text-black cursor-pointer"
                        >
                          {t("Verify")}
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* <!-- Interests Start --> */}
                  <div className="filter-element border-b-[2px] pb-[20px] border-gray-300">


                    <div className="filter-element pb-[20px] border-gray-300">
                      <h6 className="text-[18px] font-[500] max-_430_:text-[16px] mb-4">
                        {t("Interests")}
                      </h6>

                      <div className="flex flex-wrap gap-2">
                        {/* Static interest options */}
                        {[
                          { id: "1", title: "Travel" },
                          { id: "2", title: "Family" },
                          { id: "3", title: "Culture" },
                          { id: "4", title: "Food" },
                          { id: "5", title: "Faith" }
                        ].map((el, index) => {
                          return (
                            <button
                              key={index}
                              onClick={() => InterestMapHandler(el.id)}
                              className="inline-block"
                            >
                              <div
                                className={`button text-[16px] max-_430_:text-[14px] px-[13px] py-[5px] border-[2px] border-gray-300 rounded-[50px] mb-[10px] me-[10px] flex items-center gap-[10px] ${interestId.includes(el.id) && "selected"
                                  }`}
                              >
                                {t(el.title)}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {/* <!-- Interests End --> */}
                </div>
              )}
            </div>

            {/* Apply Buttons */}
            <div className="flex justify-center gap-[15px] mt-[20px]">
              <button
                onClick={FilterResetHandler}
                className="text-[18px] font-[600] text-white bg-[#1F5799] hover:bg-[#17477C] w-[40%] py-[10px] rounded-full transition duration-300"
              >
                {t("Reset")}
              </button>

              <button
                onClick={FilterApplyHandler}
                className="text-[18px] font-[600] text-white bg-[#1F5799] hover:bg-[#17477C] w-[40%] py-[10px] rounded-full transition duration-300"
              >
                {t("Apply")}
              </button>
            </div>
          </div>
        </div>

        <div
          ref={BgDisplay}
          onClick={FilterHandler}
          id="overlay"
          className="overlay z-[888]"
        ></div>

        <button className="scroll-to-top block">
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.408 1.23077L14.9362 12.3077C15.1175 12.6154 14.8908 13 14.5282 13H1.47184C1.10916 13 0.882484 12.6154 1.06382 12.3077L7.59199 1.23077C7.77333 0.923077 8.22667 0.923077 8.408 1.23077Z"
              stroke="var(--primary-color)"
              stroke-width="2"
            />
          </svg>
        </button>

        {isVisible && (
          <div
            onClick={() => toggleBottomSheet("GidtSend")}
            className="bottom-sheet z-[999]"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bottom-sheet-content"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-[18px] m-0 font-[600]">Send Gifts</h1>
                <div className="flex items-center gap-[10px]">
                  <img src={CoinIcon} alt="" className="w-[25px]" />
                  <span className="text-[18px]">{youCoin ? youCoin : "0"}</span>
                  <img
                    onClick={() => toggleBottomSheet("GidtSend")}
                    src={CloseIcon}
                    alt=""
                    className="w-[15px] ms-[15px] cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-[20px] mx-auto mt-3 max-_430_:gap-[10px]">
                {iconArray.map((el, i) => {
                  return (
                    <button
                      key={i}
                      onClick={() => GiftHandler(el.id, el.price, el.img)}
                      style={{
                        borderColor: giftid.includes(el.id)
                          ? "#0066CC"
                          : "#D1D5DB",
                      }}
                      className="w-[20%] max-_430_:w-[calc(25%-10px)] border-[2px] flex justify-center py-[5px] rounded-[10px] relative"
                    >
                      <div className="relative">
                        <img
                          src={imageBaseURL + el.img}
                          alt=""
                          className="w-[45px] mx-auto max-_380_:w-[40px] max-_380_:h-[40px] max-_330_:w-[30px] max-_330_:h-[30px]"
                        />
                        <div className="flex items-center justify-center gap-[5px] mt-2">
                          <img
                            src={CoinIcon}
                            alt=""
                            className={`w-[15px] ${el.price === "0" && "hidden text-center"
                              }`}
                          />
                          <span className="text-[14px] font-[500]">
                            {el.price === "0" ? "Free" : el.price}
                          </span>
                        </div>
                        <IoIosCheckmarkCircle
                          style={{
                            display: giftid.includes(el.id) ? "block" : "none",
                          }}
                          className="absolute -top-[15px] -right-[30px] max-_380_:-right-[20px] max-_330_:-right-[10px] w-[25px] h-[25px] text-[#0066CC] bg-white rounded-full"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => SednHandler()}
                className="font-bold text-[18px] rounded-[10px] mt-[20px] text-[#333333] py-[10px] w-[100%] bg-[#0066CC]"
              >
                {t("Send")}
              </button>
            </div>
          </div>
        )}

        {chatId && (
          <div onClick={ChatCloseHandle} className="bottom-sheet z-[999]">
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ width: "400px" }}
              className="bottom-sheet-content"
            >
              <UserChat />
            </div>
          </div>
        )}
      </div>
      <Footer />
      <CookiePopup />
    </>
  );
};

export default Dashboard;
/* jshint ignore:end */