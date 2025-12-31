import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookiePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    const handleOpenCookieSettings = () => {
      setShowSettings(true);
      setShowPopup(true);
    };
    window.addEventListener('openCookieSettings', handleOpenCookieSettings);
    return () => window.removeEventListener('openCookieSettings', handleOpenCookieSettings);
  }, []);

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setShowPopup(true);
    } else {
      try {
        const savedPrefs = JSON.parse(hasConsent);
        setPreferences(savedPrefs);
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
      }
    }
  }, []);

  const applyCookies = (prefs) => {
    if (prefs.analytics) console.log('Analytics cookies enabled');
    if (prefs.marketing) console.log('Marketing cookies enabled');
    if (prefs.preferences) console.log('Preference cookies enabled');
  };

  const handleAcceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true, preferences: true };
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    applyCookies(allAccepted);
    setShowPopup(false);
  };

  const handleNecessaryOnly = () => {
    const necessaryOnly = { necessary: true, analytics: false, marketing: false, preferences: false };
    setPreferences(necessaryOnly);
    localStorage.setItem('cookieConsent', JSON.stringify(necessaryOnly));
    applyCookies(necessaryOnly);
    setShowPopup(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    applyCookies(preferences);
    setShowPopup(false);
    setShowSettings(false);
  };

  const handleToggle = (cookieType) => {
    if (cookieType === 'necessary') return;
    setPreferences(prev => ({ ...prev, [cookieType]: !prev[cookieType] }));
  };

  // Don't return null if no consent exists - always show until action taken
  const hasConsent = localStorage.getItem('cookieConsent');
  if (hasConsent && !showPopup) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-[99999]"></div>
      
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-96 bg-white rounded-lg shadow-xl z-[100000] border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {showSettings ? 'Cookie Settings' : 'Cookie Consent'}
            </h3>
            {/* Hide close button if no consent yet */}
            {hasConsent ? (
              <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            ) : (
              <div className="w-5"></div> // Empty space to maintain layout
            )}
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              We use cookies to enhance your browsing experience, analyze site traffic, 
              and personalize content. By clicking "Accept All", you consent to our use of cookies.
            </p>
            
            {showSettings && (
              <div className="space-y-4 mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 mr-4">
                    <p className="font-medium text-gray-900">Necessary Cookies</p>
                    <p className="text-sm text-gray-500 mt-1">Essential for the website to function</p>
                  </div>
                  <input type="checkbox" checked={preferences.necessary} disabled className="h-5 w-5 text-blue-600 rounded border-gray-300 opacity-50 cursor-not-allowed" />
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex-1 mr-4">
                    <p className="font-medium text-gray-900">Analytics Cookies</p>
                    <p className="text-sm text-gray-500 mt-1">Help us understand how visitors interact</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={preferences.analytics} onChange={() => handleToggle('analytics')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex-1 mr-4">
                    <p className="font-medium text-gray-900">Marketing Cookies</p>
                    <p className="text-sm text-gray-500 mt-1">Used to deliver relevant advertisements</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={preferences.marketing} onChange={() => handleToggle('marketing')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex-1 mr-4">
                    <p className="font-medium text-gray-900">Preference Cookies</p>
                    <p className="text-sm text-gray-500 mt-1">Remember your settings and preferences</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={preferences.preferences} onChange={() => handleToggle('preferences')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 text-sm mt-4">
              <Link to="/page/privacy_policy_" className="text-blue-600 hover:text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
              <Link to="/page/cookie_policy" className="text-blue-600 hover:text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">Cookie Policy</Link>
              {/* <button onClick={() => window.open('https://www.cookiesandyou.com', '_blank')} className="text-blue-600 hover:text-blue-800 hover:underline">Learn More</button> */}
            </div>
          </div>

          <div className="space-y-3">
            {showSettings ? (
              <>
                <button onClick={handleSaveSettings} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium">
                  Save Settings
                </button>
                <button onClick={() => setShowSettings(false)} className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 font-medium">
                  Back to Cookie Consent
                </button>
              </>
            ) : (
              <>
                <button onClick={handleAcceptAll} className="w-full bg-blue-600 text-white py-3 px-4 rounded-full hover:bg-blue-700 font-medium">
                  Accept All Cookies
                </button>
                <div className="grid grid-cols-2 gap-1">
                  <button onClick={handleNecessaryOnly} className="w-full bg-white text-gray-800 py-3 px-2 rounded-full border border-gray-300 hover:bg-gray-50 font-medium">
                    Necessary Only
                  </button>
                  <button onClick={() => setShowSettings(true)} className="w-full bg-gray-800 text-white py-3 px-4 rounded-full  hover:bg-gray-900 font-medium">
                    Customize
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePopup;