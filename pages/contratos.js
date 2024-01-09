import React, { useState, useEffect } from "react";
import { Table, Modal } from "antd";
import { Grid, Form } from "semantic-ui-react";
import { listarContratos } from "../apis";
import { useSession } from "next-auth/react";
import { CSVLink, CSVDownload } from "react-csv";

export default function Contratos() {
  const { data: session } = useSession();
  const [modal, contextHolder] = Modal.useModal();

  const [filtro, setFiltro] = useState("");
  const [cargando, setCargando] = useState(false);
  const [contratos, setContratos] = useState([]);
  const [contratosFiltro, setContratosFiltro] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setCargando(true);
        const response = await listarContratos(session.id_token);
        setContratos(response);
        setContratosFiltro(response);
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
    },
    {
      title: "Código Cliente",
      dataIndex: "codCliente",
    },
    {
      title: "Ejecutiva Responsable",
      dataIndex: "ejecutivaResponsable",
    },
    {
      title: "Folio Contrato",
      dataIndex: "folioContrato",
    },
  ];

  const filtrarPorColumnas = (e) => {
    setFiltro(e.target.value);
    setContratosFiltro(
      contratos.filter(
        (item) =>
          item.nombreCliente.includes(e.target.value.toUpperCase()) ||
          item.ejecutivaResponsable.includes(e.target.value.toUpperCase()) ||
          item.codCliente.toString().includes(e.target.value) ||
          item.folioContrato.toString().includes(e.target.value)
      )
    );
  };

  return (
    <>
      {contextHolder}

      <div className="ctn-card">
        <Form>
          <Form.Group widths="4">
            <Form.Input
              fluid
              label="Filtros"
              icon="search"
              placeholder="Buscar por razón social, código cliente, ejecutiva o folio"
              value={filtro.toUpperCase()}
              onChange={filtrarPorColumnas}
            />
            <div style={{ marginTop: "32px" }}>
              <CSVLink data={contratosFiltro} filename={"Contratos.csv"}>
                Exportar
              </CSVLink>
            </div>
          </Form.Group>
        </Form>

        <Table
          columns={columnas}
          dataSource={contratosFiltro}
          pagination={{ defaultPageSize: 15 }}
          loading={cargando}
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
                  Total Contratos: <strong>{contratosFiltro.length}</strong>
                </Grid.Column>
              </Grid>
            </div>
          )}
        />
      </div>
    </>
  );
}
