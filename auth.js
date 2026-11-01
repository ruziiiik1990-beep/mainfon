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

// Загрузка футера на всех страницах
fetch('footer.html')
  .then(response => response.text())
  .then(html => {
    const footerDiv = document.createElement('div');
    footerDiv.innerHTML = html;
    footerDiv.style.position = 'relative';
    footerDiv.style.zIndex = '10';
    footerDiv.style.width = '100%';
    footerDiv.style.marginTop = 'auto';

    // Делаем body flex-колонкой на всю высоту экрана
    document.body.style.display = 'flex';
    document.body.style.flexDirection = 'column';
    document.body.style.minHeight = '100vh';

    document.body.appendChild(footerDiv);
  })
  .catch(err => console.error('Ошибка загрузки футера:', err));
