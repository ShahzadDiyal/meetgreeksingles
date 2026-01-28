/* jshint esversion: 6 */
/* jshint esversion: 8 */
/* jshint ignore:start */
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../Context/MyProvider";
import Razorpay from "../PaymentMethod/Razorpay";
import Paypal from "../PaymentMethod/PayPal";
import { StripePayment } from "../PaymentMethod/Stripe";
import PayStack from "../PaymentMethod/PayStack";
import FlutterWave from "../PaymentMethod/FlutterWave";
import SenangPay from "../PaymentMethod/SenangPay";
import Payfast from "../PaymentMethod/Payfast";
import Midtrans from "../PaymentMethod/Midtrans";
import Checkout from "../PaymentMethod/Checkout";
import KhaltiPayment from "../PaymentMethod/Khalti_Payment";
import MercadoPagoCheckout from "../PaymentMethod/MercadoPago";
import PaytmPayment from "../PaymentMethod/PaytmPayment";
import { useTranslation } from "react-i18next";
import { MdOutlineErrorOutline } from "react-icons/md";
import { showTost } from "../showTost";
import wallet from "../Icon/wallet.svg";
import { Check, X, Shield, MessageCircle, Calendar, MapPin, Rocket } from "lucide-react";
import Footer from "./Footer";
// import logo1 from "../images/logos/logo1.png";
import logo1 from "../images/logos/meet-greek.png";

