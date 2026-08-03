importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAneJwJB5xg1oD1dBKOI7y07r7XEM70xQE",
  authDomain: "augovos.firebaseapp.com",
  projectId: "venda-de-ovos-63448",
   messagingSenderId: "973253465115",
  appId: "1:973253465115:web:3757df3250d290debcd4be"
});

const messaging = firebase.messaging();

// Lógica para mostrar a notificação em segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('Recebida mensagem em segundo plano: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png' // Ou o caminho para o teu ícone de ovos
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});