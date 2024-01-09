import React, { useState } from "react";
import { Form, Icon, Statistic, Grid } from "semantic-ui-react";
import { Modal } from "antd";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import {
  ModalPersonalizado,
  EnviarCorreoEquipos,
  ListarEquiposDesconectados,
} from "../components";
import { obtenerPermisos } from "../Function";
import { obtenerEquiposDesconectados } from "../apis";

export default function EquiposDesconectados() {
  const { data: session } = useSession();
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const [tamanio, setTamanio] = useState("small");
  const [tituloModal, setTituloModal] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [contenidoModal, setContenidoModal] = useState(null);

  const [modal, contextHolder] = Modal.useModal();

  const abrirCerrarModal = () => setMostrarModal((prev) => !prev);

  const monitoreo = [
    { key: 1, text: "KFS", value: "1" },
    { key: 2, text: "NUBEPRINT", value: "2" },
    //{ key: 3, text: "XEROX", value: "3" },
  ];

  const formikEquipos = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(ValidationSchema()),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        setEquipos([]);
        setCargando(true);
        const response = await obtenerEquiposDesconectados(
          formValue.sistema,
          session.id_token
        );
        setEquipos(response);
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      } finally {
        setCargando(false);
      }
    },
  });

  const onRecargar = () => {
    formikEquipos.handleSubmit();
  };

  const enviarCorreo = (equipos, detalleEquipos) => {
    if (equipos.length !== 0) {
      setContenidoModal(
        <EnviarCorreoEquipos
          equipos={equipos}
          detalle={detalleEquipos}
          sistema={formikEquipos.values.sistema}
          onRecargar={onRecargar}
        />
      );
      abrirCerrarModal();
    } else {
      modal.info({
        content: "No hay equipos seleccionados",
      });
    }
  };

  return (
    <>
      {contextHolder}

      <Grid columns="equal" stackable>
        <Grid.Row stretched>
          <Grid.Column>
            <div className="ctn-card">
              <Form onSubmit={formikEquipos.handleSubmit}>
                <Form.Group widths={"equal"}>
                  <Form.Dropdown
                    fluid
                    selection
                    name="sistema"
                    label="Servicio de monitoreo"
                    placeholder="Seleccione una opción"
                    selectOnBlur={false}
                    options={monitoreo}
                    value={formikEquipos.values.sistema}
                    error={formikEquipos.errors.sistema}
                    onChange={(_, data) =>
                      formikEquipos.setFieldValue("sistema", data.value)
                    }
                  />

                  <Form.Button
                    label="‎"
                    type="submit"
                    color="black"
                    content="Buscar"
                    disabled={obtenerPermisos(session.permissions, 29)}
                  />
                </Form.Group>
              </Form>
            </div>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <div className="ctn-card">
              <strong>RESUMEN</strong>

              <Statistic.Group widths={4} size="tiny">
                <Statistic>
                  <Statistic.Value
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "0.2em",
                    }}
                  >
                    <Icon name="print" color="grey" />
                    {equipos.length}
                  </Statistic.Value>
                  <Statistic.Label>TOTAL</Statistic.Label>
                </Statistic>

                <Statistic>
                  <Statistic.Value
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "0.2em",
                    }}
                  >
                    <Icon name="power off" color="green" />
                    {
                      equipos.filter(
                        (item) =>
                          item.diasDesconectado > 0 &&
                          item.diasDesconectado <= 3
                      ).length
                    }
                  </Statistic.Value>
                  <Statistic.Label>1-3 DIAS</Statistic.Label>
                </Statistic>

                <Statistic>
                  <Statistic.Value
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "0.2em",
                    }}
                  >
                    <Icon name="power off" color="yellow" />
                    {
                      equipos.filter(
                        (item) =>
                          item.diasDesconectado > 3 &&
                          item.diasDesconectado <= 7
                      ).length
                    }
                  </Statistic.Value>
                  <Statistic.Label>+3 DIAS</Statistic.Label>
                </Statistic>

                <Statistic>
                  <Statistic.Value
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "0.2em",
                    }}
                  >
                    <Icon name="power off" color="red" />
                    {equipos.filter((item) => item.diasDesconectado > 7).length}
                  </Statistic.Value>
                  <Statistic.Label>+7 DIAS</Statistic.Label>
                </Statistic>
              </Statistic.Group>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <ListarEquiposDesconectados
        equipos={equipos}
        cargando={cargando}
        enviarCorreo={enviarCorreo}
      />

      <ModalPersonalizado
        tamanio={tamanio}
        titulo={tituloModal}
        mostrar={mostrarModal}
        children={contenidoModal}
        cerrar={abrirCerrarModal}
      />
    </>
  );
}

function initialValues() {
  return {
    sistema: "",
  };
}

function ValidationSchema() {
  return {
    sistema: Yup.string().required(true),
  };
}
