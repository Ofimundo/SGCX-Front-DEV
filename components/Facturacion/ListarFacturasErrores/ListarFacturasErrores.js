import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import moment from "moment";
import { Table, Modal } from "antd";
import { Label, Button, Form, Grid } from "semantic-ui-react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { obtenerPermisos } from "../../../Function";
import {
  obtenerFacturasErrores,
  eliminarFacturasNoEmitidas,
} from "../../../apis";

export function ListarFacturasErrores(props) {
  const { onRecargar } = props;
  const { data: session } = useSession();

  const [filtro, setFiltro] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [recargar, setRecargar] = useState(false);
  const [facturasArray, setFacturasArray] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //DEBE QUEDAR EN INGLES

  const [modal, contextHolder] = Modal.useModal();

  //RECARGAR LAS FACTURAS AL ELIMINARLAS
  useEffect(() => {
    (async () => {
      try {
        setCargando(true);
        const response = await obtenerFacturasErrores(session.id_token);
        setFacturas(response);
        setFacturasFiltradas(response);
        setFiltro("");
        setFacturasArray([]);
        setSelectedRowKeys([]);
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      } finally {
        setCargando(false);
      }
    })();
  }, [recargar]); // eslint-disable-line react-hooks/exhaustive-deps

  const columnas = [
    {
      title: "Centro Facturación",
      dataIndex: "codCliente",
      sorter: (a, b) => a.codCliente - b.codCliente,
      width: 120,
      fixed: "left",
    },
    {
      title: "Cliente",
      dataIndex: "razonSocial",
      sorter: (a, b) => a.razonSocial.localeCompare(b.razonSocial),
      ellipsis: true,
      width: 240,
    },
    {
      title: "Folio Contrato",
      dataIndex: "folioContrato",
      width: 110,
      align: "center",
    },
    {
      title: "Neto",
      render: (record) =>
        `$${Intl.NumberFormat("es-CL").format(record.valorNeto)}`,
      sorter: (a, b) => a.valorNeto - b.valorNeto,
      width: 100,
    },
    {
      title: "Agrupado",
      dataIndex: "agrupa",
      sorter: (a, b) => a.agrupa.localeCompare(b.agrupa),
      width: 100,
      align: "center",
    },
    {
      title: "Fecha de Término",
      render: (record) => moment.utc(record.fechaTermino).format("DD-MM-YYYY"),
      sorter: (a, b) => new Date(a.fechaTermino) - new Date(b.fechaTermino),
      width: 100,
    },
    {
      title: "Prefactura",
      dataIndex: "prefactura",
      sorter: (a, b) => a.prefactura.localeCompare(b.prefactura),
      width: 100,
      align: "center",
    },
    {
      title: "Tipo Factura",
      dataIndex: "tipoFactura",
      width: 100,
      align: "center",
    },
    {
      title: "Vencimiento Factura",
      dataIndex: "vencimientoFactura",
      width: 100,
      align: "center",
    },
    {
      title: "Glosa Facturación",
      dataIndex: "glosaFacturacion",
      width: 300,
    },
    {
      title: "OC Cargo Variable",
      dataIndex: "ordenCompraVariable",
      width: 120,
    },
    {
      title: "OC Cargo Fijo",
      dataIndex: "ordenCompraFijo",
      width: 120,
    },
  ];

  const eliminarFacturaNoEmitida = async () => {
    if (facturasArray.length !== 0) {
      modal.confirm({
        title: "¿Quieres eliminar estas facturas?",
        content: (
          <span>
            Si le das <strong>Aceptar</strong> no debes cerrar esta ventana
          </span>
        ),
        icon: <ExclamationCircleFilled />,
        async onOk() {
          try {
            const response = await eliminarFacturasNoEmitidas(
              facturasArray,
              session.id_token
            );

            modal.success({
              content: response.message,
            });
          } catch (error) {
            modal.error({
              title: "Ups, algo salió mal",
              content: error.message,
            });
          } finally {
            onRecargar();
            setRecargar(!recargar);
          }
        },
      });
    } else {
      modal.info({
        content: "No hay facturas seleccionadas",
      });
    }
  };

  //SELECCIONAR FILAS
  const onSelectChange = (llaveFilaSeleccionada, filaSeleccionada) => {
    setFacturasArray(filaSeleccionada);
    setSelectedRowKeys(llaveFilaSeleccionada);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  //FILTRO
  const filtrarPorCategoria = (e) => {
    setFiltro(e.target.value);
    setFacturasFiltradas(
      facturas.filter(
        (item) =>
          item.codCliente.toString().includes(e.target.value) ||
          item.razonSocial
            .toUpperCase()
            .includes(e.target.value.toUpperCase()) ||
          //item.folioContrato.toString().includes(e.target.value) ||
          item.tipoFactura
            .toString()
            .toUpperCase()
            .includes(e.target.value.toUpperCase())
      )
    );
  };

  return (
    <>
      {contextHolder}
      <div style={{ padding: "0.25em" }}>
        <div className="btn-navbar between">
          <label>FACTURAS NO EMITIDAS</label>
          <div className="btn-navbar">
            <Form>
              <Form.Group widths={"equal"}>
                <Form.Input
                  icon="search"
                  placeholder="Buscar"
                  value={filtro}
                  onChange={filtrarPorCategoria}
                />
              </Form.Group>
            </Form>
            <Button
              icon="trash alternate outline"
              color="red"
              onClick={() => eliminarFacturaNoEmitida()}
              disabled={obtenerPermisos(session.permissions, 8)}
            />
          </div>
        </div>

        <Table
          columns={columnas}
          dataSource={facturasFiltradas}
          scroll={{ x: "50vw", y: "56vh" }}
          pagination={false}
          loading={cargando}
          rowSelection={rowSelection}
          rowKey="indice"
          size="small"
          bordered
          showSorterTooltip={false}
          footer={() => (
            <div style={{ margin: "0.2em 0" }}>
              <Grid verticalAlign="middle" textAlign="center">
                <Grid.Column>
                  Total Facturas: <strong>{facturasFiltradas.length}</strong>
                </Grid.Column>
              </Grid>
            </div>
          )}
        />
      </div>
    </>
  );
}
