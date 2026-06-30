import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // МИЛДЕТТҮҮ

const firebaseConfig = {
  apiKey: "AIzaSyBnwey2PEZZaD1eZuFlZJF-JysCmaaKDeo",
  authDomain: "dr-stam.firebaseapp.com",
  projectId: "dr-stam",
  storageBucket: "dr-stam.firebasestorage.app", // Бул жерде "firebasestorage.app" болушу туура
  messagingSenderId: "158145580931",
  appId: "1:158145580931:web:793efac10df557dc8970b6",
  measurementId: "G-KFZYNX85Z4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore'ду инициализациялайбыз (Маалыматтар ушул аркылуу сакталат)
export const db = getFirestore(app);