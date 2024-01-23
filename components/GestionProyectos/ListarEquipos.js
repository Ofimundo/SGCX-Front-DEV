import React, { useState, useEffect } from "react";
import moment from "moment";
import { Table, Modal } from "antd";
import { useSession } from "next-auth/react";
import { obtenerPermisos } from "../../Function";
import { descargarReportes } from "../../apis";
import { Input, Grid, Icon, Button, Form, Label } from "semantic-ui-react";

export function ListarEquipos({
  equipos,
  cargando,
  contrato,
  actualizarFechas,
  actualizarRegistros,
}) {
  const { data: session } = useSession();
  const [filtro, setFiltro] = useState("");
  const [equiposFiltro, setEquiposFiltro] = useState([]);
  const [equiposInicial, setEquiposInicial] = useState([]);

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    setEquiposInicial(equipos);
    setEquiposFiltro(equipos);
  }, [equipos]);

  const columnas = [
    {
      title: "ID",
      dataIndex: "indice",
      width: 40,
      fixed: "left",
    },
    {
      title: "Región",
      dataIndex: "region",
      width: 160,
      sorter: (a, b) => a.region.localeCompare(b.region),
      ellipsis: true,
    },
    {
      title: "Comuna",
      dataIndex: "comuna",
      width: 110,
      sorter: (a, b) => a.comuna.localeCompare(b.comuna),
      ellipsis: true,
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      width: 160,
      ellipsis: true,
      sorter: (a, b) => a.direccion.localeCompare(b.direccion),
      ellipsis: true,
    },
    {
      title: "Ubicación Equipo",
      dataIndex: "ubicacion",
      width: 160,
      ellipsis: true,
    },
    {
      title: "Modelo",
      dataIndex: "modelo",
      width: 140,
      ellipsis: true,
      sorter: (a, b) => a.descripcion.localeCompare(b.modelo),
    },
    {
      title: "N° Serie",
      dataIndex: "serie",
      width: 105,
      ellipsis: true,
    },
    {
      title: "Guía Despacho",
      dataIndex: "folioGuia",
      width: 105,
      ellipsis: true,
      sorter: (a, b) => a.folioGuia - b.folioGuia,
    },
    {
      title: <Label color="blue">Fecha de Despacho</Label>,
      children: [
        {
          title: "Estimada",
          render: (record) =>
            record.fechaEstimadaDespacho === null ? (
              <div onClick={(e) => e.stopPropagation()}>
                <Input
                  fluid
                  type="date"
                  size="small"
                  disabled={obtenerPermisos(session.permissions, 14)}
                  onChange={(e) =>
                    actualizarFechas(e.target.value, record, "d")
                  }
                />
              </div>
            ) : (
              moment.utc(record.fechaEstimadaDespacho).format("YYYY-MM-DD")
            ),
          align: "center",
          width: 120,
        },
        {
          title: "Real",
          render: (record) =>
            record.fechaDespacho
              ? moment.utc(record.fechaDespacho).format("YYYY-MM-DD")
              : "",
          align: "center",
          width: 120,
        },
      ],
    },
    {
      title: <Label color="orange">Fecha de Entrega</Label>,
      children: [
        {
          title: "Estimada",
          render: (record) =>
            record.fechaEstimadaEntrega != null ? (
              moment.utc(record.fechaEstimadaEntrega).format("YYYY-MM-DD")
            ) : record.fechaEstimadaDespacho != null ? (
              <div onClick={(e) => e.stopPropagation()}>
                <Input
                  fluid
                  type="date"
                  size="small"
                  disabled={obtenerPermisos(session.permissions, 14)}
                  min={moment
                    .utc(record.fechaEstimadaDespacho)
                    .format("YYYY-MM-DD")}
                  onChange={(e) =>
                    actualizarFechas(e.target.value, record, "e")
                  }
                />
              </div>
            ) : null,
          align: "center",
          width: 120,
        },
        {
          title: "Real",
          render: (record) =>
            record.fechaEntrega
              ? moment.utc(record.fechaEntrega).format("YYYY-MM-DD")
              : "",
          align: "center",
          width: 120,
        },
      ],
    },
    {
      title: <Label color="green">Fecha de Habilitación</Label>,
      children: [
        {
          title: "Estimada",
          render: (record) =>
            record.fechaEstimadaInstalacion != null ? (
              moment.utc(record.fechaEstimadaInstalacion).format("YYYY-MM-DD")
            ) : record.fechaEstimadaEntrega != null ? (
              <div onClick={(e) => e.stopPropagation()}>
                <Input
                  fluid
                  type="date"
                  size="small"
                  disabled={obtenerPermisos(session.permissions, 22)}
                  min={moment
                    .utc(record.fechaEstimadaEntrega)
                    .format("YYYY-MM-DD")}
                  onChange={(e) =>
                    actualizarFechas(e.target.value, record, "i")
                  }
                />
              </div>
            ) : null,
          align: "center",
          width: 120,
        },
        {
          title: "Real",
          render: (record) =>
            record.fechaHabilitacion
              ? moment.utc(record.fechaHabilitacion).format("YYYY-MM-DD")
              : "",
          align: "center",
          width: 120,
        },
      ],
    },
  ];

  /*
  const filtrarPorCategoria = (e) => {
    setFiltro(e.target.value);
    setEquiposFiltro(
      equiposInicial.filter((item) =>
        item.serie.toString().includes(e.target.value.toUpperCase())
      )
    );
  };
  */
  const descargarResumen = async () => {
    if (contrato) {
      try {
        await descargarReportes(3, contrato, session.id_token);
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      }
    } else {
      modal.info({
        content: "No has ingresado ningún contrato",
      });
    }
  };

  return (
    <>
      {contextHolder}

      <div className="ctn-card ">
        <div className="btn-navbar between" style={{ marginBottom: "1em" }}>
          <label className="title">
            <Icon name="calendar check outline" />
            SEGUIMIENTO DE HABILITACIÓN
          </label>
          <div className="btn-navbar">
            <Button
              color="blue"
              content="Guardar"
              onClick={() => actualizarRegistros()}
              disabled={obtenerPermisos(session.permissions, 13)}
            />

            <Button
              aria-label="exportar"
              color="green"
              icon={"download"}
              onClick={() => descargarResumen()}
              disabled={obtenerPermisos(session.permissions, 12)}
            />
          </div>
        </div>
        <Table
          columns={columnas}
          dataSource={equiposFiltro}
          loading={cargando}
          pagination={{ defaultPageSize: 10 }}
          size="small"
          rowKey="indice"
          bordered
          scroll={{ x: "120vw" }}
          showSorterTooltip={false}
          sticky={{
            offsetHeader: 0,
          }}
          footer={() => (
            <div style={{ margin: "0.4em 0" }}>
              <Grid verticalAlign="middle" textAlign="center">
                <Grid.Column>
                  Total Equipos: <strong>{equiposFiltro.length}</strong>
                </Grid.Column>
              </Grid>
            </div>
          )}
        />
      </div>
    </>
  );
}

/*
<Form>
  <Form.Group widths={"equal"}>
    <Form.Input
      icon="search"
      placeholder="Buscar por serie"
      value={filtro}
      onChange={filtrarPorCategoria}
    />
  </Form.Group>
</Form>
*/
