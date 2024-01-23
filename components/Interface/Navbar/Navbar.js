import React, { useState, useEffect } from "react";
import "moment/locale/es";
import moment from "moment";
import io from "socket.io-client";
import { Badge, Popover, List } from "antd";
import { useRouter } from "next/navigation";
import { Menu, Icon } from "semantic-ui-react";
import { signOut, useSession } from "next-auth/react";
import { notificacionesUsuario, notificacionesActualizar } from "../../../apis";
import styles from "./Navbar.module.css";

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [recargar, setRecargar] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);

  const onRecargar = () => setRecargar((prev) => !prev);

  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    extraHeaders: {
      "Access-Control-Allow-Origin": "*",
    },
    ackTimeout: 10000,
    retries: 3,
  });

  useEffect(() => {
    socket.on("notificacion", (msg) => {
      onRecargar();
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    (async () => {
      try {
        const response = await notificacionesUsuario(session.id_token);
        setNotificaciones(response);
      } catch (error) {
        setNotificaciones([]);
      }
    })();
  }, [recargar]); // eslint-disable-line react-hooks/exhaustive-deps

  const eventoNotificacion = async (id, url) => {
    await notificacionesActualizar(id, session.id_token);
    if (url) router.push(url);
    //else router.refresh();
    else alert("Sin eventos asociados");
    onRecargar();
  };

  return (
    <Menu borderless className={styles.menu}>
      <Menu.Menu position="right">
        <Menu.Item className={styles.items}>
          {status === "authenticated" ? (
            <strong>{session.user.name}</strong>
          ) : null}
        </Menu.Item>

        <Menu.Item onClick={() => null}>
          <Popover
            title="Notificaciones"
            placement="bottomRight"
            trigger={"click"}
            content={
              <div className="ctn-scroll" style={{ height: "350px" }}>
                <List
                  size="small"
                  dataSource={notificaciones}
                  renderItem={(item, index) => (
                    <List.Item
                      key={item.id}
                      className={styles.notificaciones}
                      onClick={() => eventoNotificacion(item.id, item.url)}
                    >
                      <List.Item.Meta
                        title={item.mensaje}
                        description={moment
                          .utc(item.fechaCreacion)
                          .format("DD MMM [a las] HH:mm")}
                      />
                      <div>
                        {!item.leida ? <Badge status="processing" /> : null}
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            }
          >
            <Badge count={notificaciones.filter((item) => !item.leida).length}>
              <Icon
                name="bell outline"
                size="large"
                className={styles.menu_icon}
              />
            </Badge>
          </Popover>
        </Menu.Item>
        <Menu.Item onClick={() => signOut({ callbackUrl: "/" })}>
          <Icon name="sign-out" size="large" className={styles.menu_icon} />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
