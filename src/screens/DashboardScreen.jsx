import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Card } from '@rneui/themed';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { ProgressChart } from 'react-native-chart-kit';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateWorkout } from '../services/apiService';
import { COLORS } from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

// Mock data
const focusTodayData = { title: 'פוקוס היום', icon: 'barbell-outline', value: 'שיא אישי בסקוואט: 95 ק"ג' };
const quoteData = { quote: "הכאב שאתה מרגיש היום יהיה הכוח שתרגיш מחר.", author: "לא ידוע" };

const DashboardScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingWorkout, setGeneratingWorkout] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const storedUser = await AsyncStorage.getItem('userData');
          if (storedUser) {
            setUserData(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }, [])
  );

  const handleGenerateWorkout = async () => {
    setGeneratingWorkout(true);
    try {
      const newWorkout = await generateWorkout();
      navigation.navigate('WorkoutPlayer', { workout: newWorkout });
    } catch (error) {
      Alert.alert("שגיאה ביצירת אימון", "לא ניתן היה ליצור אימון כרגע. אנא ודא שהשלמת את פרטי הפרופיל שלך (גובה, משקל, מטרה).");
    } finally {
      setGeneratingWorkout(false);
    }
  };

  if (loading) {
    return <View style={styles.loaderContainer}><ActivityIndicator size="large" color={COLORS.primaryGreen} /></View>;
  }

  const progress = (userData?.workoutsCompleted || 3) / 5;
  const chartData = { data: [progress] };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Animated.View style={styles.header} entering={FadeInUp.duration(800)}>
        <Text style={styles.greeting}>היי, {userData?.firstName || 'מתאמן'}!</Text>
        <Text style={styles.subtitle}> סיכום הפעילות שלך להיום</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(800)}>
        <TouchableOpacity style={styles.mainActionCard} onPress={handleGenerateWorkout} disabled={generatingWorkout}>
          <View style={styles.mainActionIconContainer}>
            {generatingWorkout ? <ActivityIndicator color={COLORS.primaryWhite} /> : <Icon name="play-circle-outline" size={50} color={COLORS.primaryWhite} />}
          </View>
          <View style={styles.mainActionTextContainer}>
            <Text style={styles.mainActionTitle}>{generatingWorkout ? 'יוצר אימון...' : 'האימון היומי ממתין'}</Text>
            <Text style={styles.mainActionSubtitle}>אימון מותאם אישית על ידי AI</Text>
          </View>
          <Icon name="chevron-forward-outline" size={30} color={COLORS.primaryWhite} />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.widgetsContainer}>
        <Animated.View style={styles.widget} entering={FadeInDown.delay(400).duration(800)}>
          <Text style={styles.widgetTitle}>התקדמות שבועית</Text>
          <ProgressChart data={chartData} width={120} height={120} strokeWidth={12} radius={45} chartConfig={{ backgroundGradientFrom: COLORS.lightGray, backgroundGradientTo: COLORS.lightGray, color: (opacity = 1) => `rgba(39, 174, 96, ${opacity})` }} hideLegend={true} />
          <Text style={styles.progressText}>{`${userData?.workoutsCompleted || 3}/${5}`}</Text>
        </Animated.View>
        <Animated.View style={[styles.widget, { backgroundColor: COLORS.charcoal }]} entering={FadeInDown.delay(600).duration(800)}>
          <Text style={[styles.widgetTitle, { color: COLORS.primaryWhite }]}>{focusTodayData.title}</Text>
          <Icon name={focusTodayData.icon} size={40} color={COLORS.primaryGreen} style={styles.focusIcon}/>
          <Text style={[styles.widgetValue, { color: COLORS.primaryWhite }]}>{focusTodayData.value}</Text>
        </Animated.View>
      </View>

       <Animated.View entering={FadeInDown.delay(800).duration(800)}>
        <Card containerStyle={styles.quoteCard}>
          <Icon name="chatbubble-ellipses-outline" size={24} color={COLORS.primaryGreen} style={styles.quoteIcon}/>
          <Text style={styles.quoteText}>"{quoteData.quote}"</Text>
          <Text style={styles.quoteAuthor}>- {quoteData.author}</Text>
        </Card>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.lightGray },
    scrollContent: { padding: 20, paddingBottom: 40 },
    header: { marginBottom: 30 },
    greeting: { fontSize: 28, fontWeight: 'bold', color: COLORS.charcoal },
    subtitle: { fontSize: 16, color: COLORS.darkGray, marginTop: 4 },
    mainActionCard: { backgroundColor: COLORS.primaryGreen, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 20, elevation: 5, shadowColor: COLORS.darkGreen, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
    mainActionIconContainer: { marginRight: 15, width: 50, alignItems: 'center' },
    mainActionTextContainer: { flex: 1 },
    mainActionTitle: { color: COLORS.primaryWhite, fontSize: 18, fontWeight: 'bold' },
    mainActionSubtitle: { color: COLORS.primaryWhite, fontSize: 14, opacity: 0.9 },
    widgetsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    widget: { width: '48%', backgroundColor: COLORS.primaryWhite, borderRadius: 20, padding: 15, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: COLORS.mediumGray, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    widgetTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.charcoal, marginBottom: 10 },
    progressText: { position: 'absolute', fontSize: 22, fontWeight: 'bold', color: COLORS.charcoal },
    focusIcon: { marginVertical: 10 },
    widgetValue: { fontSize: 13, fontWeight: '600', color: COLORS.charcoal, textAlign: 'center', marginTop: 5 },
    quoteCard: { backgroundColor: COLORS.primaryWhite, borderRadius: 20, padding: 20, alignItems: 'center', elevation: 3, shadowColor: COLORS.mediumGray, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, borderWidth: 0 },
    quoteIcon: { marginBottom: 10 },
    quoteText: { fontSize: 16, fontStyle: 'italic', color: COLORS.charcoal, textAlign: 'center' },
    quoteAuthor: { fontSize: 14, color: COLORS.darkGray, marginTop: 10 },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lightGray }
});

export default DashboardScreen;