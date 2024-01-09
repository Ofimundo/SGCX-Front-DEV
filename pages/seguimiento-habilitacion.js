import React, { useState } from "react";
import { Form, Grid, Icon } from "semantic-ui-react";
import { useSession } from "next-auth/react";
import { Modal, Descriptions } from "antd";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  obtenerEquipos,
  correoActualizarFechas,
  actualizarFechasEquipos,
} from "../apis";
import {
  ListarEquipos,
  CardPersonalizado,
  BuscadorContratos,
  DrawerPersonalizado,
} from "../components";

export default function SeguimientoHabilitacion() {
  const { data: session } = useSession();

  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [contrato, setContrato] = useState(undefined);
  const [fechasActualizadas, setFechasActualizadas] = useState(new Set());

  const [modal, contextHolder] = Modal.useModal();

  const [tituloDrawer, setTituloDrawer] = useState("");
  const [tamañoDrawer, setTamañoDrawer] = useState("default");
  const [mostrarDrawer, setMostrarDrawer] = useState(false);
  const [contenidoDrawer, setContenidoDrawer] = useState(null);

  const abrirCerrarDrawer = () => setMostrarDrawer((prev) => !prev);

  const formikContrato = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(ValidationSchema()),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        setEquipos([]);
        setCargando(true);
        setContrato(formValue.folioContrato);
        setFechasActualizadas(new Set());
        const response = await obtenerEquipos(
          formValue.folioContrato,
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

  const actualizarFechas = async (fecha, data, tipoFecha) => {
    try {
      setFechasActualizadas(fechasActualizadas.add(tipoFecha));
      const fechaEquipos = {
        serie: data.serie,
        eqAgrupa: data.eqAgrupa,
        fechaEstimada: fecha,
        tipoFecha: tipoFecha,
        contrato: formikContrato.values.folioContrato,
      };
      await actualizarFechasEquipos(fechaEquipos, session.id_token);
    } catch (error) {
      modal.error({
        title: "Ups, algo salió mal",
        content: error.message,
      });
    }
  };

  const actualizarRegistros = async () => {
    if (fechasActualizadas.size !== 0) {
      try {
        if (fechasActualizadas.has("e")) {
          await correoActualizarFechas(
            formikContrato.values.folioContrato,
            session.id_token
          );
        }

        formikContrato.handleSubmit();
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      }
    } else {
      modal.info({
        content: "No has realizado ningún cambio de fecha",
      });
    }
  };

  const verDetalleMaquina = async (maquina) => {
    setTamañoDrawer("default");
    setTituloDrawer(<>Impresora N° {maquina.indice}</>);
    setContenidoDrawer(
      <>
        <Descriptions bordered layout="vertical" column={1} size="small">
          <Descriptions.Item label={<strong>Contacto </strong>}>
            {maquina.nombreContacto}
          </Descriptions.Item>
          <Descriptions.Item label={<strong>Teléfono / Celular</strong>}>
            {maquina.fonoContacto}
          </Descriptions.Item>
          <Descriptions.Item label={<strong>Email</strong>} span={2}>
            {maquina.emailContacto}
          </Descriptions.Item>
        </Descriptions>
      </>
    );
    abrirCerrarDrawer();
  };

  const asignarContrato = (contrato) => {
    formikContrato.setFieldValue("folioContrato", contrato);
    formikContrato.handleSubmit();
  };

  const buscarCliente = async () => {
    setTamañoDrawer("large");
    setTituloDrawer(<>Buscador de Cliente</>);
    setContenidoDrawer(<BuscadorContratos asignarContrato={asignarContrato} />);
    abrirCerrarDrawer();
  };

  return (
    <>
      {contextHolder}
      <Grid columns="equal" stackable>
        <Grid.Row stretched>
          <Grid.Column>
            <div className="ctn-card">
              <Form onSubmit={formikContrato.handleSubmit}>
                <Form.Group style={{ marginBottom: "0" }} unstackable>
                  <Form.Input
                    fluid
                    label="N° Contrato"
                    name="folioContrato"
                    placeholder="Ejem: A01234567"
                    width={14}
                    value={formikContrato.values.folioContrato}
                    onChange={formikContrato.handleChange}
                    error={formikContrato.errors.folioContrato}
                  />
                  <Form.Button
                    fluid
                    icon
                    circular
                    color="blue"
                    type="button"
                    label="‎"
                    aria-label="buscador"
                    onClick={() => buscarCliente()}
                  >
                    <Icon name="search" />
                  </Form.Button>
                </Form.Group>
              </Form>
            </div>
          </Grid.Column>

          <Grid.Column>
            <CardPersonalizado
              link={""}
              icono={"shipping fast"}
              color={"blue"}
              texto={"Despacho"}
              valor={
                equipos.filter((item) => item.fechaDespacho !== null).length
              }
            />
          </Grid.Column>
          <Grid.Column>
            <CardPersonalizado
              link={""}
              icono={"dolly"}
              color={"orange"}
              texto={"Entrega"}
              valor={
                equipos.filter((item) => item.fechaEntrega !== null).length
              }
            />
          </Grid.Column>
          <Grid.Column>
            <CardPersonalizado
              link={""}
              icono={"check circle"}
              color={"green"}
              texto={"Habilitación"}
              valor={
                equipos.filter((item) => item.fechaHabilitacion !== null).length
              }
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <ListarEquipos
              equipos={equipos}
              cargando={cargando}
              contrato={contrato}
              contador={fechasActualizadas}
              actualizarFechas={actualizarFechas}
              verDetalleMaquina={verDetalleMaquina}
              actualizarRegistros={actualizarRegistros}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <DrawerPersonalizado
        tamaño={tamañoDrawer}
        titulo={tituloDrawer}
        mostrar={mostrarDrawer}
        cerrar={abrirCerrarDrawer}
        children={contenidoDrawer}
      />
    </>
  );
}

function initialValues() {
  return {
    folioContrato: "",
  };
}

function ValidationSchema() {
  return {
    folioContrato: Yup.string().required(true),
  };
}

/*
<Form.Button
  fluid
  type="button"
  color="green"
  content="Exportar"
  onClick={() => descargarResumen()}
  disabled={
    formikContrato.values.folioContrato
      ? false
      : true || obtenerPermisos(session.permissions, 12)
  }
/>
*/
