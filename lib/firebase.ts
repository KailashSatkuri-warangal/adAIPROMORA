import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from "firebase/auth";
import { getFirestore, setLogLevel } from "firebase/firestore";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

// User's provided Firebase configuration for adAIPROMORA
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA7dfe9j419rdGlcNxjK_oGbx3LSVJOTHc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "aipromora.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "aipromora",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "aipromora.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "215034520214",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:215034520214:web:5e1eccce68abf80c5f98b7",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-0CXZL05RBP",
};

// Initialize Firebase app singleton
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with silent logging to prevent permission noise in terminal
try {
  setLogLevel("silent");
} catch (e) {}

export const firestore = getFirestore(firebaseApp);

// Initialize Firebase Analytics safely (Client-side only)
export const getSafeAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(firebaseApp);
    }
  }
  return null;
};

// Helper function to log dynamic telemetry events to Firebase Analytics
export async function trackMarketingEvent(eventName: string, params?: Record<string, any>) {
  try {
    const analytics = await getSafeAnalytics();
    if (analytics) {
      logEvent(analytics, eventName, {
        platform: "adAIPROMORA",
        developed_by: "Satkuri Kailash",
        timestamp: new Date().toISOString(),
        ...params,
      });
    }
  } catch (err) {
    // Non-blocking telemetry
  }
}

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
};
