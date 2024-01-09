import React from "react";
import { Alert, Space, Spin } from "antd";
import styles from "./Cargando.module.css";

export function Cargando() {
  return (
    <div className={styles.main}>
      <Spin size="large" />
    </div>
  );
}
