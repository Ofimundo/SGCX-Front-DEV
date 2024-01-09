import React, { useEffect, useState } from "react";
import { List } from "antd";
import io from "socket.io-client";

export default function Pruebas() {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const socket = io("https://socket-sgcx.vercel.app", {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });

    socket.on("notificacion", (data) => {
      setNotificaciones([...notificaciones, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const enviarMensaje = () => {
    const socket = io("https://socket-sgcx.vercel.app/", {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });

    socket.emit(
      "actualizacion",
      "¡Hola! Hemos actualizado nuestro sitio. Por favor, recarga la página para disfrutar de las mejoras."
    );
  };

  console.log(notificaciones);

  return (
    <>
      <h1>Next.js con Socket.IO y CORS habilitadas</h1>
      <button onClick={() => enviarMensaje()}>mensaje</button>

      <div className="ctn-card up">
        <List
          style={{ width: "300px" }}
          size="small"
          dataSource={notificaciones}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta title={item} description="Ant Design" />
            </List.Item>
          )}
        />
      </div>
    </>
  );
}
