import React, { useContext, useEffect, useState } from 'react';
import {
    Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { MyContext } from '../Context/MyProvider';
import axios from 'axios';


const SplitForm = ({ fontSize, amount }) => {

    const { setPayClose, setPlanId, setTransactionId, page, setBuyCoin, paymentBaseURL } = useContext(MyContext);

    const [cardNumber, setCardnumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const [rates, setRates] = useState({});
    const [currency, setCurrency] = useState('EUR'); 
    const [convertedAmount, setConvertedAmount] = useState('');

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    // Fetch live exchange rates
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

    // Update converted amount when currency or base amount changes
    useEffect(() => {
        if (amount && currency && rates[currency]) {
            const converted = (parseFloat(amount) * rates[currency]).toFixed(2);
            setConvertedAmount(converted);
        }
    }, [amount, currency, rates]);

    // Enable/disable button based on field validation
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
       <form onSubmit={handleSubmit} className="DemoWrapper d-flex flex-column w-[100%]">
    {/* Currency Dropdown */}
    <label className="mt-[15px]">
        <span className="text-[18px] font-[500] text-[#222222]">Currency</span> <br />
        <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border-[2px] border-[#C89A3D] text-[#333333] w-[100%] bg-white outline-none py-[6px] px-[5px] rounded-[5px] mt-[5px]"
        >
            {['EUR', 'USD', 'GBP', 'CAD', 'AUD'].map((code) => (
                <option key={code} value={code}>
                    {code}
                </option>
            ))}
        </select>
    </label>

    <label className='mt-[10px]'>
        <span className='text-[18px] font-[500] text-[#222222]'>Converted Amount</span> <br />
        <input
            type="text"
            disabled
            value={convertedAmount ? `${convertedAmount} ${currency}` : ''}
            className='border-[2px] border-[#C89A3D] bg-[#F7F5F2] text-[#333333] w-[100%] outline-none py-[6px] px-[5px] rounded-[5px] mt-[5px]'
        />
    </label>

    <label>
        <span className='text-[18px] font-[500] text-[#222222]'>Card number</span> <br />
        <input
            type="text"
            placeholder="1234 1234 1234 1234"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength="19"
            className='border-[2px] border-[#C89A3D] text-[#333333] w-[100%] bg-white outline-none py-[3px] px-[5px] rounded-[5px] mt-[5px]'
        />
    </label>

    <div className="flex justify-between items-center mt-[10px]">
        <label className='w-[40%]'>
            <span className='text-[18px] font-[500] text-[#222222]'>Expiration date</span>
            <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange} 
                maxLength="5"  
                className='border-[2px] border-[#C89A3D] text-[#333333] w-[100%] bg-white outline-none py-[3px] px-[5px] rounded-[5px] mt-[5px]'
            />
        </label>

        <label className='w-[40%]'>
            <span className='text-[18px] font-[500] text-[#222222]'>CVC</span>
            <input 
                type='number' 
                onChange={(e) => setCvc(e.target.value)} 
                placeholder='CVC' 
                className='border-[2px] border-[#C89A3D] text-[#333333] w-[100%] bg-white outline-none py-[3px] px-[5px] rounded-[5px] mt-[5px]' 
            />
        </label>
    </div>

    <button
        type="submit"
        disabled={isButtonDisabled}
        className={`mt-[20px] text-white text-[18px] py-[5px] rounded-[5px] ${
            isButtonDisabled 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#1F5799]'
        }`}
    >
        Pay {convertedAmount ? `${convertedAmount} ${currency}` : amount ? `${amount} EUR` : ""}
    </button>
</form>

    );
};

// Load Stripe API key
const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");


export const StripePayment = ({ Amount }) => {
    const [elementFontSize, setElementFontSize] = useState(() =>
        window.innerWidth < 450 ? "14px" : "18px"
    );

    useEffect(() => {
        const handleResize = () => {
            setElementFontSize(window.innerWidth < 450 ? "14px" : "18px");
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="Checkout w-[100%] text-start">
            <Elements stripe={stripePromise}>
                <SplitForm fontSize={elementFontSize} amount={Amount} />
            </Elements>
        </div>
    );
};
/* jshint ignore:end */