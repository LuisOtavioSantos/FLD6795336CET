"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Registramos o SW apenas em modo de produção real ou se desejado
      // Em dev mode costuma causar dores de cabeça, mas aqui vamos registrar
      // para passar no critério de "Instalável"
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registrado com sucesso: ", registration.scope);
        })
        .catch((err) => {
          console.log("Falha no registro do Service Worker: ", err);
        });
    }
  }, []);

  return null;
}
