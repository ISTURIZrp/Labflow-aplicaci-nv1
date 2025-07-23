import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxJOpBEXZUo7WrAqDTrlJV_2kJBsL8Ym0",
  authDomain: "labflow-manager.firebaseapp.com",
  projectId: "labflow-manager",
  storageBucket: "labflow-manager.firebasestorage.app",
  messagingSenderId: "742212306654",
  appId: "1:742212306654:web:a53bf890fc63cd5d05e44f",
  measurementId: "G-YVZDBCJR3B"
};

// Initialize Firebase
let app: any = null;
let auth: any = null;
let db: any = null;
let analytics: any = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  // Initialize Analytics only in browser environment
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error('Error inicializando Firebase:', error);
}

export { auth, db };
export default app;
