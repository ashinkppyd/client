importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

// 🔥 Initialize Firebase
firebase.initializeApp ({
  apiKey: "AIzaSyAT-K6B8Hf8-mDTXziSnOkX5IInlQlaz3Q",
  authDomain: "servio-ec36c.firebaseapp.com",
  projectId: "servio-ec36c",
  storageBucket: "servio-ec36c.firebasestorage.app",
  messagingSenderId: "419885098439",
  appId: "1:419885098439:web:9fc7de1de8d2a9448e25e2"
});




const messaging = firebase.messaging();

console.log("✅ Firebase Service Worker Loaded");

// 🔥 Handle Background Messages (FCM)
messaging.onBackgroundMessage(function (payload) {
  console.log("📩 Background message received:", payload);

  const title = payload.notification?.title || "New Notification";
  const body = payload.notification?.body || "You have a new message";

  const options = {
    body: body,
    icon: "/logo192.png", // optional
    data: payload.data || {}
  };

  self.registration.showNotification(title, options);
});


// 🔥 Handle Manual Push (DevTools test)
self.addEventListener("push", function (event) {
  console.log("📩 Push event received:", event);

  let data = {};

  try {
    data = event.data.json();
  } catch (e) {
    data = { title: "Test", body: event.data.text() };
  }

  const title = data.title || "BOOKING UPDATE";
  const options = {
    body: data.body || "Successfully applied for a booking!",
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


// 🔥 Handle Notification Click
self.addEventListener("notificationclick", function (event) {
  console.log("🔔 Notification clicked");

  event.notification.close();

  event.waitUntil(
    clients.openWindow("/") // open your app
  );
});