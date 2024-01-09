import React, { useState, useEffect } from "react";
import { List, Tabs, Modal, Spin } from "antd";
import { Grid, Icon } from "semantic-ui-react";
import { useSession } from "next-auth/react";
import {
  CardPersonalizado,
  GraficoBarra,
  EstadisticasAcceso,
  EstadisticasPersonalizado,
} from "../components";
import { obtenerMonitoreoResumen } from "../apis";

export default function Monitoreo() {
  const { data: session } = useSession();
  const [resumen, setResumen] = useState([]);
  const [cargando, setCargando] = useState(false);

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    (async () => {
      try {
        setCargando(true);
        const response = await obtenerMonitoreoResumen(session.id_token);
        setResumen(response);
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      } finally {
        setCargando(false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const vigente = [
    {
      title: "Backups Activos",
      icon: <Icon name="print" circular size="large" inverted color="green" />,
      number: resumen["Backups Activos"] || 0,
      description: "Equipos de respaldo vigentes",
    },
    {
      title: "Monitoreados",
      icon: (
        <Icon name="check circle " circular size="large" inverted color="red" />
      ),
      number: resumen["Monitoreados"] || 0,
      description: "Equipos disponibles en KFS y Nubeprint",
    },
    {
      title: "No Monitoreados",
      icon: (
        <Icon name="exclamation" circular size="large" inverted color="blue" />
      ),
      number: resumen["No Monitoreados"] || 0,
      description: "Equipos no monitoreados por ningún software",
    },
    {
      title: "En Línea",
      icon: (
        <Icon name="signal" circular size="large" inverted color="yellow" />
      ),
      number: resumen["En Línea"] || 0,
      description: "Equipos actualmente monitoreados y operativos hoy",
    },
    {
      title: "Desconectados",
      icon: (
        <Icon name="power off" circular size="large" inverted color="orange" />
      ),
      number: resumen["Desconectados"] || 0,
      description: "Equipos desconectados con más de 7 días",
    },
  ];
  const noVigente = [
    {
      title: "Contrato No Vigente",
      icon: <Icon name="ban" circular size="large" inverted color="green" />,
      number: resumen["Contrato No Vigente"] || 0,
      description: "Contratos que ya no se encuentran activos",
    },
    {
      title: "Contrato Vencido",
      icon: (
        <Icon
          name="calendar times"
          circular
          size="large"
          inverted
          color="red"
        />
      ),
      number: resumen["Contrato Vencido"] || 0,
      description: "Contratos cuyo período ha llegado a su fin",
    },
    {
      title: "En Proceso de Retiro",
      icon: (
        <Icon
          name="hourglass half"
          circular
          size="large"
          inverted
          color="blue"
        />
      ),
      number: resumen["En Proceso de Retiro"] || 0,
      description: "Equipos con orden de retiro vigentes",
    },
  ];
  const tabs = [
    {
      label: `Vigente`,
      key: 1,
      children: (
        <>
          <Spin spinning={cargando}>
            <div className="ctn-scroll" style={{ height: "300px" }}>
              <List
                size="small"
                itemLayout="horizontal"
                dataSource={vigente}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={item.icon}
                      title={<label className="title">{item.title}</label>}
                      description={item.description}
                    />
                    <div>
                      <label className="title">
                        {Intl.NumberFormat("es-CL").format(item.number)}
                      </label>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </Spin>
        </>
      ),
    },
    {
      label: `No Vigente`,
      key: 2,
      children: (
        <>
          <div className="ctn-scroll" style={{ height: "300px" }}>
            <List
              size="small"
              itemLayout="horizontal"
              dataSource={noVigente}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.icon}
                    title={<label className="title">{item.title}</label>}
                    description={item.description}
                  />
                  <div>
                    <label className="title">
                      {Intl.NumberFormat("es-CL").format(item.number)}
                    </label>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <Grid columns="equal" stackable>
        <Grid.Row stretched>
          <Grid.Column>
            <Spin spinning={cargando}>
              <CardPersonalizado
                link={""}
                icono={"print"}
                color={"teal"}
                texto={"Parque Registrado"}
                valor={resumen["Parque Registrado"] || 0}
              />
            </Spin>
          </Grid.Column>
          <Grid.Column>
            <Spin spinning={cargando}>
              <CardPersonalizado
                link={""}
                icono={"check circle outline"}
                color={"blue"}
                texto={"MPS Vigentes"}
                valor={resumen["MPS Vigentes"] || 0}
              />
            </Spin>
          </Grid.Column>
          <Grid.Column>
            <Spin spinning={cargando}>
              <CardPersonalizado
                link={""}
                icono={"exclamation triangle"}
                color={"orange"}
                texto={"MPS No Vigentes"}
                valor={resumen["MPS No Vigentes"] || 0}
              />
            </Spin>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row stretched>
          <Grid.Column computer={6}>
            <div className="ctn-card">
              <Tabs
                centered
                defaultActiveKey="1"
                items={tabs}
                style={{ margin: "-1em 0em 0em" }}
              />
            </div>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <div className="ctn-card" style={{ height: "400px" }}>
              <label className="title">Parque Monitoreado</label>
              <div style={{ height: "96%" }}>
                <GraficoBarra />
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Spin spinning={cargando}>
              <EstadisticasAcceso
                texto={"Contadores"}
                valor={resumen["Contadores"] || 0}
                color={"blue"}
              />
            </Spin>
          </Grid.Column>
          <Grid.Column>
            <Spin spinning={cargando}>
              <EstadisticasAcceso
                texto={"Habilitación"}
                valor={resumen["Habilitación"] || 0}
                color={"green"}
              />
            </Spin>
          </Grid.Column>
          <Grid.Column>
            <Spin spinning={cargando}>
              <EstadisticasAcceso
                texto={"Monitoreo"}
                valor={resumen["Monitoreo"] || 0}
                color={"orange"}
              />
            </Spin>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Spin spinning={cargando}>
              <div className="ctn-card ctn">
                <EstadisticasPersonalizado
                  icono={"bell outline"}
                  color={"yellow"}
                  valor={0}
                  texto={"Alertas"}
                />
                <EstadisticasPersonalizado
                  icono={"inbox"}
                  color={"teal"}
                  valor={0}
                  texto={"Ingresado"}
                />
                <EstadisticasPersonalizado
                  icono={"shipping"}
                  color={"orange"}
                  valor={0}
                  texto={"Despachado"}
                />
                <EstadisticasPersonalizado
                  icono={"hand paper outline"}
                  color={"blue"}
                  valor={0}
                  texto={"Entregado"}
                />
                <EstadisticasPersonalizado
                  icono={"configure"}
                  color={"purple"}
                  valor={0}
                  texto={"Instalado"}
                />
              </div>
            </Spin>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
