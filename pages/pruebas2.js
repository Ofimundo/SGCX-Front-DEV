import React, { useEffect } from "react";
import io from "socket.io-client";

export default function Pruebas2() {
  const socket = io("http://127.0.0.1:8081");
  /*
  const socket = io("https://flask-hello-world-three-ashy.vercel.app/", {
    withCredentials: true,
    extraHeaders: {
      "Access-Control-Allow-Origin": "*", // Reemplaza con tu origen local
    },
  });
  */

  useEffect(() => {
    socket.on("message_response", (msg) => {
      console.log("Message from server:", msg);
    });
  }, []);

  const enviarMensaje = () => {
    const message =
      "¡Hola! Hemos actualizado nuestro sitio. Por favor, recarga la página para disfrutar de las mejoras.";
    socket.emit("message", message);
  };

  return (
    <>
      <button onClick={() => enviarMensaje()}>mensaje</button>
    </>
  );
}
