import React from "react";
import { Table } from "antd";
import { Grid, Form } from "semantic-ui-react";

export function CalculoManual() {
  const columnas = [
    {
      title: "Contrato",
      dataIndex: "contrato",
    },
    {
      title: "Fecha de Inicio",
      dataIndex: "fechaInicio",
    },
    {
      title: "Fecha de Término",
      dataIndex: "fechaTermino",
    },
    {
      title: "Serie",
      dataIndex: "serieMaquina",
    },
    {
      title: "Contadores",
      dataIndex: "contadorTomado",
    },
  ];

  const data = [
    {
      contrato: "Contrato 1",
      fechaInicio: "2023-01-10",
      fechaTermino: "2023-12-31",
      serieMaquina: "Máquina A",
      contadorTomado: "SI",
    },
    {
      contrato: "Contrato 2",
      fechaInicio: "2023-03-15",
      fechaTermino: "2023-11-30",
      serieMaquina: "Máquina B",
      contadorTomado: "NO",
    },
    {
      contrato: "Contrato 3",
      fechaInicio: "2023-05-20",
      fechaTermino: "2023-10-15",
      serieMaquina: "Máquina C",
      contadorTomado: "SI",
    },
    {
      contrato: "Contrato 4",
      fechaInicio: "2023-07-01",
      fechaTermino: "2023-09-30",
      serieMaquina: "Máquina A",
      contadorTomado: "NO",
    },
  ];

  return (
    <>
      <Grid columns={"equal"} style={{ marginTop: "1em" }}>
        <Grid.Row stretched>
          <Grid.Column width={4}>
            <div className="ctn-card">
              <Form>
                <Form.Group widths={"equal"}>
                  <Form.Input fluid label="Código Cliente" />
                </Form.Group>
                <Form.Group widths={"equal"}>
                  <Form.Input fluid label="Razón Social" />
                </Form.Group>
              </Form>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className="ctn-card">
              <Table
                columns={columnas}
                dataSource={data}
                pagination={"NO"}
                bordered
                size="small"
                showSorterTooltip={"NO"}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column>
            <div className="ctn-card">En desarrollo</div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
