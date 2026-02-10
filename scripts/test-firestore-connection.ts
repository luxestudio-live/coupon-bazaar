// Minimal Firestore test script
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig as config } from "../lib/env";

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConnection() {
  try {
    const codesRef = collection(db, "couponCodes");
    const snapshot = await getDocs(codesRef);
    console.log(`Fetched ${snapshot.size} couponCodes documents.`);
  } catch (error) {
    console.error("Firestore test error:", error);
  }
}

testConnection().then(() => process.exit(0));
