// src/utils/OneSignalInit.js
let isInitialized = false;

export const initOneSignal = (appId, userId) => {
  return new Promise((resolve) => {
    if (!window.OneSignal) {
      console.warn("OneSignal not loaded");
      resolve();
      return;
    }

    if (isInitialized) {
      console.log("OneSignal already initialized");
      if (userId) {
        window.OneSignal.setExternalUserId(userId);
      }
      resolve();
      return;
    }

    window.OneSignal.init({
      appId: appId,
      allowLocalhostAsSecureOrigin: true,
    });

    window.OneSignal.on('initialized', () => {
      console.log("OneSignal initialized successfully");
      isInitialized = true;
      if (userId) {
        window.OneSignal.setExternalUserId(userId);
      }
      resolve();
    });

    window.OneSignal.on('initializationFailed', (error) => {
      console.error("OneSignal initialization failed:", error);
      resolve();
    });
  });
};