import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { CareerResult, UserStory, UserAssessment } from './types';

const firebaseConfig = {
  apiKey: "AIzaSyBgbLPmqtvDNAAgnEsz9G89-9i3lobJFQU",
  authDomain: "evolvyng-almostserious.firebaseapp.com",
  projectId: "evolvyng-almostserious",
  storageBucket: "evolvyng-almostserious.firebasestorage.app",
  messagingSenderId: "700228310531",
  appId: "1:700228310531:web:b382c498a3bb4d76c9a036"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Export the app instance if needed