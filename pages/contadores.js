import React, { useState, useEffect } from "react";
import moment from "moment";
import { Table, Modal } from "antd";
import { useSession } from "next-auth/react";
import { Grid, Form, Button } from "semantic-ui-react";
import { listarContadores } from "../apis";
import { ExcelFile, ExcelSheet, ExcelColumn } from "react-xlsx-wrapper";

export default function Contadores() {
  const { data: session } = useSession();
  const [modal, contextHolder] = Modal.useModal();

  const [filtro, setFiltro] = useState("");
  const [filtroContador, setFiltroContador] = useState("");

  const [cargando, setCargando] = useState(false);
  const [contadores, setContadores] = useState([]);
  const [contadoresFiltro, setContadoresFiltro] = useState([]);
  const [contadoresFiltroCopia, setContadoresFiltroCopia] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setCargando(true);
        const response = await listarContadores(session.id_token);
        setContadores(response);
        setContadoresFiltro(response);
        setContadoresFiltroCopia(response);
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

  const columnas = [
    {
      title: "Razón Social",
      dataIndex: "nombreCliente",
      sorter: (a, b) => a.nombreCliente.localeCompare(b.nombreCliente),
      ellipsis: true,
      width: 200,
    },
    {
      title: "Código Cliente",
      dataIndex: "codCliente",
      sorter: (a, b) => a.codCliente.localeCompare(b.codCliente),
    },
    {
      title: "Folio Contrato",
      dataIndex: "folioContrato",
      sorter: (a, b) => a.folioContrato.localeCompare(b.folioContrato),
    },
    {
      title: "Estado",
      dataIndex: "estadoContrato",
      sorter: (a, b) => a.estadoContrato.localeCompare(b.estadoContrato),
    },
    {
      title: "Fecha Termino",
      render: (record) => moment(record.fechaContrato).format("DD/MM/YYYY"),
      sorter: (a, b) => new Date(a.fechaContrato) - new Date(b.fechaContrato),
    },
    {
      title: "Serie",
      dataIndex: "serieEquipo",
      sorter: (a, b) => a.serieEquipo.localeCompare(b.serieEquipo),
    },
    {
      title: "Contador BN",
      dataIndex: "contadorBN",
      sorter: (a, b) => a.contadorBN - b.contadorBN,
    },
    {
      title: "Contador Color",
      dataIndex: "contadorColor",
      sorter: (a, b) => a.contadorColor - b.contadorColor,
    },
    {
      title: "Producto",
      dataIndex: "producto",
      sorter: (a, b) => a.producto.localeCompare(b.producto),
      ellipsis: true,
      width: 200,
    },
  ];

  const filtrarPorColumnas = (e) => {
    setFiltro(e.target.value);
    setFiltroContador("");
    setContadoresFiltro(
      contadores.filter(
        (item) =>
          item.nombreCliente
            .toString()
            .includes(e.target.value.toUpperCase()) ||
          item.codCliente.toString().includes(e.target.value.toUpperCase()) ||
          item.folioContrato
            .toString()
            .includes(e.target.value.toUpperCase()) ||
          item.serieEquipo.toString().includes(e.target.value.toUpperCase())
      )
    );
    setContadoresFiltroCopia(
      contadores.filter(
        (item) =>
          item.nombreCliente
            .toString()
            .includes(e.target.value.toUpperCase()) ||
          item.codCliente.toString().includes(e.target.value.toUpperCase()) ||
          item.folioContrato
            .toString()
            .includes(e.target.value.toUpperCase()) ||
          item.serieEquipo.toString().includes(e.target.value.toUpperCase())
      )
    );
  };

  const filtrarPorDias = (e, { value }) => {
    setFiltroContador(value);
    if (value === 1) {
      setContadoresFiltro(
        contadoresFiltroCopia.filter((item) => item.contadorBN === 0)
      );
    } else if (value === 2) {
      setContadoresFiltro(
        contadoresFiltroCopia.filter((item) => item.contadorBN !== 0)
      );
    } else {
      setContadoresFiltro(contadoresFiltroCopia);
    }
  };

  const filtroPorContador = [
    { key: 1, text: "Sin Contador", value: 1 },
    { key: 2, text: "Con Contador", value: 2 },
    { key: 3, text: "Todos", value: 3 },
  ];

  return (
    <>
      {contextHolder}

      <div className="ctn-card">
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
              placeholder="Seleccionar contador"
              options={filtroPorContador}
              value={filtroContador}
              onChange={filtrarPorDias}
            />
            <Form.Field>
              <label>‎ </label>
              <ExcelFile
                element={<Button content="Exportar" color="blue" />}
                filename="Contadores"
              >
                <ExcelSheet data={contadoresFiltro} name="Contadores">
                  <ExcelColumn label="Razón Social" value="nombreCliente" />
                  <ExcelColumn label="Código Cliente" value="codCliente" />
                  <ExcelColumn label="Folio Contrato" value="folioContrato" />
                  <ExcelColumn label="Estado Contrato" value="estadoContrato" />
                  <ExcelColumn label="Serie" value="serieEquipo" />
                  <ExcelColumn label="Contador BN" value="contadorBN" />
                  <ExcelColumn label="Contador Color" value="contadorColor" />
                  <ExcelColumn label="Producto" value="producto" />
                </ExcelSheet>
              </ExcelFile>
            </Form.Field>
          </Form.Group>
        </Form>

        <Table
          columns={columnas}
          dataSource={contadoresFiltro}
          pagination={{ defaultPageSize: 15 }}
          loading={cargando}
          size="small"
          rowKey="indice"
          bordered
          showSorterTooltip={false}
          scroll={{ x: "90vw" }}
          sticky={{
            offsetHeader: 0,
          }}
          footer={() => (
            <div style={{ margin: "0.4em 0" }}>
              <Grid verticalAlign="middle" textAlign="center">
                <Grid.Column>
                  Total Contratos: <strong>{contadoresFiltro.length}</strong>
                </Grid.Column>
              </Grid>
            </div>
          )}
        />
      </div>
    </>
  );
}
