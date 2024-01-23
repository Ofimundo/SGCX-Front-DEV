import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import moment from "moment";
import Link from "next/link";
import {
  IncidenciaFormulario,
  DrawerPersonalizado,
  IncidenciaDetalle,
  BuscadorTicket,
} from "../../../components";
import { useFormik } from "formik";
import { Table, Modal, Tooltip } from "antd";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { generarURL } from "../../../Function";
import { usePathname, useSearchParams } from "next/navigation";
import {
  listarTickets,
  listarDetalleTicket,
  listarCorreosRespuesta,
} from "../../../apis";
import { Grid, Form, Button, Label } from "semantic-ui-react";
import {
  obtenerPermisos,
  calcularMinutos,
  convertirMinutosAHorasYMinutos,
} from "../../../Function";

export default function ParqueRegistrado() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [modal, contextHolder] = Modal.useModal();
  const [recargar, setRecargar] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [tituloDrawer, setTituloDrawer] = useState("");
  const [filtroTickets, setFiltroTickets] = useState([]);
  const [mostrarDrawer, setMostrarDrawer] = useState(false);
  const [contenidoDrawer, setContenidoDrawer] = useState(null);

  const onRecargar = () => setRecargar((prev) => !prev);
  const abrirCerrarDrawer = () => setMostrarDrawer((prev) => !prev);

  const formikFiltros = useFormik({
    initialValues: initialValues(router.query),
    validationSchema: Yup.object().shape(validationSchema()),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        console.log(formValue);
        /*
        router.push(generarURL(pathname, router.query, formValue), undefined, {
          shallow: false,
        });
        */
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      }
    },
  });

  const columnas = [
    {
      render: (record) => (
        <Label
          circular
          size="tiny"
          empty
          color={calcularMinutos(record.fechaCreacion)}
        />
      ),
      width: 25,
      fixed: "left",
      align: "center",
    },
    {
      title: "Ticket",
      render: (record) => (
        <Link href={`/mesa-ayuda/tickets/detalle/${record.idIncidencia}`}>
          {record.idIncidencia}
        </Link>
      ),
      width: 90,
      fixed: "left",
      sorter: (a, b) => a.idIncidencia - b.idIncidencia,
    },
    {
      title: "Estado",
      render: (record) => (
        <>
          <Label
            size="small"
            content={record.ultimoEstado}
            color={obtenerColorUltimoEstado(record.ultimoEstado)}
          />
        </>
      ),
      width: 140,
      sorter: (a, b) => a.ultimoEstado.localeCompare(b.ultimoEstado),
    },
    {
      title: "Empresa",
      dataIndex: "nombreCliente",
      width: 160,
      ellipsis: true,
      sorter: (a, b) => a.nombreCliente.localeCompare(b.nombreCliente),
    },
    {
      title: "Problema",
      dataIndex: "subCategoria",
      width: 215,
      sorter: (a, b) => a.subCategoria.localeCompare(b.subCategoria),
      ellipsis: {
        showTitle: false,
      },
      render: (subCategoria) => (
        <Tooltip placement="topLeft" title={subCategoria}>
          {subCategoria}
        </Tooltip>
      ),
    },
    {
      title: "Asunto",
      dataIndex: "asuntoCorreo",
      width: 215,
      sorter: (a, b) => a.asuntoCorreo.localeCompare(b.asuntoCorreo),
      ellipsis: {
        showTitle: false,
      },
      render: (asuntoCorreo) => (
        <Tooltip placement="topLeft" title={asuntoCorreo}>
          {asuntoCorreo}
        </Tooltip>
      ),
    },
    {
      title: "Tiempo Límite",
      render: (record) => (
        <Label
          size="small"
          icon="clock outline"
          content={convertirMinutosAHorasYMinutos(record.tiempoRestante)}
          color={record.tiempoRestante !== 0 ? "blue" : "red"}
        />
      ),
      width: 125,
      align: "center",
      sorter: (a, b) => a.tiempoRestante - b.tiempoRestante,
    },
    {
      title: "Usuario Asignado",
      dataIndex: "usuarioAsignado",
      width: 160,
      ellipsis: true,
      sorter: (a, b) => a.usuarioAsignado.localeCompare(b.usuarioAsignado),
    },
    {
      title: "Fecha de Creación",
      render: (record) =>
        moment.utc(record.fechaCreacion).format("YYYY-MM-DD HH:mm"),
      width: 160,
      sorter: (a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion),
    },
  ];

  const estadoTicket = [
    { key: 1, text: "VIGENTE", value: "1" },
    { key: 2, text: "VENCIDO", value: "2" },
  ];

  return (
    <>
      {contextHolder}

      <div className="btn-navbar between">
        <>
          <Button
            color="blue"
            icon="angle left"
            content="Atras"
            onClick={() => router.back()}
          />
          <div>
            <BuscadorTicket />
          </div>
        </>
      </div>

      <Grid columns="equal" style={{ marginTop: "1em" }}>
        <Grid.Row>
          <Grid.Column width={16}>
            <Form onSubmit={formikFiltros.handleSubmit}>
              <Form.Group widths="5">
                <Form.Dropdown
                  fluid
                  selection
                  clearable
                  label="Estado"
                  name="estado"
                  aria-label="filtros"
                  selectOnBlur={false}
                  options={estadoTicket}
                  value={formikFiltros.values.estado}
                  error={formikFiltros.errors.estado}
                  onChange={(_, data) =>
                    formikFiltros.setFieldValue("estado", data.value)
                  }
                />

                <Form.Button
                  fluid
                  width={2}
                  label="‎"
                  content="Aplicar"
                  color="blue"
                  type="submit"
                />
                <Form.Button
                  fluid
                  width={2}
                  label="‎"
                  content="Limpiar"
                  color="black"
                  type="button"
                  onClick={() => {
                    formikFiltros.resetForm();
                    router.push(`/mesa-ayuda/tickets`);
                  }}
                />
              </Form.Group>
            </Form>
          </Grid.Column>

          <Grid.Column>
            <div className="ctn-card" style={{ marginTop: "1em" }}>
              <Table
                columns={columnas}
                dataSource={filtroTickets}
                scroll={{ x: "80vw" }}
                size="small"
                showSorterTooltip={false}
                pagination={{ defaultPageSize: 25 }}
                loading={cargando}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: () => verDetalleTicket(record),
                  };
                }}
                sticky={{
                  offsetHeader: 0,
                }}
                footer={() => (
                  <div style={{ margin: "0.2em 0" }}>
                    <Grid verticalAlign="middle" textAlign="center">
                      <Grid.Column>
                        Total Tickets: <strong>{filtroTickets.length}</strong>
                      </Grid.Column>
                    </Grid>
                  </div>
                )}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <DrawerPersonalizado
        tamaño={"large"}
        titulo={tituloDrawer}
        mostrar={mostrarDrawer}
        cerrar={abrirCerrarDrawer}
        children={contenidoDrawer}
      />
    </>
  );
}

function obtenerColorUltimoEstado(estado) {
  switch (estado) {
    case "RECIBIDO":
      return "red";
    case "ASIGNADO":
      return "blue";
    case "GESTIONANDO":
      return "orange";
    case "RESUELTO":
      return "purple";
    case "INCOMPLETO":
      return "teal";
    case "DERIVADO OFITEC":
      return "green";
    case "ANULADO":
      return "brown";
    default:
      return "grey";
  }
}

function initialValues(data) {
  return {
    //estado: data.estado?.split(",").map(Number) || [],
    estado: data?.estado || "",
    responsable: data?.responsable || "",
    periodo: data?.periodo || "",
  };
}

function validationSchema() {
  return {
    estado: Yup.string(),
    responsable: Yup.string(),
    periodo: Yup.string(),
  };
}
