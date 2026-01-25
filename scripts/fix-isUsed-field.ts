import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

// TODO: Replace with your actual Firebase config or import from your config file
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getFirestore();

async function fixIsUsedField() {
  const codesRef = collection(db, "couponCodes");
  // Find all codes where used=true and (isUsed is false or missing)
  const q = query(codesRef, where("used", "==", true));
  const snapshot = await getDocs(q);
  let updated = 0;
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (!data.isUsed) {
      await updateDoc(docSnap.ref, { isUsed: true });
      updated++;
      console.log(`Updated code ${docSnap.id}`);
    }
  }
  console.log(`Done. Updated ${updated} couponCodes.`);
}

fixIsUsedField().catch((err) => {
  console.error("Error updating couponCodes:", err);
  process.exit(1);
});