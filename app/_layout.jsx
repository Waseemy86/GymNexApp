import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#333',
        animation: 'fade',
      }}
    >
      {/* מסך הטאבים הראשי */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      {/* מסך אימון כמודאל */}
      <Stack.Screen
        name="workoutPlayer"
        options={{
          presentation: 'modal',
          title: 'אימון פעיל',
          headerShown: true,
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}