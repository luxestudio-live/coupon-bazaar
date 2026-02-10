import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { firebaseConfig as config, adminConfig, validateEnv } from "../lib/env"

// Load environment variables
const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId,
}

// Validate required environment variables
try {
  validateEnv()
  if (!adminConfig.email || !adminConfig.password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required")
  }
} catch (error) {
  console.error("❌ Configuration Error:")
  console.error(error instanceof Error ? error.message : error)
  console.error("\nPlease create a .env.local file with all required variables.")
  console.error("See .env.local.example for reference.")
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const ADMIN_EMAIL = adminConfig.email!
const ADMIN_PASSWORD = adminConfig.password!

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
