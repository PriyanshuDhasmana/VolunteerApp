import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ✅ YOUR ACTUAL FIREBASE CONFIG - SUCCESSFULLY ADDED
const firebaseConfig = {
  apiKey: "AIzaSyC9tYoGMJ9VYChIoQ4ep3LClo3XeCi1Bbs",
  authDomain: "volunteerapp-cbf54.firebaseapp.com",
  projectId: "volunteerapp-cbf54",
  storageBucket: "volunteerapp-cbf54.firebasestorage.app",
  messagingSenderId: "495542293928",
  appId: "1:495542293928:web:8a982913edef666731f99d",
  measurementId: "G-SZM092777N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;
