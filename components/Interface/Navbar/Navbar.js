import React, { useState, useEffect } from "react";
import { Badge, Avatar, Dropdown, Popover, Typography, List } from "antd";
import { Menu, Icon } from "semantic-ui-react";
import { signOut, useSession } from "next-auth/react";
import styles from "./Navbar.module.css";
import { BellOutlined } from "@ant-design/icons";

import io from "socket.io-client";
const socket = io("http://127.0.0.1:8081");

export function Navbar() {
  const { data: session, status } = useSession();

  const [alertas, setAlertas] = useState(0);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    socket.on("message_response", (msg) => {
      setAlertas(1);
      setNotificaciones(msg);
    });
  }, []);

  return (
    <Menu borderless className={styles.menu}>
      <Menu.Menu position="right">
        <Menu.Item className={styles.items}>
          {status === "authenticated" ? (
            <strong>{session.user.name}</strong>
          ) : null}
        </Menu.Item>

        <Menu.Item onClick={() => setAlertas(0)}>
          <Popover
            content={notificaciones}
            title="Notificaciones"
            trigger="click"
            placement="bottomRight"
          >
            <Badge count={alertas}>
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

/*
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
*/
