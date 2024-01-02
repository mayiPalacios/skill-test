import { initializeApp } from "firebase/app";

import { getMessaging } from "firebase/messaging";

//Firebase Config values imported from .env file
const firebaseConfig = {
  apiKey: "AIzaSyCNFdh4buOOi8O15AmSvcev5GymAFvK3h8",
  authDomain: "finnhubapp.firebaseapp.com",
  projectId: "finnhubapp",
  storageBucket: "finnhubapp.appspot.com",
  messagingSenderId: "174328673142",
  appId: "1:174328673142:web:f557f4a2fe7eb3b76d8057",
  measurementId: "G-S1FXL5XPZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Messaging service
const messaging = getMessaging(app);

export default messaging