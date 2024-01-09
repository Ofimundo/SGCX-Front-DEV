import React from "react";
import { Table } from "antd";
import { FaFileContract } from "react-icons/fa";
import { Tab, Grid, Input, Image, Button, Icon } from "semantic-ui-react";

export function ListarContratos() {
  const data = [
    {
      key: "1",
      cliente: "Cliente 1",
      fechaInicio: "2023-01-01",
      fechaTermino: "2023-12-31",
      responsable: "Usuario 1",
      folio: "C12345",
    },
    {
      key: "2",
      cliente: "Cliente 2",
      fechaInicio: "2023-02-01",
      fechaTermino: "2023-11-30",
      responsable: "Usuario 2",
      folio: "C12345",
    },
    {
      key: "3",
      cliente: "Cliente 3",
      fechaInicio: "2023-02-01",
      fechaTermino: "2023-11-30",
      responsable: "Usuario 2",
      folio: "C12345",
    },
    {
      key: "4",
      cliente: "Cliente 4",
      fechaInicio: "2023-02-01",
      fechaTermino: "2023-11-30",
      responsable: "Usuario 4",
      folio: "C12345",
    },
    {
      key: "5",
      cliente: "Cliente 5",
      fechaInicio: "2023-02-01",
      fechaTermino: "2023-11-30",
      responsable: "Usuario 5",
      folio: "C12345",
    },
    // Agrega más datos de contratos aquí
  ];
  // Columnas de la tabla
  const columns = [
    {
      title: "Nombre del Cliente",
      dataIndex: "cliente",
      key: "cliente",
    },
    {
      title: "Folio Contrato",
      dataIndex: "folio",
      key: "folioContrato",
    },
    {
      title: "Fecha de Inicio",
      dataIndex: "fechaInicio",
      key: "fechaInicio",
    },
    {
      title: "Fecha de Término",
      dataIndex: "fechaTermino",
      key: "fechaTermino",
    },
    {
      title: "Responsable Asignado",
      dataIndex: "responsable",
      key: "responsable",
    },
    {
      render: (record) => (
        <Button icon="file alternate" size="tiny" color="blue" />
      ),
      align: "center",
    },
  ];

  return (
    <>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        size="middle"
      />
    </>
  );
}
