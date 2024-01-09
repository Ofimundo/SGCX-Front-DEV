import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Modal } from "antd";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { Form } from "semantic-ui-react";
import { generarOpcionesDropdown } from "../../../Function";
import {
  actualizarTicket,
  obtenerClienteOSerie,
  actualizarSerieTicket,
  listarTipificacionProblema,
} from "../../../apis";

export function TicketServicioFormulario({ ticket, onRecargar }) {
  const { data: session } = useSession();
  const [tipificacion, setTipificacion] = useState([]);
  const [datosClientes, setDatosClientes] = useState([]);
  const [dataSerieCliente, setDataSerieCliente] = useState([]);

  const [modal, modalContextHolder] = Modal.useModal();

  //AL RENDERIZAR LA PAGINA POR 1° SE EJECUTA ESTO
  useEffect(() => {
    (async () => {
      try {
        const response = await listarTipificacionProblema(session.id_token);
        setTipificacion(response);
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formikTicketServicio = useFormik({
    initialValues: {
      serieEquipo: ticket?.serieEquipo || "",
      tipificacion: "",
    },
    validationSchema: Yup.object().shape({
      serieEquipo: Yup.string().required(true),
      tipificacion: Yup.string().required(true),
    }),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        if (ticket.serieEquipo === "N/A") {
          const serieTicket = {
            idIncidencia: ticket.idIncidencia,
            serieEquipo: datosClientes.eqSerie,
            codCliente: datosClientes.codCliente,
            folioContrato: datosClientes.folioContrato,
          };
          await actualizarSerieTicket(serieTicket, session.id_token);
        }
        const detalleTicket = {
          tipoActualizacion: 7,
          idIncidencia: ticket.idIncidencia,
          usuarioAsignado: ticket.idUsuarioAsignado,
          areaResponsable: ticket.idAreaResponsable,
          serieEquipo: formValue.serieEquipo,
          tipificacion: formValue.tipificacion,
        };
        await actualizarTicket(detalleTicket, session.id_token);
        modal.success({
          content: "Ticket derivado a OFITEC",
        });
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

  const buscarSerie = async (texto, tipo) => {
    if (texto.length >= 4) {
      const response = await obtenerClienteOSerie(
        tipo,
        texto,
        session.id_token
      );
      setDataSerieCliente(generarOpcionesDropdown(response, "eqSerie"));
    }
  };

  const asignarDatosCliente = async (data) => {
    const response = await obtenerClienteOSerie(
      1,
      data.value,
      session.id_token
    );
    setDatosClientes(response[0]);
    formikTicketServicio.setFieldValue("serieEquipo", data.value);
  };

  return (
    <>
      {modalContextHolder}

      <Form onSubmit={formikTicketServicio.handleSubmit}>
        <Form.Group widths={"equal"}>
          {ticket.serieEquipo !== "N/A" ? (
            <Form.Input
              label="N° Serie"
              name="serieEquipo"
              readOnly={true}
              value={formikTicketServicio.values.serieEquipo.toUpperCase()}
              onChange={formikTicketServicio.handleChange}
              error={formikTicketServicio.errors.serieEquipo}
            />
          ) : (
            <Form.Dropdown
              label="N° Serie"
              name="serieEquipo"
              search
              selection
              selectOnBlur={false}
              options={dataSerieCliente}
              noResultsMessage={"No hay datos"}
              onSearchChange={(e, { searchQuery }) =>
                buscarSerie(searchQuery, 1)
              }
              placeholder="Ejemplo: A0123B321"
              value={formikTicketServicio.values.serieEquipo}
              error={formikTicketServicio.errors.serieEquipo}
              onChange={(_, data) => asignarDatosCliente(data)}
            />
          )}
        </Form.Group>
        <Form.Group widths={"equal"}>
          <Form.Dropdown
            label="Tipificación del Problema"
            name="tipificacion"
            selection
            options={tipificacion}
            noResultsMessage={null}
            selectOnBlur={false}
            placeholder="Seleccione el tipo de problema"
            value={formikTicketServicio.values.tipificacion}
            error={formikTicketServicio.errors.tipificacion}
            onChange={(_, data) =>
              formikTicketServicio.setFieldValue("tipificacion", data.value)
            }
          />
        </Form.Group>
        <Form.Button type="submit" color="blue">
          Crear Ticket
        </Form.Button>
      </Form>
    </>
  );
}
