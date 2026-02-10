import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { firebaseConfig as config } from "./env"

const firebaseConfig = {
  apiKey: config.apiKey?.trim(),
  authDomain: config.authDomain?.trim(),
  projectId: config.projectId?.trim(),
  storageBucket: config.storageBucket?.trim(),
  messagingSenderId: config.messagingSenderId?.trim(),
  appId: config.appId?.trim(),
}

// Debug: Log config in development
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase Config:', {
    apiKey: firebaseConfig.apiKey?.substring(0, 10) + '...',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
  })
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
