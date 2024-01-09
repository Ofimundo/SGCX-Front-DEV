import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Modal, Table } from "antd";
import { useSession } from "next-auth/react";
import { Form, Grid } from "semantic-ui-react";
import {
  obtenerDatosContacto,
  enviarCorreoEquiposDesconectados,
} from "../../../apis";

export function EnviarCorreoEquipos({ equipos, detalle, sistema, onRecargar }) {
  const { data: session } = useSession();
  const [equiposContacto, setEquiposContacto] = useState([]);
  const [correosAdjuntos, setCorreosAdjuntos] = useState([]);

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    (async () => {
      try {
        const response = await obtenerDatosContacto(equipos, session.id_token);
        setEquiposContacto(response);
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formikCorreo = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(ValidationSchema()),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const datos = {
          sistema: sistema,
          equipos: equipos,
          correoPrincipal: formValue.correoPrincipal,
          correoAdjunto: formValue.correoAdjunto,
        };
        const response = await enviarCorreoEquiposDesconectados(
          datos,
          session.id_token
        );
        modal.success({
          content: response.message,
        });
        onRecargar();
        formikCorreo.resetForm();
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      }
    },
  });

  const agregarCorreo = (e, { value }) => {
    const nuevoCorreo = {
      key: equiposContacto.slice(-1)[0]?.key + 1 || 0,
      text: value.toUpperCase(),
      value: value,
    };
    setEquiposContacto([...equiposContacto, nuevoCorreo]);
  };
  const agregarCorreoAdjunto = (e, { value }) => {
    const nuevoCorreo = {
      key: correosAdjuntos.slice(-1)[0]?.key + 1 || 0,
      text: value.toUpperCase(),
      value: value,
    };
    setCorreosAdjuntos([...correosAdjuntos, nuevoCorreo]);
  };

  const columnas = [
    {
      title: "N° Serie",
      dataIndex: "equipoSerie",
    },
    {
      title: "IP",
      dataIndex: "equipoIP",
    },
    {
      title: "Modelo",
      dataIndex: "equipoModelo",
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
    },
    {
      title: "Comuna",
      dataIndex: "comuna",
    },
  ];

  return (
    <>
      {contextHolder}

      <Form onSubmit={formikCorreo.handleSubmit}>
        <Form.Group widths={"equal"}>
          <Form.Input
            fluid
            label="De:"
            readOnly={true}
            value="ALVARO@OFIMUNDO.CL"
          />
        </Form.Group>
        <Form.Group widths={"equal"}>
          <Form.Field>
            <Form.Dropdown
              fluid
              label="Para:"
              name="correoPrincipal"
              search
              multiple
              selection
              allowAdditions
              closeOnChange
              additionLabel="Añadir Correo: "
              noResultsMessage={"No hay datos"}
              placeholder="Seleccione o ingresa un correo electrónico"
              options={equiposContacto}
              value={formikCorreo.values.correoPrincipal}
              error={formikCorreo.errors.correoPrincipal}
              onChange={(_, data) =>
                formikCorreo.setFieldValue("correoPrincipal", data.value)
              }
              onAddItem={agregarCorreo}
            />
          </Form.Field>
        </Form.Group>

        <Form.Group widths={"equal"}>
          <Form.Dropdown
            fluid
            label="CC:"
            name="correoAdjunto"
            search
            multiple
            selection
            allowAdditions
            closeOnChange
            additionLabel="Añadir Correo: "
            noResultsMessage={null}
            placeholder="Ingresa un correo electrónico (opcional)"
            options={correosAdjuntos}
            value={formikCorreo.values.correoAdjunto}
            error={formikCorreo.errors.correoAdjunto}
            onChange={(_, data) =>
              formikCorreo.setFieldValue("correoAdjunto", data.value)
            }
            onAddItem={agregarCorreoAdjunto}
          />
        </Form.Group>

        <Table
          columns={columnas}
          dataSource={detalle}
          size="small"
          rowKey="equipoSerie"
          bordered
          pagination={false}
          footer={() => (
            <div style={{ margin: "0.2em 0" }}>
              <Grid verticalAlign="middle" textAlign="center">
                <Grid.Column>
                  Total Equipos: <strong>{equipos.length}</strong>
                </Grid.Column>
              </Grid>
            </div>
          )}
        />

        <Form.Group widths={"equal"} style={{ marginTop: "14px" }}>
          <Form.Button type="submit" color="black" content="Enviar" />
        </Form.Group>
      </Form>
    </>
  );
}

function initialValues() {
  return {
    correoPrincipal: [],
    correoAdjunto: [],
  };
}

function ValidationSchema() {
  return {
    correoPrincipal: Yup.array().min(
      1,
      "Debes ingresar al menos un correo electrónico"
    ),
    correoAdjunto: Yup.array(),
  };
}
