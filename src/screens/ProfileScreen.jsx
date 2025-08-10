import { useFocusEffect } from '@react-navigation/native';
import { Avatar, Button } from '@rneui/themed';
import * as Notifications from 'expo-notifications';
import { useCallback, useContext, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { AuthContext } from '../navigation/AppNavigator';
import { getUserAchievements, getUserProfile, getUserTimeline, logoutUser } from '../services/apiService';

const ProfileScreen = () => {
  const { signOut } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const profileData = await getUserProfile();
          setProfile(profileData);

          const achievementsData = await getUserAchievements();
          setAchievements(achievementsData);

          const timelineData = await getUserTimeline();
          setTimeline(timelineData);
        } catch (error) {
          console.error("Failed to fetch profile data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  // Push Notification example
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') return;
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        // תוכל לשמור את הטוקן בשרת או להציג אותו
        console.log('Expo Push Token:', token);

        // דוגמה לשליחת הודעה מקומית
        Notifications.scheduleNotificationAsync({
          content: {
            title: "GymNex",
            body: "ברוך הבא למסך הפרופיל!",
          },
          trigger: null,
        });
      })();
    }, [])
  );

  const handleLogout = async () => {
    await logoutUser();
    signOut();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryGreen} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Animated.View style={styles.header} entering={FadeInDown.duration(600)}>
        <Avatar
          size={100}
          rounded
          source={{ uri: profile?.avatarUrl || 'https://randomuser.me/api/portraits/men/32.jpg' }}
          containerStyle={styles.avatar}
        />
        <Text style={styles.name}>
          {profile ? `${profile.firstName} ${profile.lastName}` : 'טוען...'}
        </Text>
        <Text style={styles.memberSince}>
          {profile?.memberSince ? `חבר ב-GymNex מאז ${profile.memberSince}` : ''}
        </Text>
        <Button
          title="ערוך פרופיל"
          type="outline"
          icon={<Icon name="pencil-outline" size={16} color={COLORS.primaryGreen} style={{ marginRight: 8 }} />}
          buttonStyle={styles.editButton}
          titleStyle={styles.editButtonTitle}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(600)}>
        <Text style={styles.sectionTitle}>ההישגים שלי</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsContainer}>
          {achievements.length === 0 ? (
            <Text style={{ color: COLORS.darkGray }}>אין הישגים להצגה</Text>
          ) : (
            achievements.map(item => (
              <TouchableOpacity key={item.id} style={styles.achievementItem}>
                <View style={[styles.achievementIconContainer, { backgroundColor: item.color || COLORS.primaryGreen }]}>
                  <Icon name={item.icon || 'star-outline'} size={30} color={COLORS.primaryWhite} />
                </View>
                <Text style={styles.achievementTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(600)}>
        <Text style={styles.sectionTitle}>המסע שלי</Text>
        <View style={styles.timelineContainer}>
          {timeline.length === 0 ? (
            <Text style={{ color: COLORS.darkGray }}>אין אירועים להצגה</Text>
          ) : (
            timeline.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <Icon name={item.icon || 'time-outline'} size={24} color={COLORS.primaryGreen} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineDate}>{item.date}</Text>
                  <Text style={styles.timelineEvent}>{item.event}</Text>
                </View>
                {index < timeline.length - 1 && <View style={styles.timelineLine} />}
              </View>
            ))
          )}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(600).duration(600)}>
        <Button
          title="התנתקות"
          onPress={handleLogout}
          buttonStyle={styles.logoutButton}
          titleStyle={styles.logoutButtonTitle}
          icon={<Icon name="log-out-outline" size={22} color={COLORS.warningRed} style={{ marginRight: 10 }} />}
        />
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  scrollContent: { padding: 20, paddingBottom: 50 },
  header: { alignItems: 'center', marginBottom: 30 },
  avatar: { borderWidth: 4, borderColor: COLORS.primaryGreen, marginBottom: 10 },
  name: { fontSize: 26, fontWeight: 'bold', color: COLORS.charcoal },
  memberSince: { fontSize: 14, color: COLORS.darkGray, marginBottom: 15 },
  editButton: { borderColor: COLORS.primaryGreen, borderRadius: 20, paddingVertical: 5, paddingHorizontal: 15 },
  editButtonTitle: { color: COLORS.primaryGreen, fontWeight: 'bold', fontSize: 14 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.charcoal, marginBottom: 15 },
  achievementsContainer: { paddingVertical: 10 },
  achievementItem: { alignItems: 'center', marginRight: 20, width: 80 },
  achievementIconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  achievementTitle: { fontSize: 12, color: COLORS.darkGray, textAlign: 'center' },
  timelineContainer: { marginTop: 10, paddingLeft: 15 },
  timelineItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, position: 'relative' },
  timelineLine: { position: 'absolute', left: 11, top: 30, bottom: -20, width: 2, backgroundColor: COLORS.mediumGray },
  timelineIconContainer: { width: 24, height: 24, marginRight: 20, zIndex: 1, backgroundColor: COLORS.lightGray },
  timelineContent: { flex: 1 },
  timelineDate: { fontSize: 12, color: COLORS.darkGray, marginBottom: 3 },
  timelineEvent: { fontSize: 16, fontWeight: '600', color: COLORS.charcoal },
  logoutButton: { backgroundColor: 'transparent', borderColor: COLORS.warningRed, borderWidth: 1, borderRadius: 10, marginTop: 40 },
  logoutButtonTitle: { color: COLORS.warningRed, fontWeight: 'bold' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lightGray },
});

export default ProfileScreen;