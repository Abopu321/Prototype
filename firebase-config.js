// Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';

const firebaseConfig = {
    apiKey: "AIzaSyDb7V2EI7ws32qC6Yny6yCzTRxwTRUK8qc",
    authDomain: "quickchat-demo.firebaseapp.com",
    databaseURL: "https://quickchat-demo-default-rtdb.firebaseio.com",
    projectId: "quickchat-demo",
    storageBucket: "quickchat-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

export { database, storage };