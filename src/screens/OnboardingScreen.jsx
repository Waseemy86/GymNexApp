import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Input, Button } from '@rneui/themed';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, FadeIn } from 'react-native-reanimated';
import { loginUser, registerUser } from '../services/apiService';
import { AuthContext } from '../navigation/AppNavigator';
import { COLORS } from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const OnboardingScreen = () => {
  const [mode, setMode] = useState('landing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useContext(AuthContext);

  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  const logoScale = useSharedValue(1);

  const switchMode = (newMode) => {
    setError('');
    setMode(newMode);
    if (newMode === 'landing') {
      formOpacity.value = withTiming(0);
      formTranslateY.value = withTiming(50);
      logoScale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) });
    } else {
      formOpacity.value = withTiming(1, { duration: 500 });
      formTranslateY.value = withTiming(0, { duration: 500 });
      logoScale.value = withTiming(0.7, { duration: 500, easing: Easing.out(Easing.exp) });
    }
  };

  const animatedFormStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await loginUser(email, password);
      if (response.token) {
        signIn(response.token);
      }
    } catch (apiError) {
      setError(apiError.message || 'שגיאה בהתחברות. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await registerUser({ firstName, lastName, email, password });
      const response = await loginUser(email, password);
      if (response.token) {
        signIn(response.token);
      }
    } catch (apiError) {
      setError(apiError.message || 'שגיאה ברישום. ייתכן שהאימייל קיים.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (mode === 'login') {
      return (
        <Animated.View style={[styles.formContainer, animatedFormStyle]}>
          <Input placeholder="אימייל" leftIcon={<Icon name="mail-outline" size={22} color={COLORS.darkGray} />} onChangeText={setEmail} value={email} keyboardType="email-address" autoCapitalize="none" inputContainerStyle={styles.inputContainer} />
          <Input placeholder="סיסמה" leftIcon={<Icon name="lock-closed-outline" size={22} color={COLORS.darkGray} />} onChangeText={setPassword} value={password} secureTextEntry inputContainerStyle={styles.inputContainer} />
          <Button title="התחברות" onPress={handleLogin} buttonStyle={styles.mainButton} loading={loading} />
        </Animated.View>
      );
    }

    if (mode === 'register') {
      return (
        <Animated.View style={[styles.formContainer, animatedFormStyle]}>
          <Input placeholder="שם פרטי" leftIcon={<Icon name="person-outline" size={22} color={COLORS.darkGray} />} onChangeText={setFirstName} value={firstName} inputContainerStyle={styles.inputContainer} />
          <Input placeholder="שם משפחה" leftIcon={<Icon name="people-outline" size={22} color={COLORS.darkGray} />} onChangeText={setLastName} value={lastName} inputContainerStyle={styles.inputContainer} />
          <Input placeholder="אימייל" leftIcon={<Icon name="mail-outline" size={22} color={COLORS.darkGray} />} onChangeText={setEmail} value={email} keyboardType="email-address" autoCapitalize="none" inputContainerStyle={styles.inputContainer} />
          <Input placeholder="סיסמה" leftIcon={<Icon name="lock-closed-outline" size={22} color={COLORS.darkGray} />} onChangeText={setPassword} value={password} secureTextEntry inputContainerStyle={styles.inputContainer} />
          <Button title="יצירת חשבון" onPress={handleRegister} buttonStyle={styles.mainButton} loading={loading} />
        </Animated.View>
      );
    }
    return null;
  };
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.Image source={require('../assets/logo.png')} style={[styles.logo, animatedLogoStyle]} />
        <Animated.Text entering={FadeIn.delay(500)} style={styles.appName}>GymNex</Animated.Text>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {renderForm()}
      {mode === 'landing' ? (
        <Animated.View style={styles.buttonContainer} entering={FadeIn.delay(1000)}>
          <Button title="צור חשבון חדש" onPress={() => switchMode('register')} buttonStyle={styles.mainButton} titleStyle={styles.mainButtonTitle} />
          <Button title="כבר יש לי חשבון" onPress={() => switchMode('login')} type="clear" titleStyle={styles.secondaryButtonTitle} />
        </Animated.View>
      ) : (
        <Animated.View style={styles.footer} entering={FadeIn.delay(500)}>
          <TouchableOpacity onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}>
            <Text style={styles.footerText}>
              {mode === 'login' ? 'אין לך חשבון? ' : 'כבר יש לך חשבון? '}
              <Text style={styles.footerLink}>{mode === 'login' ? 'הירשם' : 'התחבר'}</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center', padding: 20, },
    logoContainer: { alignItems: 'center', flex: 1, justifyContent: 'center', },
    logo: { width: 150, height: 150, resizeMode: 'contain', },
    appName: { fontSize: 42, fontWeight: 'bold', color: COLORS.charcoal, marginTop: 10, },
    formContainer: { width: '100%', marginBottom: 20, },
    inputContainer: { backgroundColor: COLORS.primaryWhite, borderRadius: 10, borderBottomWidth: 0, paddingHorizontal: 10, marginBottom: 15, },
    buttonContainer: { width: '100%', paddingBottom: 30, },
    mainButton: { backgroundColor: COLORS.primaryGreen, borderRadius: 10, paddingVertical: 12, },
    mainButtonTitle: { fontWeight: 'bold', fontSize: 16, },
    secondaryButtonTitle: { color: COLORS.primaryGreen, fontWeight: 'bold', },
    footer: { position: 'absolute', bottom: 40, },
    footerText: { color: COLORS.darkGray, fontSize: 14, },
    footerLink: { color: COLORS.primaryGreen, fontWeight: 'bold', },
    errorText: { color: COLORS.warningRed, marginBottom: 10, fontWeight: '600', textAlign: 'center' }
});

export default OnboardingScreen;