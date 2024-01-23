import React, { useState, useEffect } from "react";
import moment from "moment";
import { Table, Typography } from "antd";
import { useSession } from "next-auth/react";
import { obtenerPermisos } from "../../../Function";
import { Grid, Form, Label } from "semantic-ui-react";

export function ListarEquiposDesconectados({
  equipos,
  cargando,
  enviarCorreo,
}) {
  const { data: session } = useSession();
  const [filtro, setFiltro] = useState("");
  const [filtroDias, setFiltroDias] = useState("");

  const [maquinasDetalle, setMaquinasDetalle] = useState([]);
  const [equiposFiltro, setEquiposFiltro] = useState(equipos);
  const [equiposFiltroCopia, setEquiposFiltroCopia] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //DEBE QUEDAR EN INGLES

  const { Text } = Typography;

  useEffect(() => {
    setFiltro("");
    setFiltroDias("");
    setSelectedRowKeys([]);
    setMaquinasDetalle([]);
    setEquiposFiltro(equipos);
    setEquiposFiltroCopia(equipos);
  }, [equipos]);

  const columnas = [
    {
      title: "Cliente",
      dataIndex: "nombreCliente",
      sorter: (a, b) => a.nombreCliente.localeCompare(b.nombreCliente),
      ellipsis: true,
    },
    {
      title: "Modelo",
      dataIndex: "equipoModelo",
      responsive: ["xl"],
      sorter: (a, b) => a.equipoModelo.localeCompare(b.equipoModelo),
      ellipsis: true,
    },
    {
      title: "N° Serie",
      dataIndex: "equipoSerie",
      ellipsis: true,
      //sorter: (a, b) => a.equipoSerie.localeCompare(b.equipoSerie),
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      ellipsis: true,
      sorter: (a, b) => a.direccion.localeCompare(b.direccion),
    },
    {
      title: "Comuna",
      dataIndex: "comuna",
      ellipsis: true,
      responsive: ["xl"],
      sorter: (a, b) => a.comuna.localeCompare(b.comuna),
    },
    {
      title: "Estado",
      render: (record) =>
        record.equipoEstado === "VIGENTE" ? (
          <Label size="small" content={record.equipoEstado} color="green" />
        ) : (
          <Label size="small" content={record.equipoEstado} color="red" />
        ),
      align: "center",
      sorter: (a, b) => a.equipoEstado.localeCompare(b.equipoEstado),
    },
    {
      title: "Última Conexión",
      render: (record) =>
        moment.utc(record.ultimaConexion).format("DD/MM/YYYY HH:mm"),
      align: "center",
      sorter: (a, b) => new Date(a.ultimaConexion) - new Date(b.ultimaConexion),
    },
    {
      title: "Días Offline",
      render: (record) =>
        record.diasDesconectado < 1 ? (
          <Text strong type="success">
            {record.diasDesconectado}
          </Text>
        ) : record.diasDesconectado <= 7 ? (
          <Text strong type="warning">
            {record.diasDesconectado}
          </Text>
        ) : (
          <Text strong type="danger">
            {record.diasDesconectado}
          </Text>
        ),
      align: "center",
      sorter: (a, b) => a.diasDesconectado - b.diasDesconectado,
      width: 100,
    },
    {
      title: "Notificado",
      render: (record) =>
        record.fechaAviso
          ? moment.utc(record.fechaAviso).format("DD/MM/YYYY HH:mm")
          : "",
      align: "center",
    },
  ];

  const onSelectChange = (llaveFilaSeleccionada, datosFilaSeleccionada) => {
    setMaquinasDetalle(datosFilaSeleccionada);
    setSelectedRowKeys(llaveFilaSeleccionada);
  };

  const seleccionarFila = {
    hideSelectAll: true,
    columnWidth: "3em",
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => {
      if (record.equipoEstado !== "VIGENTE") {
        return { disabled: true };
      }
      if (
        selectedRowKeys.length === 0 ||
        record.codigoCliente === maquinasDetalle[0].codigoCliente
      ) {
        return { disabled: false };
      }
      return { disabled: true };
    },
  };

  const filtrarPorColumnas = (e) => {
    setFiltro(e.target.value);
    setFiltroDias("");
    setEquiposFiltro(
      equipos.filter(
        (item) =>
          item.nombreCliente
            .toString()
            .includes(e.target.value.toUpperCase()) ||
          item.equipoModelo.toString().includes(e.target.value.toUpperCase()) ||
          item.equipoSerie.toString().includes(e.target.value.toUpperCase())
      )
    );
    setEquiposFiltroCopia(
      equipos.filter(
        (item) =>
          item.nombreCliente
            .toString()
            .includes(e.target.value.toUpperCase()) ||
          item.equipoModelo.toString().includes(e.target.value.toUpperCase()) ||
          item.equipoSerie.toString().includes(e.target.value.toUpperCase())
      )
    );
  };

  const filtroPorDias = [
    { key: 1, text: "Todos", value: 1 },
    { key: 2, text: "1-3 Días", value: 2 },
    { key: 3, text: "4-7 Días", value: 3 },
    { key: 4, text: "+7 Días", value: 4 },
  ];

  const filtrarPorDias = (e, { value }) => {
    setFiltroDias(value);
    if (value === 2) {
      setEquiposFiltro(
        equiposFiltroCopia.filter(
          (item) => item.diasDesconectado > 0 && item.diasDesconectado <= 3
        )
      );
    } else if (value === 3) {
      setEquiposFiltro(
        equiposFiltroCopia.filter(
          (item) => item.diasDesconectado > 3 && item.diasDesconectado <= 7
        )
      );
    } else if (value === 4) {
      setEquiposFiltro(
        equiposFiltroCopia.filter((item) => item.diasDesconectado > 7)
      );
    } else {
      setEquiposFiltro(equiposFiltroCopia);
    }
  };

  return (
    <div className="ctn-card up">
      <Form>
        <Form.Group widths="4">
          <Form.Input
            label="Filtros"
            fluid
            icon="search"
            placeholder="Buscar por cliente, modelo o serie"
            value={filtro.toUpperCase()}
            onChange={filtrarPorColumnas}
          />
          <Form.Dropdown
            label="‎"
            fluid
            selection
            selectOnBlur={false}
            placeholder="Seleccionar cantidad de días"
            options={filtroPorDias}
            value={filtroDias}
            onChange={filtrarPorDias}
          />
          <Form.Button
            color="blue"
            type="button"
            label="‎"
            content="Enviar Correo"
            onClick={() => enviarCorreo(selectedRowKeys, maquinasDetalle)}
            disabled={obtenerPermisos(session.permissions, 30)}
          />
        </Form.Group>
      </Form>

      <Table
        columns={columnas}
        dataSource={equiposFiltro}
        loading={cargando}
        pagination={{ defaultPageSize: 15 }}
        rowSelection={seleccionarFila}
        size="small"
        rowKey="equipoSerie"
        bordered
        showSorterTooltip={false}
        sticky={{
          offsetHeader: 0,
        }}
        footer={() => (
          <div style={{ margin: "0.2em 0" }}>
            <Grid verticalAlign="middle" textAlign="center">
              <Grid.Column>
                Total Equipos: <strong>{equiposFiltro.length}</strong>
              </Grid.Column>
            </Grid>
          </div>
        )}
      />
    </div>
  );
}
