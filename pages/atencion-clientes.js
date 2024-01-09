import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Table, Select, List, Modal, Avatar } from "antd";
import { GraficoBarra2, CardPersonalizado } from "../components";
import { Grid, Dropdown, Label } from "semantic-ui-react";
import { listarEjecutivas } from "../apis";

export default function AtencionClientes() {
  const { Option } = Select;
  const { data: session } = useSession();

  const [cargando, setCargando] = useState(false);
  const [ejecutivas, setEjecutivas] = useState([]);

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    (async () => {
      try {
        setCargando(true);
        const response = await listarEjecutivas(session.id_token);
        setEjecutivas(response);
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

  const data = [
    {
      key: "1",
      nombreCliente: "PEÑUELAS CORP SPA",
      ejecutivaACargo: "Macarena Allende Becerra",
      tamanoCliente: "XL",
      eventoAccion:
        "Se contacta a cliente.  Cliente a extendido todos los contratos.  Cliente muy conforme con el servicio.",
      estado: "Completada",
    },
    {
      key: "2",
      nombreCliente: "AGUAS DEL VALLE S.A",
      ejecutivaACargo: "Katherine Ponce Fabio",
      tamanoCliente: "M",
      eventoAccion: "Negocio ya cerrado.",
      estado: "No Completada",
    },
    {
      key: "3",
      nombreCliente: "IRON MOUNTAIN CHILE S.A.",
      ejecutivaACargo: "Katherine Ponce Fabio",
      tamanoCliente: "M",
      eventoAccion:
        "Telefono de contacto no figura en sistema.  Llame a contacto Comercial Lisbeth Hardy al celular que aparece en sistema y no tuve respuesta.  Se manda correo formal presentándome y poder gestionar Reunión para ver temas de servicio y otros.  ",
      estado: "Completada",
    },
    {
      key: "4",
      nombreCliente: "KOMATSU CUMMINS CHILE LTDA.",
      ejecutivaACargo: "Constanza Montecino",
      tamanoCliente: "S",
      eventoAccion:
        "cliente con contrato vigente, por el momento no necesita nada ",
      estado: "Completada",
    },
    {
      key: "5",
      nombreCliente: "KOMATSU CUMMINS CHILE LTDA.",
      ejecutivaACargo: "Constanza Montecino",
      tamanoCliente: "L",
      eventoAccion:
        "Se contacta al cliente a otro contacto Patricia silva, con contrato recien renovado   se encuentra a la espera de que el parque sea habilitado en un 100%",
      estado: "No Completada",
    },
    {
      key: "6",
      nombreCliente: "SODEXO CHILE SPA",
      ejecutivaACargo: "Lucinda Kauer Castañeda",
      tamanoCliente: "XL",
      eventoAccion:
        "Se mantiene comunicación con Juan Alfaro  Proyecto de cambio de plotter HP , por plotter Epson 7770.  Se coordina segunda Reunión  para la primera semana de Octubre en showroom de Epson, ya que cliente con los usuarios internos necesitan ver como opera el plotter ofrecido.  Estoy a la espera de confirmacion ya que asistiran a esta visita  Leonardo Martinez  Jose Rojas  Begoña Villarroel  ",
      estado: "Completada",
    },
    // Agrega más filas de datos según sea necesario
  ];

  const columns = [
    {
      title: "Nombre Cliente",
      dataIndex: "nombreCliente",
      key: "nombreCliente",
    },
    {
      title: "Ejecutiva a Cargo",
      dataIndex: "ejecutivaACargo",
      key: "ejecutivaACargo",
    },
    {
      title: "Tamaño de Cliente",
      dataIndex: "tamanoCliente",
      key: "tamanoCliente",
      render: (tamanoCliente) => (
        <Label
          content={tamanoCliente}
          color={
            tamanoCliente === "XL"
              ? "green"
              : tamanoCliente === "L"
              ? "blue"
              : tamanoCliente === "M"
              ? "orange"
              : "red"
          }
        />
      ),
      align: "center",
    },
    {
      title: "Evento/Acción Realizado",
      dataIndex: "eventoAccion",
      key: "eventoAccion",
      width: 600,
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado) => (
        <Label
          color={estado === "Completada" ? "green" : "orange"}
          content={estado}
        />
      ),
      width: 140,
    },
  ];

  const [filteredData, setFilteredData] = useState(data);
  const [filterEjecutiva, setFilterEjecutiva] = useState("");

  const handleSizeFilter = (value) => {
    setFilterEjecutiva(value);
    if (value === "Todas") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => item.ejecutivaACargo === value);
      setFilteredData(filtered);
    }
  };

  return (
    <>
      {contextHolder}

      <Grid columns={"equal"} stackable>
        <Grid.Row stretched>
          <Grid.Column>
            <CardPersonalizado
              link={""}
              icono={"file alternate outline"}
              color={"blue"}
              texto={"Actividades"}
              valor={"125"}
              porcentaje={["+", 15]}
            />
          </Grid.Column>
          <Grid.Column>
            <CardPersonalizado
              link={""}
              icono={"handshake outline"}
              color={"green"}
              texto={"Completadas"}
              valor={"100"}
              porcentaje={["+", 25]}
            />
          </Grid.Column>
          <Grid.Column>
            <CardPersonalizado
              link={""}
              icono={"hourglass half"}
              color={"orange"}
              texto={"Pendientes"}
              valor={"25"}
              porcentaje={["-", 32]}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row stretched>
          <Grid.Column width={5}>
            <div className="ctn-card">
              <div className="btn-navbar between down">
                <label className="title">Ejecutiva</label>
              </div>
              <List
                size="small"
                itemLayout="horizontal"
                dataSource={ejecutivas}
                renderItem={(item, index) => (
                  <List.Item
                    key={item.codEjecutiva}
                    onClick={() => alert(item.nombreEjecutiva)}
                    style={{ cursor: "pointer" }}
                  >
                    <List.Item.Meta
                      style={{ margin: "0.35em 0" }}
                      avatar={
                        <Avatar src={item.fotoEjecutiva} size={"large"} />
                      }
                      title={item.nombreEjecutiva}
                      description={"Actividades Asignadas"}
                    />
                    <div>
                      <label className="title">{0}</label>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <div className="ctn-card">
              <div className="btn-navbar between down">
                <label className="title">Estatus Actividades</label>
                <Dropdown
                  //value={periodoResumen}
                  //onChange={(e, { value }) => cambiarPeriodoResumen(value)}
                  options={[
                    { key: 1, text: "Enero", value: "D" },
                    { key: 2, text: "Diciembre", value: "S" },
                    { key: 3, text: "Noviembre", value: "M" },
                  ]}
                  defaultValue={"D"}
                />
              </div>
              <div style={{ height: 300 }}>
                <GraficoBarra2 />
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <div className="ctn-card">
              <Select
                defaultValue="Todas"
                style={{ width: 200, marginBottom: "1em" }}
                onChange={handleSizeFilter}
              >
                <Option value="Todas">Todas</Option>
                <Option value="Macarena Allende Becerra">
                  Macarena Allende Becerra
                </Option>
                <Option value="Katherine Ponce Fabio">
                  Katherine Ponce Fabio
                </Option>
                {/* Agrega más ejecutivas según sea necesario */}
              </Select>
              <Table columns={columns} dataSource={filteredData} />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
