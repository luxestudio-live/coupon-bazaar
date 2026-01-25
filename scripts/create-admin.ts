import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyC-YrD9kmIkJjM0qUPK33RFAx3Vci0Poj4",
  authDomain: "coupon-duniya.firebaseapp.com",
  projectId: "coupon-duniya",
  storageBucket: "coupon-duniya.firebasestorage.app",
  messagingSenderId: "765658846291",
  appId: "1:765658846291:web:828f7157f3a00b8db5e2a6",
  measurementId: "G-676NEV4JCN",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const ADMIN_EMAIL = "admin@couponduniya.in"
const ADMIN_PASSWORD = "Admin@LuxeStudio@23"

async function createAdminUser() {
  try {
    console.log("Creating admin user...")
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    )
    console.log("✅ Admin user created successfully!")
    console.log("Email:", ADMIN_EMAIL)
    console.log("User ID:", userCredential.user.uid)
    console.log("\nYou can now login at: http://localhost:3000/admin/login")
    process.exit(0)
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      console.log("✅ Admin user already exists!")
      console.log("Email:", ADMIN_EMAIL)
      console.log("\nYou can login at: http://localhost:3000/admin/login")
    } else {
      console.error("❌ Error creating admin user:", error.message)
      console.error("\nMake sure you have enabled Email/Password authentication in Firebase Console:")
      console.error("https://console.firebase.google.com/project/coupon-duniya/authentication/providers")
    }
    process.exit(1)
  }
}

createAdminUser()
