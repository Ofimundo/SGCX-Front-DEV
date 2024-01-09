import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Form } from "semantic-ui-react";
import { Modal, notification } from "antd";
import { useSession } from "next-auth/react";
import { generarOpcionesDropdown } from "../../../Function";
import {
  actualizarTicket,
  obtenerAreasYResponsables,
  agregarComentarioTicket,
} from "../../../apis";

export function AsignarFormulario({ ticket, onRecargar }) {
  const { data: session } = useSession();
  const [modal, contextHolder] = Modal.useModal();
  const [api, notificationContextHolder] = notification.useNotification();

  const [usuarioAsignado, setUsuarioAsignado] = useState([]);
  const [areaResponsable, setAreaResponsable] = useState([]);
  const [usuarioResponsable, setUsuarioResponsable] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const responsables = await obtenerAreasYResponsables(session.id_token);
        setAreaResponsable(responsables.areas);
        setUsuarioResponsable(responsables.responsables);
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formikAsignacion = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object().shape(validationSchema()),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const detalleTicket = {
          tipoActualizacion: 3,
          idIncidencia: ticket.idIncidencia,
          usuarioAsignado: formValue.usuarioAsignado,
          areaResponsable: formValue.areaResponsable,
        };
        const response = await actualizarTicket(
          detalleTicket,
          session.id_token
        );

        if (formValue.comentario !== "") {
          const detalleComentario = {
            incidencia: ticket.idIncidencia,
            comentario: formValue.comentario,
          };
          await agregarComentarioTicket(detalleComentario, session.id_token);
        }

        api.success({
          duration: 3,
          closeIcon: false,
          placement: "top",
          message: response.message,
        });
        formikAsignacion.resetForm();
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

  const listarResponsables = (data) => {
    formikAsignacion.setFieldValue("areaResponsable", data.value);
    const filtroResponsable = usuarioResponsable.filter(
      (item) => item.idArea == data.value
    );
    setUsuarioAsignado(
      generarOpcionesDropdown(filtroResponsable, "idUsuario", "nombreUsuario")
    );
  };

  return (
    <>
      {contextHolder}
      {notificationContextHolder}

      <Form onSubmit={formikAsignacion.handleSubmit}>
        <Form.Dropdown
          fluid
          label="Área Resolutora"
          name="areaResponsable"
          selection
          required
          selectOnBlur={false}
          options={areaResponsable}
          placeholder="Seleccione el área responsable"
          value={formikAsignacion.values.areaResponsable}
          error={formikAsignacion.errors.areaResponsable}
          onChange={(_, data) => listarResponsables(data)}
        />
        <Form.Dropdown
          fluid
          selection
          name="usuarioAsignado"
          label="Asignado"
          required
          selectOnBlur={false}
          options={usuarioAsignado}
          placeholder="Seleccione el usuario para asignar"
          value={formikAsignacion.values.usuarioAsignado}
          error={formikAsignacion.errors.usuarioAsignado}
          onChange={(_, data) =>
            formikAsignacion.setFieldValue("usuarioAsignado", data.value)
          }
        />
        <Form.TextArea
          label="Comentario"
          name="comentario"
          maxLength={1000}
          placeholder="Escribe tus comentarios aquí"
          value={formikAsignacion.values.comentario}
          onChange={formikAsignacion.handleChange}
          error={formikAsignacion.errors.comentario}
        />

        <Form.Button type="submit" color="blue" content="Guardar" />
      </Form>
    </>
  );
}
function initialValues() {
  return {
    areaResponsable: "",
    usuarioAsignado: "",
    comentario: "",
  };
}
function validationSchema() {
  return {
    areaResponsable: Yup.string().required(true),
    usuarioAsignado: Yup.string().required(true),
    comentario: Yup.string(),
  };
}
