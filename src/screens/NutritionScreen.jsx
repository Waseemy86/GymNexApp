import { Button, Card } from '@rneui/themed';
import { Camera } from 'expo-camera';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { analyzeMeal } from '../services/apiService';

const NutritionScreen = () => {
  const [mealDescription, setMealDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  const handleAnalyze = async () => {
    if (!mealDescription.trim()) {
      Alert.alert("נדרש קלט", "אנא הזן תיאור של הארוחה.");
      return;
    }
    setLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeMeal(mealDescription);
      setAnalysisResult(result);
    } catch (error) {
      Alert.alert("שגיאה", "לא ניתן היה לנתח את הארוחה כרגע.");
      console.error("Meal analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    setCameraVisible(true);
  };

  const closeCamera = () => setCameraVisible(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>יומן האוכל שלי</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card containerStyle={styles.inputCard}>
            <Text style={styles.cardTitle}>מה אכלת היום?</Text>
            <TextInput style={styles.textInput} placeholder="לדוגמה: חזה עוף בגריל עם בטטה וסלט ירוק" placeholderTextColor={COLORS.darkGray} multiline value={mealDescription} onChangeText={setMealDescription} />
            <Button title="נתח ארוחה בעזרת AI" onPress={handleAnalyze} buttonStyle={styles.mainButton} loading={loading} icon={<Icon name="analytics-outline" color={COLORS.primaryWhite} size={20} style={{ marginRight: 10 }} />} />
        </Card>

        {analysisResult && (
            <Animated.View entering={FadeIn.duration(500)}>
                <Card containerStyle={styles.resultCard}>
                    <Text style={styles.cardTitle}>ניתוח הארוחה:</Text>
                    <View style={styles.resultRow}>
                        <Icon name="flame-outline" size={24} color={COLORS.primaryGreen} />
                        <Text style={styles.resultLabel}>קלוריות מוערכות:</Text>
                        <Text style={styles.resultValue}>{analysisResult.estimatedCalories || 'N/A'} קק"ל</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Icon name="leaf-outline" size={24} color={COLORS.primaryGreen} />
                        <Text style={styles.resultLabel}>חלבון מוערך:</Text>
                        <Text style={styles.resultValue}>{analysisResult.proteinGrams || 'N/A'} גרם</Text>
                    </View>
                    <View style={styles.feedbackContainer}>
                        <Icon name="chatbubble-ellipses-outline" size={24} color={COLORS.primaryGreen} />
                        <Text style={styles.feedbackText}>{analysisResult.aI_Feedback || 'לא התקבל משוב.'}</Text>
                    </View>
                </Card>
            </Animated.View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openCamera}>
          <Icon name="camera-outline" size={32} color={COLORS.primaryWhite}/>
      </TouchableOpacity>

      <Modal visible={cameraVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          {hasPermission ? (
            <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} />
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 50 }}>אין הרשאה למצלמה</Text>
          )}
          <Button title="סגור מצלמה" onPress={closeCamera} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    // ...existing styles...
});

export default NutritionScreen;