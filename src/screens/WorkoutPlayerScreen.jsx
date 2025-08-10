import { Video } from 'expo-av'; // דורש expo-av
import * as Location from 'expo-location'; // דורש expo-location
import { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';

const REST_TIME = 45;
const { width } = Dimensions.get('window');

const WorkoutPlayerScreen = ({ route, navigation }) => {
  const { workout } = route.params;
  const videoRef = useRef(null);

  // שירותי מיקום
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  if (!workout || !workout.exercises || workout.exercises.length === 0) {
    useEffect(() => {
      Alert.alert("שגיאה", "לא התקבל מידע על האימון.", [{ text: "חזור", onPress: () => navigation.goBack() }]);
    }, []);
    return <View style={styles.container} />;
  }

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(REST_TIME);

  const timerAnimation = useSharedValue(width);
  const currentExercise = workout.exercises[currentExerciseIndex];

  useEffect(() => {
    if (!isResting) return;

    timerAnimation.value = width;
    timerAnimation.value = withTiming(0, { duration: REST_TIME * 1000, easing: Easing.linear });

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isResting]);

  const animatedTimerStyle = useAnimatedStyle(() => ({
    width: timerAnimation.value,
  }));

  const handleNext = () => {
    setIsResting(false);
    setTimeLeft(REST_TIME);

    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
    } else {
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
      } else {
        Alert.alert("כל הכבוד!", "האימון הושלם בהצלחה.", [{ text: "סיים", onPress: () => navigation.goBack() }]);
      }
    }
  };

  const handleSetComplete = () => {
    setIsResting(true);
  };

  // דוגמת וידאו
  const mockVideoUrl = 'https://videos.pexels.com/video-files/4753995/4753995-hd_1080_1920_25fps.mp4';

  return (
    <View style={styles.container}>
      {/* נגן וידאו ברקע */}
      <Video
        ref={videoRef}
        source={{ uri: mockVideoUrl }}
        style={styles.video}
        isMuted
        shouldPlay
        isLooping
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <View style={styles.header}>
        <Text style={styles.progressText}>{`תרגיל ${currentExerciseIndex + 1}/${workout.exercises.length}`}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close-circle" size={40} color={COLORS.primaryWhite} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {!isResting ? (
          <Animated.View>
            <Text style={styles.exerciseName}>{currentExercise.exerciseName}</Text>
            <Text style={styles.setInfo}>{`סט ${currentSet} מתוך ${currentExercise.sets}`}</Text>
            <Text style={styles.repInfo}>{currentExercise.reps}</Text>
          </Animated.View>
        ) : (
          <Animated.View>
            <Text style={styles.restTitle}>מנוחה</Text>
            <Text style={styles.timerText}>{timeLeft}</Text>
          </Animated.View>
        )}
        {/* הצגת מיקום */}
        <View style={{ padding: 10 }}>
          <Text style={{ color: '#888', fontSize: 12 }}>
            {location ? `המיקום שלך: ${location.coords.latitude}, ${location.coords.longitude}` : 'מיקום לא זמין'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        {isResting ? (
          <View style={styles.timerBarContainer}>
            <Animated.View style={[styles.timerBar, animatedTimerStyle]} />
            <TouchableOpacity style={styles.skipRestButton} onPress={handleNext}>
              <Text style={styles.skipRestText}>דלג</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.doneButton} onPress={handleSetComplete}>
            <Icon name="checkmark-circle-outline" size={80} color={COLORS.primaryGreen} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.charcoal },
  video: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(44, 62, 80, 0.8)' },
  header: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 },
  progressText: { color: COLORS.primaryWhite, fontSize: 16, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, },
  contentContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, },
  exerciseName: { fontSize: 42, fontWeight: 'bold', color: COLORS.primaryWhite, textAlign: 'center', marginBottom: 10, },
  setInfo: { fontSize: 24, color: COLORS.lightGray, textAlign: 'center', },
  repInfo: { fontSize: 72, fontWeight: 'bold', color: COLORS.primaryGreen, textAlign: 'center', marginTop: 10, },
  restTitle: { fontSize: 42, fontWeight: 'bold', color: COLORS.primaryWhite, textAlign: 'center', marginBottom: 10, },
  timerText: { fontSize: 90, fontWeight: 'bold', color: COLORS.accentBlue, textAlign: 'center', },
  footer: { height: 120, justifyContent: 'center', alignItems: 'center', },
  doneButton: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primaryWhite, borderRadius: 40, },
  timerBarContainer: { height: 50, width: '100%', backgroundColor: COLORS.darkGray, justifyContent: 'center' },
  timerBar: { height: '100%', backgroundColor: COLORS.accentBlue, position: 'absolute' },
  skipRestButton: { position: 'absolute', alignSelf: 'center' },
  skipRestText: { color: COLORS.primaryWhite, fontWeight: 'bold', fontSize: 18 }
});

export default WorkoutPlayerScreen;