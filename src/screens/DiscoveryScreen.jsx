
import { Card } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { getArticles, getJournalEntries } from '../services/apiService';


const DiscoveryScreen = () => {
  const [activeTab, setActiveTab] = useState('journal'); // 'journal' or 'articles'
  const [articles, setArticles] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [articlesData, journalData] = await Promise.all([
          getArticles(),
          getJournalEntries()
        ]);
        setArticles(articlesData);
        setJournalEntries(journalData);
      } catch (err) {
        setError('שגיאה בטעינת נתונים');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={COLORS.primaryGreen} style={{ marginTop: 40 }} />;
    }
    if (error) {
      return <Text style={{ color: COLORS.warningRed, textAlign: 'center', marginTop: 40 }}>{error}</Text>;
    }
    if (activeTab === 'journal') {
      return (
        <View>
          {journalEntries.length === 0 ? (
            <Text style={{ color: COLORS.darkGray, textAlign: 'center', marginTop: 20 }}>אין רשומות ביומן</Text>
          ) : (
            journalEntries.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInUp.delay(index * 100)}>
                <Card containerStyle={styles.journalCard}>
                  <View style={styles.journalHeader}>
                    <Icon name={item.type === 'workout' ? 'barbell-outline' : 'restaurant-outline'} size={22} color={COLORS.primaryGreen} />
                    <Text style={styles.journalDate}>{item.date}</Text>
                  </View>
                  <Text style={styles.journalTitle}>{item.title}</Text>
                  <Text style={styles.journalSummary}>{item.summary}</Text>
                </Card>
              </Animated.View>
            ))
          )}
        </View>
      );
    }
    if (activeTab === 'articles') {
      return (
        <View>
          {articles.length === 0 ? (
            <Text style={{ color: COLORS.darkGray, textAlign: 'center', marginTop: 20 }}>אין מאמרים להצגה</Text>
          ) : (
            articles.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInUp.delay(index * 100)}>
                <TouchableOpacity>
                  <Card containerStyle={styles.articleCard}>
                    <Image source={{ uri: item.image }} style={styles.articleImage} />
                    <View style={styles.articleTextContainer}>
                      <Text style={styles.articleTitle}>{item.title}</Text>
                      <Text style={styles.articleAuthor}>{item.author}</Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>מרכז הגילוי</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'journal' && styles.activeTab]} onPress={() => setActiveTab('journal')}>
            <Text style={[styles.tabText, activeTab === 'journal' && styles.activeTabText]}>היומן שלי</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'articles' && styles.activeTab]} onPress={() => setActiveTab('articles')}>
            <Text style={[styles.tabText, activeTab === 'articles' && styles.activeTabText]}>מאמרים וטיפים</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.lightGray, },
    header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: COLORS.primaryWhite, borderBottomWidth: 1, borderBottomColor: COLORS.mediumGray, },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.charcoal, textAlign: 'center', },
    tabContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLORS.primaryWhite, paddingVertical: 10, },
    tab: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, },
    activeTab: { backgroundColor: COLORS.primaryGreen, },
    tabText: { color: COLORS.darkGray, fontWeight: 'bold', },
    activeTabText: { color: COLORS.primaryWhite, },
    scrollContent: { padding: 15, },
    journalCard: { borderRadius: 15, borderWidth: 0, padding: 20, marginBottom: 15, },
    journalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, },
    journalDate: { color: COLORS.darkGray, fontSize: 12, marginLeft: 8, },
    journalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.charcoal, marginBottom: 5, },
    journalSummary: { fontSize: 14, color: COLORS.darkGray, },
    articleCard: { borderRadius: 15, borderWidth: 0, padding: 0, overflow: 'hidden', marginBottom: 15, },
    articleImage: { height: 150, width: '100%', },
    articleTextContainer: { padding: 15, },
    articleTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.charcoal, marginBottom: 5, },
    articleAuthor: { fontSize: 12, color: COLORS.primaryGreen, },
});

export default DiscoveryScreen;