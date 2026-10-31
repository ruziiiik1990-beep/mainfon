// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function updateButtons(user) {
    const guest = document.getElementById('guest-buttons');
    const userDiv = document.getElementById('user-buttons');
    
    if (!guest || !userDiv) return;

    if (user) {
        guest.style.display = 'none';
        userDiv.style.display = 'flex';
    } else {
        guest.style.display = 'flex';
        userDiv.style.display = 'none';
    }
}

onAuthStateChanged(auth, (user) => {
    updateButtons(user);
});

// Принудительная проверка
setInterval(() => {
    updateButtons(auth.currentUser);
}, 1000);

// Выход
document.addEventListener('click', function(e) {
    if (e.target.closest('#logout-btn')) {
        e.preventDefault();
        signOut(auth).then(() => window.location.reload());
    }
});
