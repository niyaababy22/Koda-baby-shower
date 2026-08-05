// ============================================================
// FIREBASE SETUP — shared by rsvp.js and guestlist.js
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import { getFirestore, collection } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdowoudpGvCajfj5ff0PEBIAK3RmKgsUU",
  authDomain: "babyshower-cee8e.firebaseapp.com",
  projectId: "babyshower-cee8e",
  storageBucket: "babyshower-cee8e.firebasestorage.app",
  messagingSenderId: "1001275144107",
  appId: "1:1001275144107:web:2d710411f397a7a86fc4ee",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rsvpsRef = collection(db, "rsvps");