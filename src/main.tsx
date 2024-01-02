import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.tsx";
import "./style/App.scss";
import { registerSW } from "virtual:pwa-register";
import { FormDataListProvider } from "./context/FormDataListContext.tsx";

const updateSW = registerSW({
  onNeedRefresh() {
    console.log("Nueva versión disponible! Recarga para actualizar.");
  },
  onOfflineReady() {
    console.log("La PWA está lista para funcionar sin conexión.");
  },
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Service Worker registrado con éxito con el alcance: ', registration.scope);
    }).catch(function(err) {
      console.log('Service Worker registro fallido: ', err);
    });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FormDataListProvider>
      <App />
    </FormDataListProvider>
  </React.StrictMode>
);
