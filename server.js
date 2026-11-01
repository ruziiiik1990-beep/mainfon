const express = require('express');
const cors = require('cors');
const SteamAuth = require('node-steam-openid');
const admin = require('firebase-admin');

const app = express();

app.use(cors({
  origin: ['https://4ak4ak.pages.dev', 'http://localhost:3000']
}));
app.use(express.json());

// ====== Firebase Admin ======
// Ключ сервисного аккаунта Firebase (JSON) — добавим в Environment Variables на Render
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }),
    databaseURL: 'https://ak4ak-8be45-default-rtdb.europe-west1.firebasedatabase.app'
  });
}
const db = admin.database();

// ====== Steam OpenID ======
const RENDER_URL = 'https://mainfon.onrender.com';

const steam = new SteamAuth({
  realm: RENDER_URL,
  returnUrl: RENDER_URL + '/auth/steam/authenticate',
  apiKey: process.env.STEAM_API_KEY
});

app.get('/auth/steam', async (req, res) => {
  try {
    const redirectUrl = await steam.getRedirectUrl();
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Ошибка при получении Steam URL:', error);
    res.status(500).send('Не удалось начать вход через Steam');
  }
});

app.get('/auth/steam/authenticate', async (req, res) => {
  try {
    const user = await steam.authenticate(req);
    const steamId = user.steamid;
    const uid = req.query.uid || 'guest';

    console.log('Успешный вход через Steam. ID:', steamId, 'uid:', uid);

    // Запись в Firebase Realtime Database
    if (uid !== 'guest') {
      await db.ref('steamVerification/' + uid).set({
        steamId: steamId,
        verified: true,
        updatedAt: Date.now()
      });
    }

    // Передаём steamId в родительское окно
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Вход выполнен</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:40px;background:#1b2838;color:#c7d5e0;">
        <h2>✅ Вход через Steam выполнен</h2>
        <p>Steam ID: <b>${steamId}</b></p>
        <p>Окно закроется автоматически…</p>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'steam_verified', steamid: '${steamId}', uid: '${uid}' }, '*');
          }
          setTimeout(function() { window.close(); }, 1500);
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Ошибка аутентификации Steam:', error);
    res.status(401).send(`
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Ошибка входа</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:40px;background:#1b2838;color:#c7d5e0;">
        <h2>❌ Ошибка входа через Steam</h2>
        <p>${error.message || 'Не удалось подтвердить аккаунт'}</p>
      </body>
      </html>
    `);
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Steam OpenID Backend работает (с Firebase)' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
