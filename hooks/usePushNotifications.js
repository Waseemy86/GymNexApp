import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

export default function usePushNotifications() {
  const [token, setToken] = useState(null);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermission(status);
      if (status === 'granted') {
        const expoToken = (await Notifications.getExpoPushTokenAsync()).data;
        setToken(expoToken);
      }
    })();
  }, []);

  return { token, permission };
}