import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setPermission(status);
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    })();
  }, []);

  return { location, permission };
}