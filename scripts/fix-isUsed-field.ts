import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { firebaseConfig as config } from "../lib/env";

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
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