import React from "react";
import moment from "moment";
import { Table } from "antd";

export function ListarSeguimiento({ despacho }) {
  const columnasSeguimiento = [
    {
      title: "Fecha",
      render: (record) =>
        record.fecha_evento
          ? moment(record.fecha_evento).format("DD/MM/YYYY")
          : moment(record.eventDate).format("DD/MM/YYYY"),
      width: 90,
      sorter: (a, b) =>
        new Date(a?.fecha_evento || a.eventDate) -
        new Date(b?.fecha_evento || b.eventDate),
    },
    {
      title: "Hora",
      render: (record) =>
        record.fecha_evento
          ? moment.utc(record.fecha_evento).format("HH:mm:ss")
          : moment.utc(record.eventDateTime).format("HH:mm:ss"),
      width: 90,
      sorter: (a, b) =>
        new Date(a?.fecha_evento || a.eventDateTime) -
        new Date(b?.fecha_evento || b.eventDateTime),
    },
    {
      title: "Actividad",
      render: (record) =>
        record.descripcion
          ? record.descripcion.toUpperCase()
          : record.description.toUpperCase(),
      width: 240,
    },
  ];

  return (
    <>
      <Table
        columns={columnasSeguimiento}
        dataSource={despacho}
        pagination={false}
        rowKey={"index"}
        size="small"
        bordered
        showSorterTooltip={false}
      />
    </>
  );
}
