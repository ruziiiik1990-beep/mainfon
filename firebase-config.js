import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const firebaseConfig = {
    apiKey: "AIzaSyDQMXKc1q4SQYIKlhqzPmB9-h0rCV90Itk",
    authDomain: "ak4ak-8be45.firebaseapp.com",
    databaseURL: "https://ak4ak-8be45-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ak4ak-8be45",
    storageBucket: "ak4ak-8be45.appspot.com",
    messagingSenderId: "408070680295",
    appId: "1:408070680295:web:77b9656094e330b803bc42"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
