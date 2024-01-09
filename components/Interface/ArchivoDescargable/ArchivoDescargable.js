import React from "react";
import { Icon } from "semantic-ui-react";
import styles from "./ArchivoDescargable.module.css";

export function ArchivoDescargable({ icono, nombre, tamaño, evento }) {
  return (
    <>
      <div className={styles.download} onClick={() => evento(nombre)}>
        <div>
          <Icon name={icono} size="big" />
        </div>
        <div className={styles.detail}>
          <div>{nombre}</div>
          <div>{tamaño}</div>
        </div>
      </div>
    </>
  );
}
