// Temporary script to update all couponCodes with used=true and isUsed!=true
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
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
