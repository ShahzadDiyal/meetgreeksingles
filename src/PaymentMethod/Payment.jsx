/* jshint esversion: 6 */
/* jshint ignore:start */

import React, { useContext, useEffect, useState } from 'react';
import wallet from "../Icon/wallet.svg";
import { MyContext } from '../Context/MyProvider';
import axios from 'axios';
import Razorpay from './Razorpay';
import Paypal from './PayPal';
import PayStack from './PayStack';
import FlutterWave from './FlutterWave';
import SenangPay from './SenangPay';
import Payfast from './Payfast';
import Midtrans from './Midtrans';
import Checkout from './Checkout';
import KhaltiPayment from './Khalti_Payment';
import MercadoPagoCheckout from './MercadoPago';
import PaytmPayment from './PaytmPayment';
import { showTost } from "../showTost";
import { StripePayment } from './Stripe';
const Payment = ({ Amount }) => {
    const { basUrl, imageBaseURL, setToggleButton, setAmount, payClose, page, buyCoin, setWalletCoin, setBuyCoin, button, setButton } = useContext(MyContext);

    const [input, setInput] = useState();
    const [border, setBorder] = useState();
    const [payDetails, setPayDetails] = useState([]);
    const [payId, setPayId] = useState();
    const [btnDis, setBtnDis] = useState(false);
    const [amount, setamount] = useState();
    const [coin, setCoin] = useState();

    const PurchaseHandler = (id) => {
        if (input || Amount) {
            if (btnDis) {
                setWalletCoin(Amount);
                setamount(Amount - coin);
            } else {
                setAmount(input);
                if (Amount) {
                    setamount(Amount);
                } else {
                    setamount(input);
                    localStorage.setItem("Amount", input);
                }
            }

            if (!btnDis) {
                if (border) {
                    setPayId(id);
                    setButton(true);
                } else {
                    showTost({ title: "Please Select Payment Method" });
                }
            } else {
                if (Amount > coin) {
                    showTost({ title: "Please Add Balance..!!" });
                    setToggleButton(false);
                } else {
                    setBuyCoin("PaymentDone");
                }
            }
        } else {
            showTost({ title: "Please Enter Amount" });
        }
    };

    useEffect(() => {
        axios.post(`${basUrl}paymentgateway.php`)
            .then((res) => {
                setPayDetails(res.data.paymentdata);
            });

        const localData = localStorage.getItem("Register_User");

        if (localData) {
            const userData = JSON.parse(localData);

            axios.post(`${basUrl}wallet_report.php`, { uid: userData.id })
                .then((res) => {
                    if (res.data.Result === "true") {
                        setCoin(res.data.wallet);
                    }
                });
        }
    }, [basUrl]);

    useEffect(() => {
        if (payClose || buyCoin) {
            setInput("");
            setBorder("");
            setAmount("");
            setPayId("");
            setButton(false);
        }
    }, [payClose, buyCoin, setAmount, setButton]);

    const SwitchHandler = () => {
        if (btnDis) {
            setBtnDis(false);
        } else {
            setBtnDis(true);
        }
        setBorder("");
    };

    const SelectPaymentMethodHandle = (item) => {
        setBtnDis(false);
        setBorder(item);
    };

    return (
        <div>
  <div
    onClick={() => setToggleButton(false)}
    className="bottom-sheet2 w-full h-full fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bottom-sheet-content2 bg-[#F7F5F2] rounded-[15px] p-[20px] w-[95%] max-w-[420px]"
    >

      {/* WALLET INPUT */}
      {page !== "BuyCoin" && (
        <div>
          <h6 className="text-[#222222] font-[600] mb-[8px]">
            Add Wallet Amount
          </h6>

          <div className="flex items-center gap-[12px] border-[2px] border-[#C89A3D] px-[15px] py-[10px] rounded-[10px]">
            <img src={wallet} alt="" />
            <input
              type="number"
              onChange={(e) => setInput(e.target.value)}
              className="outline-none w-full text-[#1F5799] font-[600] bg-transparent"
              placeholder="Enter Amount"
            />
          </div>
        </div>
      )}

      {/* WALLET BALANCE */}
      {page === "BuyCoin" && coin > 0 && (
        <div className="flex items-center justify-between mt-[10px]">
          <div className="flex items-center gap-[10px]">
            <img src={wallet} alt="" />
            <h6 className="m-0 text-[#222222] font-[600]">
              My Wallet (${btnDis ? coin - Amount : coin})
            </h6>
          </div>

          <label className="switch">
            <input onClick={SwitchHandler} type="checkbox" checked={btnDis} />
            <span className="slider round"></span>
          </label>
        </div>
      )}

      {/* PAYMENT METHOD TITLE */}
      {page === "Wallet" && (
        <h6 className="text-[#333333] text-[15px] mt-[15px] mb-[10px]">
          Select Payment Method
        </h6>
      )}

      {/* PAYMENT METHODS LIST */}
      <div className="scroll-container2 h-[350px] mt-[10px]">
        {payDetails.map((item) => (
          <div
            key={item.id}
            onClick={() => SelectPaymentMethodHandle(item.title)}
            className={`mb-[10px] flex items-center justify-between cursor-pointer border-[2px] rounded-[10px] px-[12px] py-[12px]
            ${
              border === item.title
                ? "border-[#1F5799] bg-[#EAF1FB]"
                : "border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-[10px]">
              <img
                src={imageBaseURL + item.img}
                className="border-[2px] w-[50px] h-[50px] rounded-[10px] bg-gray-200"
                alt=""
              />
              <div className="mx-[10px] w-[80%]">
                <h4 className="m-0 text-[#222222] font-[600]">
                  {item.title}
                </h4>
                <p className="text-[#333333] text-[14px]">
                  {item.subtitle}
                </p>
              </div>
            </div>

            {/* RADIO DOT */}
            <div
              className={`w-[22px] h-[22px] border-[2px] rounded-full p-[3px]
              ${
                border === item.title
                  ? "border-[#1F5799]"
                  : "border-gray-400"
              }`}
            >
              <span
                className={`duration-300 w-full h-full rounded-full block
                ${border === item.title ? "bg-[#1F5799]" : ""}`}
              ></span>
            </div>
          </div>
        ))}
      </div>

      {/* CONTINUE BUTTON */}
      <button
        onClick={() => PurchaseHandler(border)}
        className="bg-[#1F5799] hover:bg-[#17477C] text-white w-full font-[600] rounded-full py-[12px] mt-[10px]"
      >
        {btnDis ? "Wallet Pay" : "Continue"}
      </button>
    </div>
  </div>

  {/* ================= PAYMENT POPUPS ================= */}

  {payId === "Razorpay" && button && <Razorpay Amount={amount} />}

  {payId === "Paypal" && button && (
    <div
      onClick={() => setPayId("")}
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[999]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#F7F5F2] rounded-[15px] p-[20px] w-[90%] max-w-[420px]"
      >
        <Paypal Amount={amount} />
      </div>
    </div>
  )}

  {payId === "Stripe" && button && (
    <div
      onClick={() => setPayId("")}
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[999]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#F7F5F2] rounded-[15px] p-[20px] w-[90%] max-w-[420px]"
      >
        <StripePayment Amount={amount} />
      </div>
    </div>
  )}

  {payId === "PayStack" && button && <PayStack Amount={amount} />}
  {payId === "FlutterWave" && button && <FlutterWave Amount={amount} />}
  {payId === "SenangPay" && button && <SenangPay Amount={amount} />}
  {payId === "Payfast" && button && <Payfast Amount={amount} />}
  {payId === "Midtrans" && button && <Midtrans Amount={amount} />}
  {payId === "2checkout" && button && <Checkout Amount={amount} />}
  {payId === "Khalti Payment" && button && <KhaltiPayment Amount={amount} />}
  {payId === "MercadoPago" && button && <MercadoPagoCheckout Amount={amount} />}
  {payId === "Paytm" && button && <PaytmPayment Amount={amount} />}
</div>

    )
}

export default Payment
/* jshint ignore:end */
