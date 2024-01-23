import React from "react";
import io from "socket.io-client";
import { Button } from "semantic-ui-react";

export function EnviarNotificaciones() {
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    extraHeaders: {
      "Access-Control-Allow-Origin": "*",
    },
    ackTimeout: 10000,
    retries: 3,
  });

  const actualizarPagina = () => {
    const message =
      "¡Hola! Hemos actualizado nuestro sitio. Por favor, recarga la página.";
    socket.emit("actualizacion", message);
  };

  return (
    <>
      <div className="ctn-card up">
        <Button
          content="Actualizar página"
          color="blue"
          onClick={() => actualizarPagina()}
        />
      </div>
    </>
  );
}
