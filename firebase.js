import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAT-K6B8Hf8-mDTXziSnOkX5IInlQlaz3Q",
  authDomain: "servio-ec36c.firebaseapp.com",
  projectId: "servio-ec36c",
  storageBucket: "servio-ec36c.firebasestorage.app",
  messagingSenderId: "419885098439",
  appId: "1:419885098439:web:9fc7de1de8d2a9448e25e2"
};



const app = initializeApp(firebaseConfig);
console.log("Firebase Messaging Service Worker initialized.");

const messaging = getMessaging(app);

export const getFCMToken = async () => {
    console.log("Requesting permission for notifications...");
  const token = await getToken(messaging, {
    vapidKey: "BLWRJWrSKqxy4U_kUuyOt5k08ADVkYb7dnc4lmxVBPt9C_u1sbGs5eRv-hzGgDQXNDWsy26D-QQWXmLXAo8L1NE"
  });

  console.log("TOKEN:", token);
  return token;
};