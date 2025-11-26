import { useContext, useEffect } from 'react';
import { MyContext } from '../Context/MyProvider';

export const CallListener = () => {
  const {
    setIsVoiceCalling,
    setIsVideoCalling,
    setCallChannelName,
    setChatId,
    setChatUserName,
    setProfilePic,
  } = useContext(MyContext);

  useEffect(() => {
    const handler = (event) => {
      const data = event?.notification?.additionalData || event?.data || {};
      const { Audio, vcId, id, name, popic } = data;

      if (!Audio && !vcId) return;

      const channel = Audio || vcId;

      setChatId(id);
      setChatUserName(name);
      setProfilePic(popic);
      setCallChannelName(channel);
      setIsVoiceCalling(!!Audio);
      setIsVideoCalling(!Audio);
    };

    // Wait for OneSignal to load
    const init = () => {
      if (window.OneSignal) {
        window.OneSignal.on('notificationDisplay', handler);
        window.OneSignal.on('notificationClick', handler);
      }
    };

    // Try now
    init();

    // Or wait for load
    window.addEventListener('load', init);

    return () => {
      if (window.OneSignal) {
        window.OneSignal.off('notificationDisplay', handler);
        window.OneSignal.off('notificationClick', handler);
      }
      window.removeEventListener('load', init);
    };
  }, [
    setIsVoiceCalling,
    setIsVideoCalling,
    setCallChannelName,
    setChatId,
    setChatUserName,
    setProfilePic,
  ]);

  return null;
};