import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// my app firebase config
const firebaseConfig = {
  apiKey: "AIzaSyABldGn0NQrV1FPolk9XMKjTaZxZ_UcY4E",
  authDomain: "dayleez-d450e.firebaseapp.com",
  projectId: "dayleez-d450e",
  storageBucket: "dayleez-d450e.appspot.com",
  messagingSenderId: "197816104358",
  appId: "1:197816104358:web:f6b04f30e0a16558464b67",
  measurementId: "G-KGGD1YNJ31",
};

// Initialize Firebase
let app;
// getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
