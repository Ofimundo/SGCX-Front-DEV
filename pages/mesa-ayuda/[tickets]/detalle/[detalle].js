import React, { useState, useEffect } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import {
  Descriptions,
  Timeline,
  Modal,
  Typography,
  Tabs,
  Button as Btn,
} from "antd";
import { Button, Dropdown, Label, Search, Grid } from "semantic-ui-react";
import {
  AsignarFormulario,
  ArchivoDescargable,
  DrawerPersonalizado,
  IncidenciaFormulario,
  ComentarioFormulario,
  TicketServicioFormulario,
} from "../../../../components";
import {
  listarDocumentos,
  actualizarTicket,
  descargarDocumentos,
  listarDetalleTicket,
  listarTicketFiltrado,
  listarHistorialTicket,
  listarCorreosRespuesta,
  obtenerSiguienteTicket,
} from "../../../../apis";
import {
  EditOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import {
  obtenerPermisos,
  calcularMinutos,
  convertirMinutosAHorasYMinutos,
} from "../../../../Function";

export default function Tickets() {
  const { data: session } = useSession();
  const router = useRouter();

  const { Text } = Typography;
  const [modal, contextHolder] = Modal.useModal();
  const [recargar, setRecargar] = useState(false);

  const [adjuntos, setAdjuntos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [ticketDetalle, setTicketDetalle] = useState([]);
  const [correosRespuesta, setCorreosRespuestas] = useState([]);

  const [filtroTicket, setFiltroTicket] = useState("");
  const [ticketsFiltros, setTicketsFiltro] = useState([]);

  const [tituloDrawer, setTituloDrawer] = useState("");
  const [tamañoDrawer, setTamañoDrawer] = useState("large");
  const [mostrarDrawer, setMostrarDrawer] = useState(false);
  const [contenidoDrawer, setContenidoDrawer] = useState(null);

  const onRecargar = () => setRecargar((prev) => !prev);
  const abrirCerrarDrawer = () => setMostrarDrawer((prev) => !prev);
  useEffect(() => {
    (async () => {
      const ticket = await listarDetalleTicket(
        router.query.detalle,
        session.id_token
      );
      setTicketDetalle(ticket);
      /*
      const adjuntos = await listarDocumentos(
        router.query.detalle,
        session.id_token
      );
      setAdjuntos(adjuntos);
        */
      const historial = await listarHistorialTicket(
        router.query.detalle,
        2,
        session.id_token
      );
      setHistorial(historial);

      const correos = await listarCorreosRespuesta(
        router.query.detalle,
        session.id_token
      );
      setCorreosRespuestas(correos);
    })();
  }, [recargar, router]); // eslint-disable-line react-hooks/exhaustive-deps

  const registrarIncidencia = () => {
    setTamañoDrawer("large");
    setTituloDrawer("Crear Ticket");
    setContenidoDrawer(<IncidenciaFormulario onRecargar={onRecargar} />);
    abrirCerrarDrawer();
  };

  const ingresarTicketServicio = () => {
    setTamañoDrawer("default");
    setTituloDrawer("Crear ticket de servicio");
    setContenidoDrawer(
      <TicketServicioFormulario
        ticket={ticketDetalle[0]}
        onRecargar={onRecargar}
      />
    );
    abrirCerrarDrawer();
  };

  const asignarUsuario = () => {
    setTamañoDrawer("default");
    setTituloDrawer("Asignar usuario");
    setContenidoDrawer(
      <AsignarFormulario ticket={ticketDetalle[0]} onRecargar={onRecargar} />
    );
    abrirCerrarDrawer();
  };

  const ingresarComentarioTicket = (titulo, estado) => {
    setTamañoDrawer("default");
    setTituloDrawer(titulo);
    setContenidoDrawer(
      <ComentarioFormulario
        estado={estado}
        incidencia={ticketDetalle[0]}
        onRecargar={onRecargar}
      />
    );
    abrirCerrarDrawer();
  };

  const gestionarTicket = async () => {
    try {
      const detalleTicket = {
        idIncidencia: ticketDetalle[0].idIncidencia,
        tipoActualizacion: "4",
        areaResponsable: ticketDetalle[0].idAreaResponsable,
        usuarioAsignado: ticketDetalle[0].idUsuarioAsignado,
      };
      await actualizarTicket(detalleTicket, session.id_token);
      onRecargar();
    } catch (error) {
      modal.error({
        title: "Ups, algo salió mal",
        content: error.message,
      });
    }
  };

  const buscarPorTicket = async (value) => {
    setFiltroTicket(value);
    if (value.length >= 3) {
      const filtro = await listarTicketFiltrado(value, session.id_token);
      setTicketsFiltro(filtro);
    }
  };

  const abrirDocumentos = async (nombre) => {
    await descargarDocumentos(nombre, session.id_token);
  };

  const ordenarHistorial = async (ordenar) => {
    const historial = await listarHistorialTicket(
      router.query.detalle,
      ordenar,
      session.id_token
    );
    setHistorial(historial);
  };

  const siguienteTicket = async (tipo) => {
    const response = await obtenerSiguienteTicket(
      ticketDetalle[0].idIncidencia,
      tipo,
      session.id_token
    );
    if (response[0] !== "0") {
      router.push(`/mesa-ayuda/tickets/detalle/${response}`);
    } else {
      modal.info({
        content: "No hay más tickets disponibles",
      });
    }
  };

  const tabs = [
    {
      label: <Text strong>Correo Principal</Text>,
      key: 0,
      children: (
        <>
          <iframe
            title="correo principal"
            srcDoc={ticketDetalle[0]?.descripcion}
            style={{
              height: "460px",
            }}
          />
        </>
      ),
    },
    ...correosRespuesta.map((item) => ({
      label: <Text strong>Respuesta N°{item.indice}</Text>,
      key: item.indice,
      children: (
        <>
          <iframe
            title="respuestas"
            srcDoc={item.descripcion}
            style={{
              height: "460px",
            }}
          />
        </>
      ),
    })),
  ];

  return (
    <>
      {contextHolder}

      <div className="btn-navbar between">
        <div>
          <Button
            color="blue"
            icon="angle left"
            content="Atras"
            onClick={() => router.back()}
          />
        </div>
        <div className="btn-navbar between">
          <div>
            <Button
              aria-label="anterior"
              color="grey"
              icon="arrow left"
              onClick={() => siguienteTicket(0)}
            />
            <Button
              aria-label="siguiente"
              color="grey"
              icon="arrow right"
              onClick={() => siguienteTicket(1)}
            />
          </div>

          <Dropdown
            labeled
            icon="angle down"
            className="button icon orange "
            trigger={"Acciones"}
            aria-label="acciones"
            disabled={
              obtenerPermisos(session.permissions, 33) ||
              habilitarOpciones(ticketDetalle[0]?.idUltimoEstado, 6)
            }
          >
            <Dropdown.Menu>
              <Dropdown.Item
                content="Comentario"
                icon="comments"
                onClick={() =>
                  ingresarComentarioTicket("Registrar comentario", null)
                }
              />
              <Dropdown.Divider style={{ margin: "0" }} />
              <Dropdown.Item
                content={
                  ticketDetalle[0]?.idUsuarioAsignado ? "Reasignar" : "Asignar"
                }
                icon="exchange"
                onClick={() => asignarUsuario()}
                disabled={habilitarOpciones(
                  ticketDetalle[0]?.idUltimoEstado,
                  2
                )}
              />
              <Dropdown.Item
                content="Gestionar"
                icon="hand paper"
                onClick={() => gestionarTicket()}
                disabled={habilitarOpciones(
                  ticketDetalle[0]?.idUltimoEstado,
                  1
                )}
              />
              <Dropdown.Item
                content="Derivar Ofitec"
                icon="print"
                onClick={() => ingresarTicketServicio()}
                /*
                disabled={habilitarOpciones(
                  ticketDetalle[0]?.idUltimoEstado,
                  3
                )}
                */
                disabled={true}
              />
              <Dropdown.Item
                content="Resolver"
                icon="check circle"
                onClick={() =>
                  ingresarComentarioTicket("Registrar solución", 5)
                }
                disabled={habilitarOpciones(
                  ticketDetalle[0]?.idUltimoEstado,
                  4
                )}
              />
              <Dropdown.Item
                content="Incompleto"
                icon="exclamation triangle"
                onClick={() =>
                  ingresarComentarioTicket("Registrar motivo de cierre", 6)
                }
                disabled={habilitarOpciones(
                  ticketDetalle[0]?.idUltimoEstado,
                  5
                )}
              />
              <Dropdown.Item
                content="Anular"
                icon="ban"
                onClick={() =>
                  ingresarComentarioTicket("Registrar motivo de anulación", 8)
                }
                disabled={habilitarOpciones(
                  ticketDetalle[0]?.idUltimoEstado,
                  6
                )}
              />
            </Dropdown.Menu>
          </Dropdown>
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

      <Descriptions
        bordered
        column={{
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
        }}
        size="small"
        className="ctn-card up antd-desc"
      >
        <Descriptions.Item label={<Text strong>Número de Ticket</Text>}>
          {ticketDetalle[0]?.idIncidencia}
        </Descriptions.Item>
        <Descriptions.Item label={<Text strong>Creado Por</Text>}>
          {ticketDetalle[0]?.usuarioCreador}
        </Descriptions.Item>
        <Descriptions.Item label={<Text strong>Fecha de Creación</Text>}>
          {moment
            .utc(ticketDetalle[0]?.fechaCreacion)
            .format("YYYY-MM-DD HH:mm")}
        </Descriptions.Item>

        <Descriptions.Item label={<Text strong>Categoría</Text>}>
          {ticketDetalle[0]?.categoria}
        </Descriptions.Item>
        <Descriptions.Item label={<Text strong>Tipo de Problema</Text>}>
          {ticketDetalle[0]?.subCategoria}
        </Descriptions.Item>
        <Descriptions.Item label={<Text strong>Tiempo Límite</Text>}>
          <>
            <Label
              size="small"
              icon="clock outline"
              content={convertirMinutosAHorasYMinutos(
                ticketDetalle[0]?.tiempoRestante
              )}
              color={ticketDetalle[0]?.tiempoRestante !== 0 ? "blue" : "red"}
            />
          </>
        </Descriptions.Item>

        <Descriptions.Item label={<Text strong>Tipo de Contacto</Text>}>
          {ticketDetalle[0]?.tipoContacto}
        </Descriptions.Item>
        <Descriptions.Item label={<Text strong>Empresa</Text>}>
          {ticketDetalle[0]?.nombreCliente}
        </Descriptions.Item>
        <Descriptions.Item label={<Text strong>N° Serie</Text>}>
          {ticketDetalle[0]?.serieEquipo}
        </Descriptions.Item>

        <Descriptions.Item label={<Text strong>Estado</Text>}>
          <>
            <Label
              size="small"
              content={ticketDetalle[0]?.ultimoEstado}
              color={obtenerColorEstado(ticketDetalle[0]?.idUltimoEstado)}
            />
            <Label
              circular
              size="mini"
              empty
              color={calcularMinutos(ticketDetalle[0]?.fechaCreacion)}
            />
          </>
        </Descriptions.Item>
        <Descriptions.Item label={<Text strong>Área Resolutora</Text>}>
          {ticketDetalle[0]?.areaResponsable}
        </Descriptions.Item>
        <Descriptions.Item label={<Text strong>Responsable Asignado</Text>}>
          {ticketDetalle[0]?.usuarioAsignado}
        </Descriptions.Item>

        <Descriptions.Item span={3}></Descriptions.Item>

        <Descriptions.Item label={<Text strong>Nombre Solicitante</Text>}>
          {ticketDetalle[0]?.contactoNombre}
        </Descriptions.Item>
        <Descriptions.Item label={<Text strong>Correo Electrónico</Text>}>
          {ticketDetalle[0]?.contactoEmail}
        </Descriptions.Item>
        <Descriptions.Item label={<Text strong>Telefóno / Celular</Text>}>
          {ticketDetalle[0]?.contactoFono}
        </Descriptions.Item>
      </Descriptions>

      <Grid columns={"equal"} style={{ marginTop: "1em" }} stackable>
        <Grid.Row>
          <Grid.Column>
            <div className="ctn-card">
              <Descriptions layout="vertical" bordered size="small" column={1}>
                <Descriptions.Item label={<Text strong>Asunto</Text>}>
                  {ticketDetalle[0]?.asuntoCorreo}
                </Descriptions.Item>
              </Descriptions>

              <Tabs
                className="antd-tab"
                type="card"
                defaultActiveKey="0"
                items={tabs}
                style={{
                  marginTop: "1em",
                }}
              />
            </div>
          </Grid.Column>

          <Grid.Column width={6}>
            <div className="ctn-card">
              <Descriptions layout="vertical" bordered size="small">
                <Descriptions.Item
                  label={
                    <div className="btn-navbar between">
                      <Text strong>Historial</Text>
                      <div className="btn-navbar">
                        <Btn
                          icon={<CaretDownOutlined />}
                          size="small"
                          onClick={() => ordenarHistorial(1)}
                        />
                        <Btn
                          icon={<CaretUpOutlined />}
                          size="small"
                          onClick={() => ordenarHistorial(2)}
                        />
                      </div>
                    </div>
                  }
                >
                  <div
                    style={{
                      padding: "1.5em 0.25em 0.5em",
                      maxHeight: "460px",
                    }}
                    className="ctn-scroll"
                  >
                    <Timeline
                      items={historial.map((item) => ({
                        key: item.idDetalle,
                        color: obtenerColorEstado(item.idAccion),
                        dot: item.idAccion === "0" ? <EditOutlined /> : null,
                        children: (
                          <>
                            <p>
                              {moment
                                .utc(item.fechaAccion)
                                .format("YYYY-MM-DD HH:mm")}
                            </p>
                            <p style={{ fontSize: "13.5px" }}>
                              {item.observacion}
                            </p>
                          </>
                        ),
                      }))}
                    />
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </div>
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
function habilitarOpciones(estado, boton) {
  switch (boton) {
    case 1: //Gestionar
      return ["4", "5", "8"].includes(estado);
    case 2: //Reasignar
      return ["5"].includes(estado);
    case 3: //Derivar Ofitec
      return ["1", "3"].includes(estado);
    case 4: //Resolver
      return ["1", "3"].includes(estado);
    case 5: //Incompleto
      return ["1", "3", "6"].includes(estado);
    case 5: //Anular
      return ["5"].includes(estado);
    case 6: //Acciones
      return ["5", "7", "8"].includes(estado);
  }
}
function obtenerColorEstado(estado) {
  switch (Number(estado)) {
    case 0:
      return "blue";
    case 1:
      return "red";
    case 3:
      return "blue";
    case 4:
      return "orange";
    case 5:
      return "purple";
    case 6:
      return "teal";
    case 7:
      return "green";
    case 8:
      return "brown";
    default:
      return "grey";
  }
}

/*
<Descriptions.Item span={3}></Descriptions.Item>
        
        <Descriptions.Item label={<Text strong>Adjuntos</Text>} span={3}>
          <div className="ctn-scroll-x">
            <div
              style={{
                display: "flex",
                gap: "1em",
                width: "10px",
              }}
            >
              {adjuntos.length
                ? adjuntos.map((item) => (
                    <ArchivoDescargable
                      key={item.indice}
                      icono={"file image outline"}
                      nombre={item.nombre}
                      tamaño={item.tamaño}
                      evento={abrirDocumentos}
                    />
                  ))
                : null}
            </div>
          </div>
        </Descriptions.Item>
*/
