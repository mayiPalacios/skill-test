import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.tsx";
import "./style/App.scss";
import { FormDataListProvider } from "./context/FormDataListContext.tsx";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Service Worker successfully registered with the scope: ', registration.scope);
    }).catch(function(err) {
      console.log('Service Worker registration failed: ', err);
    });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FormDataListProvider>
      <App />
    </FormDataListProvider>
  </React.StrictMode>
);
