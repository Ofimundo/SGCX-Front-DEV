import React from "react";
import { LoginForm } from "../components";
import styles from "../styles/Login.module.css";

export function LogoutLayout() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm />
      </div>
    </div>
  );
}
