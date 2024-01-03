importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};

const firebaseConfig = {
  apiKey: "AIzaSyCNFdh4buOOi8O15AmSvcev5GymAFvK3h8",
  authDomain: "finnhubapp.firebaseapp.com",
  projectId: "finnhubapp",
  storageBucket: "finnhubapp.appspot.com",
  messagingSenderId: "174328673142",
  appId: "1:174328673142:web:f557f4a2fe7eb3b76d8057",
  measurementId: "G-S1FXL5XPZE"
};

console.log(firebaseConfig)

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});