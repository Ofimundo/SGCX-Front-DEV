import React from "react";
import { Drawer } from "antd";

export function DrawerPersonalizado({
  titulo,
  cerrar,
  mostrar,
  children,
  tamaño,
}) {
  return (
    <>
      <Drawer
        title={titulo}
        placement="right"
        onClose={cerrar}
        open={mostrar}
        size={tamaño ? tamaño : "default"}
        destroyOnClose
      >
        {children}
      </Drawer>
    </>
  );
}
