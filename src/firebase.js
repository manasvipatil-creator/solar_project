// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// 🔑 Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyQHXteIGyQn-FCkyrVqaiwGaoJ3Um1Uo",
  authDomain: "solar3-d64dd.firebaseapp.com",
  databaseURL: "https://solar3-d64dd-default-rtdb.firebaseio.com", // 👈 Realtime DB
  projectId: "solar3-d64dd",
  storageBucket: "solar3-d64dd.appspot.com",
  messagingSenderId: "991887230555",
  appId: "1:991887230555:web:975eb05042f6de19cf617e",
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✨ Initialize Authentication & Database
export const auth = getAuth(app);
export const db = getDatabase(app);

export default app;
