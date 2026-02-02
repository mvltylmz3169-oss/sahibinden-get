// Firebase Configuration
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAmim3CaatreR8lsoSeaBLvi7PzXXJXsZs",
  authDomain: "biblo-a43d6.firebaseapp.com",
  projectId: "biblo-a43d6",
  storageBucket: "biblo-a43d6.firebasestorage.app",
  messagingSenderId: "367813650390",
  appId: "1:367813650390:web:80acb7fc196607bca26677",
  measurementId: "G-PE7YRRKDL1"
};

// Initialize Firebase (prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { app, db, storage };
