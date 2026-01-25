// Temporary script to update all couponCodes with used=true and isUsed!=true
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixUsedCoupons() {
  const codesRef = collection(db, "couponCodes");
  const snapshot = await getDocs(codesRef);
  let updated = 0;
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (data.used === true && data.isUsed !== true) {
      await updateDoc(doc(db, "couponCodes", docSnap.id), { isUsed: true });
      updated++;
    }
  }
  console.log(`Updated ${updated} coupon codes.`);
}

fixUsedCoupons().then(() => process.exit(0));
