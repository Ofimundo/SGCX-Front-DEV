import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Modal, notification } from "antd";
import { useSession } from "next-auth/react";
import { Button, Form } from "semantic-ui-react";
import { agregarComentarioTicket, actualizarTicket } from "../../../apis";

export function ComentarioFormulario({ incidencia, onRecargar, estado }) {
  const { data: session } = useSession();

  const [modal, modalContextHolder] = Modal.useModal();
  const [api, notificationContextHolder] = notification.useNotification();

  const formikComentario = useFormik({
    initialValues: { comentario: "" },
    validationSchema: Yup.object().shape({
      comentario: Yup.string().required(true),
    }),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const detalleComentario = {
          incidencia: incidencia.idIncidencia,
          comentario: formValue.comentario,
        };

        if (estado) {
          const detalleTicket = {
            idIncidencia: incidencia.idIncidencia,
            tipoActualizacion: estado,
            areaResponsable: incidencia.idAreaResponsable,
            usuarioAsignado: incidencia.idUsuarioAsignado,
          };
          const response = await actualizarTicket(
            detalleTicket,
            session.id_token
          );
          await agregarComentarioTicket(detalleComentario, session.id_token);

          api.success({
            duration: 3,
            closeIcon: false,
            placement: "top",
            message: response.message,
          });
        } else {
          const response = await agregarComentarioTicket(
            detalleComentario,
            session.id_token
          );
          api.success({
            duration: 3,
            closeIcon: false,
            placement: "top",
            message: response.message,
          });
        }
        formikComentario.resetForm();
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      } finally {
        onRecargar();
      }
    },
  });

  return (
    <>
      {modalContextHolder}
      {notificationContextHolder}

      <Form onSubmit={formikComentario.handleSubmit}>
        <Form.Group widths={"equal"}>
          <Form.TextArea
            style={{ minHeight: 140, textTransform: "uppercase" }}
            label="Comentario"
            name="comentario"
            maxLength={1000}
            placeholder="Escribe tus comentarios aquí"
            value={formikComentario.values.comentario}
            onChange={formikComentario.handleChange}
            error={formikComentario.errors.comentario}
          />
        </Form.Group>
        <Button type="submit" color="blue" content={"Guardar"} />
      </Form>
    </>
  );
}
