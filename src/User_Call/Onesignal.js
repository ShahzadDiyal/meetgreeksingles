/* jshint esversion: 6 */
/* jshint esversion: 8*/
import axios from 'axios';
import { useEffect, useRef } from 'react';

const Onesignal = ({ Id, message, receiverId, channel, title, img, type }) => {
    const onesignalAppId = "720a0530-a6f1-42b6-8725-f1a47dc284f3";
    const onesignalKey = "key os_v2_app_oifakmfg6fblnbzf6gsh3que6pphtnhd5qtuigvhaqjgm4lazx7e4hgjtcmwfplkut5oy2hmblv5hujfasbpprwmon4zwulqih4dlsy";
    
    const notificationSent = useRef(false);

    const sendPushNotification = async () => {
        if (notificationSent.current || !window.OneSignal) return;

        let Data;
        if (type === "Audio") {
            Data = { Audio: channel, name: title, popic: img, id: Id };
        } else {
            Data = { vcId: channel, name: title, popic: img, id: Id };
        }

        try {
            await axios.post('https://onesignal.com/api/v1/notifications', {
                app_id: onesignalAppId,
                filters: [{ field: 'tag', key: 'user_id', value: receiverId }],
                headings: { en: title },
                contents: { en: message },
                data: Data,
                content_available: false,
            }, {
                headers: { Authorization: onesignalKey },
            });
            
            notificationSent.current = true;
            console.log("Notification sent successfully");
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    useEffect(() => {
        if (message && receiverId && !notificationSent.current) {
            sendPushNotification();
        }
    }, [message, receiverId]);

    return null;
};

export default Onesignal;