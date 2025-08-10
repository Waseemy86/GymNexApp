import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../src/constants/colors';

// קובץ זה מגדיר את העיצוב והסדר של הניווט התחתון.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primaryGreen,
        tabBarInactiveTintColor: COLORS.darkGray,
        tabBarStyle: {
          backgroundColor: COLORS.primaryWhite,
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
          paddingBottom: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'dashboard') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'discovery') iconName = focused ? 'compass' : 'compass-outline';
          else if (route.name === 'nutrition') iconName = focused ? 'restaurant' : 'restaurant-outline';
          else if (route.name === 'profile') iconName = focused ? 'person-circle' : 'person-circle-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'בית' }} />
      <Tabs.Screen name="discovery" options={{ title: 'גילוי' }} />
      <Tabs.Screen name="nutrition" options={{ title: 'תזונה' }} />
      <Tabs.Screen name="profile" options={{ title: 'פרופיל' }} />
    </Tabs>
  );
}