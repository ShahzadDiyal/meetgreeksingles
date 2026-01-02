import React, { useContext, useEffect, useState } from 'react';
import {
    Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { MyContext } from '../Context/MyProvider';
import axios from 'axios';
import { useTranslation } from "react-i18next";

const SplitForm = ({ fontSize, amount }) => {
    const { setPayClose, setPlanId, setTransactionId, page, setBuyCoin, paymentBaseURL } = useContext(MyContext);
    const {t} = useTranslation();

    const [cardNumber, setCardnumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const [rates, setRates] = useState({});
    const [currency, setCurrency] = useState('EUR'); 
    const [convertedAmount, setConvertedAmount] = useState('');

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const res = await axios.get('https://api.exchangerate-api.com/v4/latest/eur');
                setRates(res.data.rates);
            } catch (err) {
                console.error('Error fetching currency rates:', err);
            }
        };
        fetchRates();
    }, []);

    useEffect(() => {
        if (amount && currency && rates[currency]) {
            const converted = (parseFloat(amount) * rates[currency]).toFixed(2);
            setConvertedAmount(converted);
        }
    }, [amount, currency, rates]);

    useEffect(() => {
        const isCardValid = cardNumber.replace(/\s/g, '').length === 16;
        const isExpiryValid = /^(\d{2})\/(\d{2})$/.test(expiry);
        const isCvcValid = cvc.length === 3 || cvc.length === 4;
        const isAmountValid = convertedAmount && parseFloat(convertedAmount) > 0;

        setIsButtonDisabled(!(isCardValid && isExpiryValid && isCvcValid && isAmountValid));
    }, [cardNumber, expiry, cvc, convertedAmount]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const number = cardNumber.replace(/\s+/g, '');
        const month = expiry.split("/")[0];
        const year = expiry.split("/")[1];

        const UserData = localStorage.getItem("Register_User");
        if (UserData) {
            const UserDetails = JSON.parse(UserData);

            axios.post(`${paymentBaseURL}react_stripe/token.php`,
                {
                    "card_number": number,
                    "exp_month": month,
                    "exp_year": `20${year}`,
                    "cvc": cvc,
                    "custName": UserDetails.name,
                    "custEmail": UserDetails.email,
                    "amount": amount,
                    "currency": currency
                }
            )
                .then((res) => {
                    if (res.data.Result === "true") {
                        if (page === "Upgrade") {
                            setPlanId("PaymentDone");
                            setTransactionId(res.data.Transaction_id);
                        } else if (page === "Wallet") {
                            setPayClose("PaymentDone");
                        } else {
                            setBuyCoin("PaymentDone");
                        }
                    }
                });
        }
    };

    const handleCardNumberChange = (e) => {
        let value = e.target.value;
        const cleanedValue = value.replace(/\D/g, '');
        const formattedValue = cleanedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardnumber(formattedValue);
    };

    const handleExpiryChange = (e) => {
        const value = e.target.value;
        const cleanedValue = value.replace(/\D/g, '');
        const formattedValue = cleanedValue.replace(/(\d{2})(?=\d)/g, '$1/');
        setExpiry(formattedValue);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{t("Card Payment")}</h2>
                <p className="text-gray-600 text-sm">{t("Enter your card details securely")}</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        {t("Currency")}
                    </label>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C89A3D] focus:border-transparent"
                    >
                        {['EUR', 'USD', 'GBP', 'CAD', 'AUD'].map((code) => (
                            <option key={code} value={code}>
                                {code}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        {t("Amount")}
                    </label>
                    <input
                        type="text"
                        disabled
                        value={convertedAmount ? `${convertedAmount} ${currency}` : ''}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 font-medium"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        {t("Card Number")}
                    </label>
                    <input
                        type="text"
                        placeholder={t("1234 1234 1234 1234")}
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength="19"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C89A3D] focus:border-transparent"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            {t("Expiry Date (MM/YY)")}
                        </label>
                        <input
                            type="text"
                            placeholder={t("MM/YY")}
                            value={expiry}
                            onChange={handleExpiryChange}
                            maxLength="5"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C89A3D] focus:border-transparent"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            {t("CVC")}
                        </label>
                        <input
                            type="number"
                            onChange={(e) => setCvc(e.target.value)}
                            placeholder={t("123")}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C89A3D] focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isButtonDisabled}
                className={`w-full mt-6 py-3 rounded-lg font-medium text-base transition-colors ${
                    isButtonDisabled 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-[#1F5799] text-white hover:bg-[#174173]'
                }`}
            >
                {t("Pay")} {convertedAmount ? `${convertedAmount} ${currency}` : amount ? `${amount} EUR` : ""}
            </button>
        </form>
    );
};

const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");

export const StripePayment = ({ Amount }) => {
    const [elementFontSize, setElementFontSize] = useState(() =>
        window.innerWidth < 450 ? "14px" : "16px"
    );

    useEffect(() => {
        const handleResize = () => {
            setElementFontSize(window.innerWidth < 450 ? "14px" : "16px");
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="w-full h-full">
            <div className="md:hidden h-full overflow-y-auto">
                <div className="min-h-full bg-white p-4">
                    <Elements stripe={stripePromise}>
                        <SplitForm fontSize={elementFontSize} amount={Amount} />
                    </Elements>
                </div>
            </div>

            <div className="hidden md:block">
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
                    <Elements stripe={stripePromise}>
                        <SplitForm fontSize={elementFontSize} amount={Amount} />
                    </Elements>
                </div>
            </div>
        </div>
    );
};
/* jshint ignore:end */     