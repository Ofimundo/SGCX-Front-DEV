import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import moment from "moment";
import Link from "next/link";
import {
  IncidenciaFormulario,
  DrawerPersonalizado,
  IncidenciaDetalle,
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
  listarTicketFiltrado,
  listarCorreosRespuesta,
} from "../../../apis";
import { Grid, Form, Button, Label, Search } from "semantic-ui-react";
import {
  obtenerPermisos,
  calcularMinutos,
  convertirMinutosAHorasYMinutos,
} from "../../../Function";

export default function TotalIncidencias() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [modal, contextHolder] = Modal.useModal();
  const [recargar, setRecargar] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [filtroTicket, setFiltroTicket] = useState("");
  const [ticketsFiltros, setTicketsFiltro] = useState([]);

  const [tituloDrawer, setTituloDrawer] = useState("");
  const [filtroTickets, setFiltroTickets] = useState([]);
  const [mostrarDrawer, setMostrarDrawer] = useState(false);
  const [contenidoDrawer, setContenidoDrawer] = useState(null);

  const onRecargar = () => setRecargar((prev) => !prev);
  const abrirCerrarDrawer = () => setMostrarDrawer((prev) => !prev);

  useEffect(() => {
    (async () => {
      try {
        setCargando(true);
        const tickets = await listarTickets(router.query, session.id_token);
        setFiltroTickets(tickets);
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      } finally {
        setCargando(false);
      }
    })();
  }, [recargar, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const formikFiltros = useFormik({
    initialValues: initialValues(router.query),
    validationSchema: Yup.object().shape(validationSchema()),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        router.push(generarURL(pathname, router.query, formValue), undefined, {
          shallow: false,
        });
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      }
    },
  });

  const registrarIncidencia = () => {
    setTituloDrawer("Crear Ticket");
    setContenidoDrawer(<IncidenciaFormulario onRecargar={onRecargar} />);
    abrirCerrarDrawer();
  };

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

  const buscarPorTicket = async (value) => {
    setFiltroTicket(value);
    if (value.length >= 3) {
      const filtro = await listarTicketFiltrado(value, session.id_token);
      setTicketsFiltro(filtro);
    }
  };

  const estadoTicket = [
    { key: 1, text: "RECIBIDO", value: "1" },
    { key: 3, text: "ASIGNADO", value: "3" },
    { key: 4, text: "GESTIONANDO", value: "4" },
    { key: 5, text: "RESUELTO", value: "5" },
    { key: 6, text: "INCOMPLETO", value: "6" },
    { key: 7, text: "DERIVADO OFITEC", value: "7" },
    { key: 8, text: "ANULADO", value: "8" },
  ];
  const periodoTicket = [
    { key: 1, text: "HOY", value: "1" },
    { key: 2, text: "AYER", value: "2" },
    { key: 3, text: "ÚLTIMOS 7 DÍAS", value: "3" },
    { key: 4, text: "ÚLTIMOS 30 DÍAS", value: "4" },
    { key: 5, text: "ORIGEN DE LOS TIEMPOS", value: "5" },
  ];
  const responsables = [
    { key: "aoyarce", text: "ANDY OYARCE", value: "aoyarce" },
    { key: "bburgos", text: "BRIAN BURGOS", value: "bburgos" },
    { key: "jgonzalezhu", text: "JORGE GONZALEZ HUERTA", value: "jgonzalezhu" },
    { key: "kponce", text: "KATHERINE PONCE", value: "kponce" },
    { key: "lkauer", text: "LUCY KAUER", value: "lkauer" },
    { key: "rromero", text: "RICARDO ROMERO", value: "rromero" },
    { key: "dgalvez", text: "DANIEL GALVEZ", value: "dgalvez" },
    { key: "ncastaneda", text: "NICOLAS CASTAÑEDA", value: "ncastaneda" },
  ];

  const verDetalleTicket = async (ticket) => {
    const detalle = await listarDetalleTicket(
      ticket.idIncidencia,
      session.id_token
    );
    const correos = await listarCorreosRespuesta(
      ticket.idIncidencia,
      session.id_token
    );
    setTituloDrawer(
      <div className="btn-navbar between">
        <label>Ticket {ticket.idIncidencia}</label>
        <Button
          size="small"
          color="blue"
          content="Ver"
          onClick={() =>
            router.push(`/mesa-ayuda/tickets/detalle/${ticket.idIncidencia}`)
          }
        />
      </div>
    );
    setContenidoDrawer(
      <IncidenciaDetalle ticket={detalle[0]} respuestas={correos} />
    );
    abrirCerrarDrawer();
  };

  return (
    <>
      {contextHolder}

      <div className="btn-navbar between">
        <>
          <Button
            color="blue"
            icon="angle left"
            content="Atras"
            onClick={() => router.push("/mesa-ayuda")}
          />
        </>
        <div className="btn-navbar between">
          <Button
            aria-label="recargar"
            color="green"
            icon="sync"
            onClick={() => onRecargar()}
          />
          <Button
            color="blue"
            icon="plus"
            content="Nuevo ticket"
            onClick={() => registrarIncidencia()}
            disabled={obtenerPermisos(session.permissions, 31)}
          />
          <Search
            aligned="right"
            minCharacters={3}
            value={filtroTicket}
            placeholder="Buscar tickets"
            noResultsMessage={"No hay datos"}
            onResultSelect={(e, { result }) =>
              router.push(`/mesa-ayuda/tickets/detalle/${result.content}`)
            }
            onSearchChange={(e, { value }) => buscarPorTicket(value)}
            results={ticketsFiltros}
          />
        </div>
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
                <Form.Dropdown
                  fluid
                  selection
                  clearable
                  name="responsable"
                  label="Asignado"
                  aria-label="filtros"
                  options={responsables}
                  selectOnBlur={false}
                  value={formikFiltros.values.responsable}
                  error={formikFiltros.errors.responsable}
                  onChange={(_, data) =>
                    formikFiltros.setFieldValue("responsable", data.value)
                  }
                />
                <Form.Dropdown
                  fluid
                  selection
                  clearable
                  name="periodo"
                  label="Periodo"
                  aria-label="filtros"
                  options={periodoTicket}
                  selectOnBlur={false}
                  value={formikFiltros.values.periodo}
                  error={formikFiltros.errors.periodo}
                  onChange={(_, data) =>
                    formikFiltros.setFieldValue("periodo", data.value)
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