const Upgrade = () => {
  const { t } = useTranslation();
  const {
    basUrl,
    imageBaseURL,
    planId,
    setPlanId,
    transactionId,
    setTransactionId,
    setPageName,
    currency,
    setAmount,
  } = useContext(MyContext);

  const [planLIst, setPlanList] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [payDetails, setPayDetails] = useState([]);
  const [border, setBorder] = useState();
  const [button, setButton] = useState(true);
  const [payId, setPayId] = useState();
  const [id, setId] = useState();
  const [pId, setPId] = useState();
  const [packageId, setPackageId] = useState();
  const [planData, setPlanData] = useState([]);
  const [btnDis, setBtnDis] = useState(false);
  const [coin, setCoin] = useState();

  const toggleBottomSheet = (e) => {
    if (e === "PayMent") {
      setIsVisible(false);
      setBtnDis(false);
    } else {
      setIsVisible(true);
    }
  };

  const PalanDetailsHandler = () => {
    setIsVisible2(!isVisible2);
  };

  useEffect(() => {
    const Done = localStorage.getItem("PaymentDone");
    if (Done === "PaymentDoneUpgrade") {
      PurchaseHandler();
      setTransactionId(Date.now());
      setAmount(localStorage.getItem("Amount"));
    }

    axios.post(`${basUrl}paymentgateway.php`).then((res) => {
      setPayDetails(res.data.paymentdata);
    });

    PalnListHandler();
    CoinHandler();
    navigator.geolocation.getCurrentPosition((position) => {
      fetchUserData(
        String(position.coords.latitude),
        String(position.coords.longitude)
      );
    });
  }, []);

  const CoinHandler = () => {
    const localData = localStorage.getItem("Register_User");
    if (localData) {
      const userData = JSON.parse(localData);
      axios
        .post(`${basUrl}wallet_report.php`, { uid: userData.id })
        .then((res) => {
          if (res.data.Result === "true") {
            setCoin(res.data.wallet);
          }
        });
    }
  };

  const fetchUserData = async (latitude, longitude) => {
    const localData = localStorage.getItem("Register_User");
    if (localData) {
      const userData = JSON.parse(localData);
      try {
        const response = await axios.post(`${basUrl}home_data.php`, {
          uid: userData.id,
          lats: latitude,
          longs: longitude,
        });
        if (response.data.Result === "true") {
          setPlanData(response.data.plandata);
          setPackageId(response.data.plan_id);
        }
      } catch (error) {
        console.error("Error :", error);
      }
    }
  };

  const PalnListHandler = () => {
    const localData = localStorage.getItem("Register_User");
    if (localData) {
      const userData = JSON.parse(localData);
      axios.post(`${basUrl}plan.php`, { uid: userData.id }).then((res) => {
        setPlanList(res.data.PlanData);
      });
    }
  };

  useEffect(() => {
    if (planId === "PaymentDone") {
      PurchaseHandler();
    } else {
      SectionCloseHandler();
    }
  }, [planId]);

  const SendHandler = (Id) => {
    if (border) {
      setPayId(Id);
      setButton(true);
      const Data = {
        Planid: planLIst[id] && planLIst[id].id,
        Pname: Id,
        pMethodid: pId,
      };
      localStorage.setItem("Data", JSON.stringify(Data));
    } else {
      if (btnDis) {
        if (planLIst[id].amt > coin) {
          showTost({ title: t("pleaseAddBalance") });
          setIsVisible(false);
        } else {
          setPayId(Id);
          setPlanId("PaymentDone");
        }
      } else {
        showTost({ title: t("pleaseSelectPayment") });
      }
    }
  };

  const PurchaseHandler = () => {
    const localData = localStorage.getItem("Register_User");
    const Data = localStorage.getItem("Data");
    if (localData) {
      const userData = JSON.parse(localData);
      if (Data) {
        const Json = JSON.parse(Data);
        axios
          .post(`${basUrl}plan_purchase.php`, {
            uid: userData.id,
            plan_id: Json && Json.Planid,
            wall_amt: btnDis ? planLIst[id].amt : "0",
            transaction_id: Date.now(),
            pname: Json && Json.Pname,
            p_method_id: Json && Json.pMethodid,
          })
          .then((res) => {
            if (res.data.Result === "true") {
              showTost({ title: res.data.ResponseMsg });
              SectionCloseHandler();
            }
          });
      } else {
        axios
          .post(`${basUrl}plan_purchase.php`, {
            uid: userData.id,
            plan_id: planLIst[id] && planLIst[id].id,
            wall_amt: btnDis ? planLIst[id].amt : "0",
            transaction_id: transactionId || Date.now(),
            pname: payId ? payId : "5",
            p_method_id: pId ? pId : "5",
          })
          .then((res) => {
            if (res.data.Result === "true") {
              showTost({ title: res.data.ResponseMsg });
              SectionCloseHandler();
            }
          });
      }
    }
  };

  const GetStartedHandler = (index, id) => {
    if (packageId < id) {
      toggleBottomSheet("");
      setId(index);
      setPageName("Upgrade");
    } else {
      showTost({ title: t("alreadyPurchase") });
    }
  };

  const SectionCloseHandler = () => {
    setPlanId("");
    toggleBottomSheet("PayMent");
    setBorder("");
    setPayId("");
    setButton(false);
    setId("");
    localStorage.setItem("PaymentDone", "");
    localStorage.setItem("Amount", "");
    localStorage.setItem("Data", "");
  };

  const SwitchHandler = () => {
    if (btnDis) {
      setBtnDis(false);
    } else {
      setBtnDis(true);
    }
    setBorder("");
  };

  // Features comparison data - you can modify this based on your database structure
  const features = [
    { name: t("createProfile"), free: true, premium: true },
    { name: t("browseProfiles"), free: true, premium: true },
    { name: t("unlimitedMessaging"), free: false, premium: true },
    { name: t("phoneVideoChat"), free: false, premium: true },
    { name: t("browseInvisibly"), free: false, premium: true },
    { name: t("priorityVisibility"), free: false, premium: true },
    { name: t("viewWhoLiked"), free: false, premium: true },
    { name: t("premiumFilters"), free: false, premium: true },
    { name: t("communityRooms"), free: false, premium: true },
    { name: t("postHostEvents"), free: false, premium: true },
    { name: t("eventInvitations"), free: false, premium: true },
    {
      name: t("communityRooms"),
      free: false,
      premium: true,
    },
    { name: t("eligibilityAmbassador"), free: false, premium: true },
    { name: t("foundingMemberStatus"), free: false, premium: true },
  ];

  return (
    <div className="bg-[#F5F1E8] min-h-screen">
      <div className="content-body">
        <div className="container-fluid px-sm-4 px-3">
          <div className="row justify-content-center">
            <div className="col-xl-12">
              <div className="p-4 p-md-8 mb-5">
                <div className="text-center mb-6">
                  <div className="inline-block p-3">
                    <div className="text-3xl font-bold text-gray-800 tracking-tight">
                      <img src={logo1} alt="" width={170} height={170} />
                    </div>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                    {t("becomeFoundingMember")}
                  </h1>

                  <p className="text-gray-700 mb-4 mt-4 text-xl rounder-xl mx-auto">
                    {t("communityDescription")}
                  </p>

                  {planLIst.length > 0 && (
                    <p className="flex flex-col">
                      <span className="text-gray-700  text-4xl font-semibold rounder-xl mx-auto">
                        {" "}
                        €{planLIst[0]?.amt || 60} for{" "}
                        {planLIst[0]?.day_limit || 6} days{" "}
                      </span>
                      <span className=" text-xl"> (one-time payment).</span>
                    </p>
                  )}

                  <p className=" text-xl">
                    {t("foundingMemberLaunch")}
                  </p>

                 <div className="my-3">
  {(() => {
    const premiumPlan = planLIst.find((item) => {
      return (
        item.amt >= (planLIst[0]?.amt || 60) ||
        item.title.toLowerCase().includes("premium")
      );
    });

    if (!premiumPlan) return null;

    return (
      <button
        onClick={() => GetStartedHandler(0, premiumPlan.id)}
        className="bg-[#1f5799] text-center text-2xl text-white font-bold py-3 px-6 rounded-full border-3 border-amber-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
      >
        {t("becomeFoundingMember")}
      </button>
    );
  })()}
</div>

                  <p className="mt-3 text-xl">
                    {t("securePayments")}
                  </p>
                  {/* Founding Member Explanation */}
                  <div className="text-xl py-6 rounded-lg mb-6 mx-auto text-center">
                    <p className="text-gray-700 text-xl ">
                      {t("communityDescription")}
                    </p>
                    <h1 className="my-3 text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
                      {t("whyBecomeMember")}
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                      <div className="rounded-xl shadow-md p-6 flex flex-col items-center text-center border-2 border-amber-500">
                        <Shield className="w-12 h-12 text-amber-500 mb-4" /> 
                        <h3 className="text-2xl font-semibold mb-2">{t("foundingMemberBadge")}</h3> 
                        <p className="text-gray-600 text-xl">
                          {t("badgeDescription")}
                        </p>
                      </div>

                      {/* Card 2 */}
                      <div className="rounded-xl shadow-md p-6 flex flex-col items-center text-center border-2 border-amber-500">
                        <MessageCircle  className="w-12 h-12 text-amber-500 mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">{t("fullAccess")}</h3>
                        <p className="text-gray-600 text-xl">
                          {t("accessDescription")}
                        </p>
                      </div>

                      {/* Card 3 */}
                      <div className="rounded-xl shadow-md p-6 flex flex-col items-center text-center border-2 border-amber-500">
                        <Calendar  className="w-12 h-12 text-amber-500 mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">{t("eventsTrips")}</h3>
                        <p className="text-gray-600 text-xl">
                          {t("eventsDescription")}
                        </p>
                      </div>

                      {/* Card 4 */}
                      <div className="rounded-xl shadow-md p-6 flex flex-col items-center text-center border-2 border-amber-500">
                        <Rocket  className="w-12 h-12 text-amber-500 mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">{t("specialLaunchPrice")}</h3>
                        <p className="text-gray-600 text-xl">
                          {t("priceDescription")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Membership Comparison Table */}
                <h1 className="mb-3 mt-4 text-center text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
                  {t("freeVsPremium")}
                </h1>
                
                <div className="mb-8 overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-amber-50 to-amber-100">
                        <th className="py-4 text-xl px-4 md:px-6 text-left text-gray-800 font-semibold border-b border-amber-200">
                          {t("feature")}
                        </th>
                        <th className="py-4 text-xl px-4 md:px-6 text-center text-gray-800 font-semibold border-b border-amber-200">
                          {t("freeMembership")}
                        </th>
                        <th className="py-4 text-xl px-4 md:px-6 text-center text-gray-800 font-semibold border-b border-amber-200 bg-amber-500">
                          {t("premiumMembership")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {features.map((feature, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4 md:px-6 text-gray-700 text-sm md:text-base">
                            {feature.name}
                          </td>
                          <td className="py-4 px-4 md:px-6 text-center">
                            {feature.free ? (
                              <Check className="w-7 h-7 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-7 h-7 text-red-400 mx-auto" />
                            )}
                          </td>
                          <td className="py-4 px-4 md:px-6 text-center bg-amber-400">
                            {feature.premium ? (
                              <Check className="w-7 h-7 text-amber-800 mx-auto" />
                            ) : (
                              <X className="w-7 h-7 text-gray-400 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xl p-2 rounded-lg text-gray-500 text-sm text-center mb-6">
                  {t("communityAmbassadorsNote")}
                </p>

                {/* CTA Buttons */}
                <div className="text-center" >
                  <div>
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
                      {t("moreThanSubscription")}
                    </h1>
                    <div className="my-3">
  {(() => {
    const premiumPlan = planLIst.find((item) => {
      return (
        item.amt >= (planLIst[0]?.amt || 60) ||
        item.title.toLowerCase().includes("premium")
      );
    });

    if (!premiumPlan) return null;

    return (
      <button
        onClick={() => GetStartedHandler(0, premiumPlan.id)}
        className="bg-[#1f5799] text-center text-2xl text-white font-bold py-3 px-6 rounded-full border-3 border-amber-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
      >
        {t("becomeFoundingMember")}
      </button>
    );
  })()}
</div>

                  </div>
                </div>

                {/* Original Plan Cards - Hidden on desktop, visible on mobile */}
                <div className="mt-8 d-block d-md-none">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Available Plans
                  </h2>
                  <div className="row">
                    {planLIst?.map((item, index) => (
                      <div key={index} className="col-12 mb-4">
                        <div
                          className={`card card-rounded-1 ${
                            item.id === packageId && "ActivePlan"
                          }`}
                        >
                          <div className="card-body p-0">
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="mb-0 text-xl font-bold">
                                    {item.title}
                                  </h3>
                                  <h2 className="mb-0 text-3xl font-bold">
                                    {currency ? currency : "€"}
                                    {item.amt}
                                  </h2>
                                  <p className="fw-semi-bold mb-2">
                                    Per {item.day_limit} Days
                                  </p>
                                </div>
                                {item.id === packageId && (
                                  <div
                                    style={{ background: "#1F5799" }}
                                    className="popular-title flex items-center rounded-[5px]"
                                  >
                                    <h6
                                      style={{
                                        background: "#1F5799",
                                        borderRadius: "5px",
                                      }}
                                      className="card fw-medium m-0 text-white py-[5px] px-[10px]"
                                    >
                                      {t("active")}
                                    </h6>
                                    <button onClick={PalanDetailsHandler}>
                                      <MdOutlineErrorOutline className="text-white me-[10px] text-[20px]" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  GetStartedHandler(index, item.id)
                                }
                                style={{
                                  background: "#1F5799",
                                  color: "#ffffff",
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
                                className="btn text-[#ffffff] w-full my-3"
                              >
                                {t("getStarted")}
                              </button>
                              <div className="plans-includes">
                                <span>{t("includes")}:</span>
                              </div>
                              <ul className="list-unstyled p-0 mt-[15px]">
                                {item.description
                                  .split("\n")
                                  .map((line, idx) => (
                                    <li
                                      className="py-[8px] flex items-center"
                                      key={idx}
                                    >
                                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                      {line}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal - Keep original functionality with new design */}
      {isVisible && (
        <div
          onClick={() => toggleBottomSheet("PayMent")}
          className="w-full h-full fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {t("selectPaymentMethod")}
            </h3>

            {coin > 0 && (
              <div className="flex items-center justify-between mb-6 p-4 bg-amber-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <img src={wallet} alt="Wallet" className="w-8 h-8" />
                  <div>
                    <h6 className="m-0 font-semibold">{t("myWallet")}</h6>
                    <p className="m-0 text-sm text-gray-600">
                      {t("available")}: {currency || "€"}
                      {coin}
                    </p>
                  </div>
                </div>
                <div className="df-center gap-3">
                  <label className="switch">
                    <input
                      onClick={SwitchHandler}
                      type="checkbox"
                      checked={btnDis}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            )}

            <div className="max-h-[400px] overflow-y-auto pr-2">
              {payDetails.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setBorder(item.title);
                    setPId(item.id);
                  }}
                  className={`${
                    border === item.title
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  } mb-3 flex items-center cursor-pointer border-2 rounded-xl px-4 py-3 hover:border-blue-300 transition-colors`}
                >
                  <div className="flex items-center gap-3 flex-grow">
                    <img
                      src={imageBaseURL + item.img}
                      className="w-12 h-12 rounded-lg bg-gray-100 border p-2 object-contain"
                      alt={item.title}
                    />
                    <div className="mx-2">
                      <h4 className="m-0 font-semibold">{item.title}</h4>
                      <p className="font-medium text-sm text-gray-600">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`${
                      border === item.title
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    } w-6 h-6 border-2 rounded-full flex items-center justify-center`}
                  >
                    {border === item.title && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => SendHandler(border)}
              className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-full hover:shadow-lg mt-6 transition-all"
            >
              {t("continue")}
            </button>
          </div>
        </div>
      )}

      {/* Payment Gateway Components - Keep all as is */}
      {payId === "Razorpay" && button && (
        <Razorpay Amount={planLIst[id]?.amt} />
      )}
      {payId === "Paypal" && button && (
        <div
          onClick={() => setPayId("")}
          className="px-[15px] py-[15px] w-full h-full fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[30%] max-_430_:w-[100%] max-_768_:w-[90%] max-_1030_:w-[50%] max-_1500_:w-[40%] bg-white rounded-[15px] p-[15px]"
          >
            <Paypal Amount={planLIst[id]?.amt} />
          </div>
        </div>
      )}
      {payId === "Stripe" && button && (
        <div
          onClick={() => setPayId("")}
          className="px-[15px] py-[15px] w-full h-full fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[30%] max-_430_:w-[100%] max-_768_:w-[90%] max-_1030_:w-[50%] max-_1500_:w-[40%] bg-white rounded-[15px] p-[15px]"
          >
            <StripePayment Amount={planLIst[id]?.amt} />
          </div>
        </div>
      )}
      {payId === "PayStack" && button && (
        <div
          onClick={() => setPayId("")}
          className="px-[15px] py-[15px] w-full h-full fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-30 z-[999]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[30%] max-_430_:w-[100%] max-_768_:w-[90%] max-_1030_:w-[50%] max-_1500_:w-[40%] bg-white rounded-[15px] p-[15px]"
          >
            <PayStack Amount={planLIst[id]?.amt} />
          </div>
        </div>
      )}
      {payId === "FlutterWave" && button && (
        <FlutterWave Amount={planLIst[id]?.amt} />
      )}
      {payId === "SenangPay" && button && (
        <SenangPay Amount={planLIst[id]?.amt} />
      )}
      {payId === "Payfast" && button && <Payfast Amount={planLIst[id]?.amt} />}
      {payId === "Midtrans" && button && (
        <Midtrans Amount={planLIst[id]?.amt} />
      )}
      {payId === "2checkout" && button && (
        <Checkout Amount={planLIst[id]?.amt} />
      )}
      {payId === "Khalti Payment" && button && (
        <KhaltiPayment Amount={planLIst[id]?.amt} />
      )}
      {payId === "MercadoPago" && button && (
        <MercadoPagoCheckout Amount={planLIst[id]?.amt} />
      )}
      {payId === "Paytm" && button && (
        <PaytmPayment Amount={planLIst[id]?.amt} />
      )}

      {/* Plan Details Modal - Keep original functionality with slight styling update */}
      {isVisible2 && (
        <div
          onClick={PalanDetailsHandler}
          className="px-[15px] py-[15px] w-full h-full fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[20%] max-_430_:w-[100%] max-_768_:w-[75%] max-_1030_:w-[45%] max-_1500_:w-[35%] bg-white rounded-2xl px-6 py-4"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {t("planDetails")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <h6 className="m-0 text-gray-600">{t("paymentMethod")}</h6>
                <h6 className="m-0 font-semibold">{planData?.p_name}</h6>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-gray-200">
                <h6 className="m-0 text-gray-600">{t("transactionId")}</h6>
                <h6 className="m-0 font-semibold">{planData?.trans_id}</h6>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-gray-200">
                <h6 className="m-0 text-gray-600">{t("dateOfPurchase")}</h6>
                <h6 className="m-0 font-semibold">
                  {planData?.plan_start_date}
                </h6>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-gray-200">
                <h6 className="m-0 text-gray-600">{t("dateOfExpiry")}</h6>
                <h6 className="m-0 font-semibold">{planData?.plan_end_date}</h6>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-gray-200">
                <h6 className="m-0 text-gray-600">{t("membershipAmount")}</h6>
                <h6 className="m-0 font-semibold text-amber-600">
                  {currency ? currency : "€"}
                  {planData?.amount}
                </h6>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {planLIst.length === 0 && (
        <div className="w-[100%] h-[100vh] ms-[8rem] max-_991_:ms-0 bg-white fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 z-[555]">
          <div className="">
            <h2 className="">{t("Loading...")}</h2>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Upgrade;
/* jshint ignore:end */