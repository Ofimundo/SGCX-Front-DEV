import React, { useState } from "react";
import * as Yup from "yup";
import moment from "moment";
import { Table, Modal } from "antd";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { ListarSeguimiento } from "../modules";
import { DrawerPersonalizado } from "../components";
import { Form, Grid, Label, Button } from "semantic-ui-react";
import { listarDespachos, seguimientoDespachos } from "../apis";

export default function SeguimientoEnvios() {
  const { data: session } = useSession();
  const [filtro, setFiltro] = useState("");

  const [enviosFiltrada, setEnviosFiltrada] = useState([]);
  const [enviosOriginal, setEnviosOriginal] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  const [tituloDrawer, setTituloDrawer] = useState("");
  const [mostrarDrawer, setMostrarDrawer] = useState(false);
  const [contenidoDrawer, setContenidoDrawer] = useState(null);

  const abrirCerrarDrawer = () => setMostrarDrawer((prev) => !prev);

  const columnas = [
    {
      title: "Folio",
      dataIndex: "folio",
      width: 80,
      fixed: "left",
      sorter: (a, b) => a.folio - b.folio,
    },
    {
      title: "PK/OD/OR",
      dataIndex: "numOrden",
      width: 90,
      sorter: (a, b) => a.numOrden - b.numOrden,
    },
    {
      title: "Cod. Envío",
      dataIndex: "codigoEnvio",
      width: 115,
    },
    {
      title: "Tipo",
      render: (record) => record.rutaTipo,
      sorter: (a, b) => a.rutaTipo.localeCompare(b.rutaTipo),
      width: 100,
    },
    {
      title: "Documento",
      render: (record) =>
        record.fechaDocumento
          ? moment(record.fechaDocumento).format("DD/MM/YYYY")
          : "",
      width: 100,
      sorter: (a, b) => new Date(a.fechaDocumento) - new Date(b.fechaDocumento),
    },
    {
      title: "Cod. Cliente",
      render: (record) => record.codCliente,
      width: 100,
      sorter: (a, b) => a.codCliente.localeCompare(b.codCliente),
    },
    {
      title: "Nombre Cliente",
      render: (record) => record.razonSocial,
      width: 180,
      ellipsis: true,
      sorter: (a, b) => a.razonSocial.localeCompare(b.razonSocial),
    },
    {
      title: "Dirección",
      render: (record) => record.direccion.toUpperCase(),
      width: 180,
      ellipsis: true,
      sorter: (a, b) => a.direccion.localeCompare(b.direccion),
    },
    {
      title: "Comuna",
      render: (record) => record.comuna,
      width: 110,
      ellipsis: true,
      sorter: (a, b) => a.comuna.localeCompare(b.comuna),
    },
    {
      title: "Courrier",
      render: (record) => (
        <Label
          size="small"
          content={record.courrier}
          color={
            record.courrier === "CHILEXPRESS"
              ? "orange"
              : record?.courrier === "FEDEX"
              ? "blue"
              : "green"
          }
        />
      ),
      width: 105,
      sorter: (a, b) => a.courrier.localeCompare(b.courrier),
    },
    {
      title: "N° Ruta",
      render: (record) => record.numRuta,
      width: 90,
      sorter: (a, b) => a.numRuta - b.numRuta,
    },
    {
      title: "Envío",
      render: (record) =>
        record.courrier !== "OFIMUNDO"
          ? record.fechaEnvio
            ? moment(record.fechaEnvio).format("DD/MM/YYYY")
            : ""
          : record.fechaDocumento
          ? moment(record.fechaDocumento).format("DD/MM/YYYY")
          : "",
      width: 90,
      sorter: (a, b) => new Date(a.fechaEnvio) - new Date(b.fechaEnvio),
    },
    {
      render: (record) =>
        record.codigoEnvio === "N/D" ? null : (
          <Button
            type="button"
            size="tiny"
            color={[6, 9].includes(record.trazaEstado) ? "green" : "red"}
            icon={[6, 9].includes(record.trazaEstado) ? "check" : "shipping"}
            onClick={() => revisarSeguimiento(record)}
          />
        ),
      align: "center",
      fixed: "right",
      width: 60,
    },
  ];

  const columnasSeguimiento = [
    {
      title: "Fecha",
      render: (record) =>
        record.fecha_evento
          ? moment(record.fecha_evento).format("DD/MM/YYYY")
          : moment(record.eventDate).format("DD/MM/YYYY"),
      width: 90,
      sorter: (a, b) =>
        new Date(a?.fecha_evento || eventDate) -
        new Date(b?.fecha_evento || eventDate),
    },
    {
      title: "Hora",
      render: (record) =>
        record.fecha_evento
          ? moment.utc(record.fecha_evento).format("HH:mm:ss")
          : moment.utc(record.eventDateTime).format("HH:mm:ss"),
      width: 90,
      sorter: (a, b) =>
        new Date(a?.fecha_evento || eventDateTime) -
        new Date(b?.fecha_evento || eventDateTime),
    },
    {
      title: "Actividad",
      render: (record) =>
        record.descripcion
          ? record.descripcion.toUpperCase()
          : record.description.toUpperCase(),
      width: 240,
    },
  ];

  const formikEnvios = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(ValidationSchema()),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        setEnviosFiltrada([]);
        setFiltro("");
        setCargando(true);

        const response = await listarDespachos(
          formValue.fechaInicio,
          formValue.fechaFin,
          session.id_token
        );
        setEnviosFiltrada(response);
        setEnviosOriginal(response);
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

  const revisarSeguimiento = async (data) => {
    setTituloDrawer(`Despacho N° ${data.folio}`);
    try {
      const response = await seguimientoDespachos(
        data.courrier,
        data.codigoEnvio,
        data.folio,
        session.id_token
      );
      setContenidoDrawer(
        <>
          <ListarSeguimiento despacho={response} />
        </>
      );
      abrirCerrarDrawer();
    } catch (error) {
      modal.error({
        title: "Ups, algo salió mal",
        content: error.message,
      });
    }
  };

  const filtrarPorColumnas = (e) => {
    setFiltro(e.target.value);
    setEnviosFiltrada(
      enviosOriginal.filter(
        (item) =>
          item.folio.toString().includes(e.target.value) ||
          item.numOrden.toString().includes(e.target.value) ||
          item.codigoEnvio.toString().includes(e.target.value) ||
          item.rutaTipo.includes(e.target.value.toUpperCase()) ||
          item.razonSocial.includes(e.target.value.toUpperCase()) ||
          item.direccion.includes(e.target.value.toUpperCase()) ||
          //item.comuna.includes(e.target.value.toUpperCase()) ||
          item.courrier.includes(e.target.value.toUpperCase()) ||
          item.codCliente.toString().includes(e.target.value) ||
          item.numRuta.toString().includes(e.target.value)
      )
    );
  };

  return (
    <>
      {contextHolder}

      <Form onSubmit={formikEnvios.handleSubmit}>
        <Form.Group widths={"6"}>
          <Form.Input
            fluid
            name="fechaInicio"
            type="date"
            label="Fecha Inicio"
            value={formikEnvios.values.fechaInicio}
            onChange={formikEnvios.handleChange}
            error={formikEnvios.errors.fechaInicio}
          />
          <Form.Input
            fluid
            name="fechaFin"
            type="date"
            label="Fecha Fin"
            value={formikEnvios.values.fechaFin}
            onChange={formikEnvios.handleChange}
            error={formikEnvios.errors.fechaFin}
          />
          <Form.Button label="‎" type="submit" color="blue" content="Buscar" />
        </Form.Group>
      </Form>

      <div className="ctn-card up">
        <Form>
          <Form.Group widths="4">
            <Form.Input
              fluid
              label="Filtros"
              icon="search"
              placeholder="Buscar por folio, picking, envío, etc..."
              value={filtro.toUpperCase()}
              onChange={filtrarPorColumnas}
            />
          </Form.Group>
        </Form>

        <Table
          columns={columnas}
          dataSource={enviosFiltrada}
          loading={cargando}
          scroll={{ x: 70 }}
          pagination={{ defaultPageSize: 15 }}
          size="small"
          rowKey="indice"
          bordered
          showSorterTooltip={false}
          sticky={{
            offsetHeader: 0,
          }}
          footer={() => (
            <div style={{ margin: "0.4em 0" }}>
              <Grid verticalAlign="middle" textAlign="center">
                <Grid.Column>
                  Total Equipos: <strong>{enviosFiltrada.length}</strong>
                </Grid.Column>
              </Grid>
            </div>
          )}
        />
      </div>

      <DrawerPersonalizado
        tamaño={window.innerWidth >= 768 ? "large" : "default"}
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
    fechaInicio: "",
    fechaFin: moment().format("YYYY-MM-DD"),
  };
}

function ValidationSchema() {
  return {
    fechaInicio: Yup.date().required(true),
    fechaFin: Yup.date().required(true),
  };
}
