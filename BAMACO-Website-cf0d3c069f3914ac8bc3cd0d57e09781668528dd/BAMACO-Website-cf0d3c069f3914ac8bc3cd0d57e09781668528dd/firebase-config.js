// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set, push, remove, update, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQ5eunqdZcHJx1Leaw7IYZdH3PkPjbctg",
  authDomain: "bamaco-queue.firebaseapp.com",
  databaseURL: "https://bamaco-queue-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bamaco-queue",
  storageBucket: "bamaco-queue.firebasestorage.app",
  messagingSenderId: "683913605188",
  appId: "1:683913605188:web:2842c6031ea68dc5da8c11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Database references
const queueRef = ref(database, 'queue');
const currentlyPlayingRef = ref(database, 'currentlyPlaying');
const gameHistoryRef = ref(database, 'gameHistory');
const playerCreditsRef = ref(database, 'playerCredits');

export { database, queueRef, currentlyPlayingRef, gameHistoryRef, playerCreditsRef, ref, onValue, set, push, remove, update, get };
