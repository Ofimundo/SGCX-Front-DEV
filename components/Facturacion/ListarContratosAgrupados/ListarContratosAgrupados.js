import React from "react";
import moment from "moment";
import { Table } from "antd";
import { Grid } from "semantic-ui-react";

export function ListarContratosAgrupados(props) {
  const { contratos } = props;

  const columnas = [
    {
      title: "Folio Contrato",
      dataIndex: "FOLIO_CONTRATO",
      width: 100,
      align: "center",
    },
    {
      title: "Fecha Vencimiento",
      render: (record) =>
        moment.utc(record.fecha_vencimiento).format("DD-MM-YYYY"),
      width: 100,
      align: "center",
    },
    {
      title: "Contrato Vencido",
      render: (record) => {
        var fechaActual = new Date();
        var fechaVencimiento = new Date(record.fecha_vencimiento);

        if (fechaActual <= fechaVencimiento) return "No";
        else return "Si";
      },
      width: 100,
      align: "center",
    },
  ];

  return (
    <>
      <Table
        columns={columnas}
        dataSource={contratos}
        pagination={false}
        rowKey="FOLIO_CONTRATO"
        scroll={{ y: "50vh" }}
        size="middle"
        bordered
        footer={() => (
          <div style={{ margin: "0.2em 0" }}>
            <Grid columns="3" verticalAlign="middle" textAlign="center">
              <Grid.Column>
                Total Contratos: <strong>{contratos.length}</strong>
              </Grid.Column>
            </Grid>
          </div>
        )}
      />
    </>
  );
}

//
