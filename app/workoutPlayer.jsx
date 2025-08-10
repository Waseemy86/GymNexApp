import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, useColorScheme, View } from 'react-native';

export default function WorkoutPlayer() {
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(true);
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    let interval;
    if (active) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [active]);

  const endWorkout = () => {
    setActive(false);
    router.back(); // חזרה למסך הקודם
  };

  return (
    <View style={[styles.container, colorScheme === 'dark' && styles.dark]}>
      <Text style={styles.title}>אימון פעיל</Text>
      <Text style={styles.timer}>{seconds} שניות</Text>
      <Button title="סיים אימון" onPress={endWorkout} color="#e53935" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dark: {
    backgroundColor: '#222',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  timer: {
    fontSize: 48,
    marginBottom: 40,
    color: '#333',
  },
});