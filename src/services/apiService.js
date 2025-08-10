import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


// const API_BASE_URL = 'https://192.168.1.100:7123/api';
const API_BASE_URL = 'https://YOUR_API_DOMAIN.com/api'; // Placeholder

// יצירת מופע של axios עם הגדרות בסיסיות
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// "מיירט" בקשות (Request Interceptor)
// קוד זה ירוץ *לפני* שכל בקשה נשלחת לשרת.
// תפקידו הוא לבדוק אם יש טוקן שמור בזיכרון, ואם כן, להוסיף אותו לכותרת הבקשה.
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- AUTHENTICATION ENDPOINTS ---

export const registerUser = async (userData) => {
  // userData should be an object like { email, password, firstName, lastName }
  try {
    const response = await api.post('/Auth/register', userData);
    // ה-API  לא מחזיר טוקן בהרשמה, אלא הודעת הצלחה
    return response.data; 
  } catch (error) {
   
    throw error.response.data;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/Auth/login', { email, password });
    
    // אם ההתחברות הצליחה, שומרים את הטוקן והמידע בזיכרון המכשיר
    const { token, user } = response.data;
    if (token) {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logoutUser = async () => {
  // מנקים את כל המידע השמור מהמכשיר
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.setItem('userData', '');
};


// --- USER PROFILE ENDPOINTS ---

export const getUserProfile = async () => {
  try {
    // כאן אין צורך לשלוח body, הטוקן בכותרת יזהה את המשתמש
    const response = await api.get('/UserProfile/me');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/UserProfile/update', profileData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserAchievements = async () => {
  const response = await api.get('/UserProfile/achievements');
  return response.data;
};

export const getUserTimeline = async () => {
  const response = await api.get('/UserProfile/timeline');
  return response.data;
};


// --- WORKOUT ENDPOINTS ---

export const generateWorkout = async () => {
  try {
    const response = await api.post('/Workout/generate');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getWorkoutHistory = async () => {
    try {
        const response = await api.get('/Workout/history');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// --- NUTRITION ENDPOINTS ---

export const analyzeMeal = async (mealDescription) => {
    try {
        const response = await api.post('/Nutrition/log', { mealDescription });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};


export const getArticles = async () => {
  const response = await api.get('/Discovery/articles');
  return response.data;
};

export const getJournalEntries = async () => {
  const response = await api.get('/Discovery/journal');
  return response.data;
};
