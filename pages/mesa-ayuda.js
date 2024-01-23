import React, { useState, useEffect } from "react";
import {
  IncidenciaDetalle,
  CardPersonalizado,
  DrawerPersonalizado,
  IncidenciaFormulario,
  BuscadorTicket,
} from "../components";
import "moment/locale/es";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  obtenerPermisos,
  convertirMinutosAHorasYMinutos,
  calcularMinutos,
} from "../Function";
import { Modal, Table, Progress, Tooltip, Spin } from "antd";
import { Grid, Button, Label, Icon, Dropdown } from "semantic-ui-react";
import {
  resumenTickets,
  resumenCardsTickets,
  listarDetalleTicket,
  listarCorreosRespuesta,
  listarTicketsRecientes,
} from "../apis";

export default function MesaAyuda() {
  const router = useRouter();
  const { data: session } = useSession();

  const [modal, contextHolder] = Modal.useModal();

  const [cargando, setCargando] = useState(false);
  const [recargar, setRecargar] = useState(false);

  const [resumen, setResumen] = useState([]);
  const [resumenTarjetas, setResumenTarjetas] = useState([]);
  const [ticketsRecientes, setTicketsRecientes] = useState([]);

  const [periodoResumen, setPeriodoResumen] = useState("D");

  const [tituloDrawer, setTituloDrawer] = useState("");
  const [mostrarDrawer, setMostrarDrawer] = useState(false);
  const [contenidoDrawer, setContenidoDrawer] = useState(null);

  const onRecargar = () => setRecargar((prev) => !prev);
  const abrirCerrarDrawer = () => setMostrarDrawer((prev) => !prev);

  useEffect(() => {
    (async () => {
      try {
        setCargando(true);
        const tarjetasResumen = await resumenCardsTickets(session.id_token);
        setResumenTarjetas(tarjetasResumen);
        const recientes = await listarTicketsRecientes(session.id_token);
        setTicketsRecientes(recientes);
        const resumen = await resumenTickets("D", session.id_token);
        setResumen(resumen);
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      } finally {
        setCargando(false);
      }
    })();
  }, [recargar]); // eslint-disable-line react-hooks/exhaustive-deps

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
      width: "25px",
      fixed: "left",
      align: "center",
    },
    {
      title: "Ticket",
      render: (record) => (
        <Link
          href={`/mesa-ayuda/tickets/detalle/${record.idIncidencia}`}
          onClick={(e) => e.stopPropagation()}
        >
          {record.idIncidencia}
        </Link>
      ),
      width: "80px",
      fixed: "left",
      sorter: (a, b) => a.idIncidencia - b.idIncidencia,
    },

    {
      title: "Empresa",
      dataIndex: "nombreCliente",
      ellipsis: true,
      width: "140px",
      sorter: (a, b) => a.nombreCliente.localeCompare(b.nombreCliente),
    },
    {
      title: "Problema",
      dataIndex: "tipoProblema",
      width: "25%",
      sorter: (a, b) => a.tipoProblema.localeCompare(b.tipoProblema),
      ellipsis: {
        showTitle: false,
      },
      render: (tipoProblema) => (
        <Tooltip placement="topLeft" title={tipoProblema}>
          {tipoProblema}
        </Tooltip>
      ),
    },
    {
      title: "Asunto",
      dataIndex: "asuntoCorreo",
      width: "25%",
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
          content={convertirMinutosAHorasYMinutos(record.tiempoRestante, 0)}
          color={record.tiempoRestante !== 0 ? "blue" : "red"}
        />
      ),
      width: "125px",
      sorter: (a, b) => a.tiempoRestante - b.tiempoRestante,
    },
    {
      title: "Fecha Creación",
      render: (record) =>
        moment.utc(record.fechaCreacion).format("YYYY-MM-DD HH:mm"),
      width: "130px",
      sorter: (a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion),
    },
  ];

  const registrarIncidencia = () => {
    setTituloDrawer("Crear ticket");
    setContenidoDrawer(<IncidenciaFormulario onRecargar={onRecargar} />);
    abrirCerrarDrawer();
  };

  const cambiarPeriodoResumen = async (periodo) => {
    setPeriodoResumen(periodo);
    const resumenTicket = await resumenTickets(periodo, session.id_token);
    setResumen(resumenTicket);
  };

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
      <div className="btn-navbar right down">
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
        <BuscadorTicket />
      </div>

      <Grid columns="equal" stackable>
        <Grid.Row stretched>
          <Grid.Column>
            <Spin spinning={cargando}>
              <CardPersonalizado
                link={`/mesa-ayuda/tickets?estado=1,3,4,6,7&periodo=5&responsable=${
                  session.user.email.split("@")[0]
                }`}
                icono={"hand paper outline"}
                color={"blue"}
                texto={"Mis Tickets"}
                valor={resumenTarjetas["Mis Tickets"] || 0}
              />
            </Spin>
          </Grid.Column>
          <Grid.Column>
            <Spin spinning={cargando}>
              <CardPersonalizado
                link={"/mesa-ayuda/tickets?periodo=1"}
                icono={"inbox"}
                color={"orange"}
                texto={"Nuevos Tickets"}
                valor={resumenTarjetas["Nuevos Tickets"] || 0}
              />
            </Spin>
          </Grid.Column>
          <Grid.Column>
            <Spin spinning={cargando}>
              <CardPersonalizado
                link={"/mesa-ayuda/tickets?estado=1,3,4,6,7&periodo=4"}
                icono={"envelope open outline"}
                color={"green"}
                texto={"Tickets Abiertos"}
                valor={resumenTarjetas["Tickets Abiertos"] || 0}
              />
            </Spin>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row stretched>
          <Grid.Column>
            <div className="ctn-card">
              <div
                className="btn-navbar between"
                style={{ marginBottom: "1em" }}
              >
                <label className="title">
                  <Icon name="ticket" />
                  TICKETS RECIENTES
                </label>
                <Button
                  content="Ver Todos"
                  color="blue"
                  size="small"
                  onClick={() => router.push("/mesa-ayuda/tickets?periodo=4")}
                />
              </div>
              <Table
                columns={columnas}
                dataSource={ticketsRecientes}
                loading={cargando}
                scroll={{ y: "46vh", x: "55vw" }}
                size="small"
                rowKey={"idIncidencia"}
                showSorterTooltip={false}
                pagination={false}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: () => verDetalleTicket(record),
                  };
                }}
              />
            </div>
          </Grid.Column>
          <Grid.Column width={4}>
            <div className="ctn-card">
              <div
                className="btn-navbar between"
                style={{ marginBottom: "1.5em" }}
              >
                <label>
                  <Icon name="calendar alternate outline" />
                  Resumen
                </label>
                <Dropdown
                  aria-label="fecha"
                  value={periodoResumen}
                  onChange={(e, { value }) => cambiarPeriodoResumen(value)}
                  options={[
                    { key: 1, text: "Hoy", value: "D" },
                    { key: 2, text: "Semanal", value: "S" },
                    { key: 3, text: "Mensual", value: "M" },
                  ]}
                />
              </div>

              {resumen.map((item) => (
                <div key={item.idEstado}>
                  <label>
                    {item.descripcion} <Label size="small">{item.total}</Label>
                  </label>
                  <Progress
                    aria-label="porcentajes"
                    key={item.idEstado}
                    percent={item.totalPorcentaje}
                  />
                </div>
              ))}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>

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
