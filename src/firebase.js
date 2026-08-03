import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging"; // Importa o serviço de mensagens

const firebaseConfig = {
  apiKey: "AIzaSyAneJwJB5xg1oD1dBKOI7y07r7XEM70xQE",
  authDomain: "augovos.firebaseapp.com",
  projectId: "venda-de-ovos-63448",
  storageBucket: "venda-de-ovos-63448.appspot.com",
  messagingSenderId: "973253465115",
  appId: "1:973253465115:web:3757df3250d290debcd4be"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app); 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging"; // Importa o serviço de mensagens

const firebaseConfig = {
  apiKey: "AIzaSyAneJwJB5xg1oD1dBKOI7y07r7XEM70xQE",
  authDomain: "augovos.firebaseapp.com",
  projectId: "venda-de-ovos-63448",
  storageBucket: "venda-de-ovos-63448.appspot.com",
  messagingSenderId: "973253465115",
  appId: "1:973253465115:web:3757df3250d290debcd4be"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app); 