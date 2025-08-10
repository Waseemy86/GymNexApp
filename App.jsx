import { Slot } from 'expo-router';
import 'react-native-gesture-handler';

// ב-Expo Router, הקובץ הזה משמש בעיקר לטעינת הגדרות גלובליות.
//  <Slot /> יטען אוטומטית את הניווט שהגדרנו ב- app/_layout.jsx
export default function App() {
  return <Slot />;
}