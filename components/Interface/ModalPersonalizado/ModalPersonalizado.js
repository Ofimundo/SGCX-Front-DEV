import React from "react";
import { Modal } from "semantic-ui-react";

export function ModalPersonalizado(props) {
  const { mostrar, tamanio, titulo, children, cerrar } = props;

  return (
    <Modal
      size={tamanio}
      open={mostrar}
      onClose={cerrar}
      centered={false}
      closeIcon={true}
    >
      {titulo && <Modal.Header>{titulo}</Modal.Header>}
      <Modal.Content>{children}</Modal.Content>
    </Modal>
  );
}
