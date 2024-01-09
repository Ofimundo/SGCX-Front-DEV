import React, { useState, useEffect } from "react";
import { Table, Modal, Tooltip } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useStoreFacturas } from "../../../store";
import { obtenerPermisos } from "../../../Function";
import { Icon, Button, Form, Grid } from "semantic-ui-react";
import { listarFacturas, obtenerFoliosDisponibles } from "../../../apis";

export function ListarFacturas({
  recargar,
  enviarSoftland,
  emitirProforma,
  listarContratos,
  eliminarFactura,
  editarPrefactura,
  eliminadoDeFacturas,
}) {
  const { data: session } = useSession();
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataInicial, setDataInicial] = useState([]);
  const [dataFiltrada, setDataFiltrada] = useState([]);
  const [ocultarEditar, setOcultarEditar] = useState(false);
  const [ocultarAcciones, setOcultarAcciones] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //DEBE QUEDAR EN INGLES

  const [foliosPendientes, setFoliosPendientes] = useState(0);
  const [foliosDisponibles, setFoliosDisponibles] = useState(0);

  const [modal, contextHolder] = Modal.useModal();
  const setFacturasArray = useStoreFacturas((state) => state.setFacturasArray);

  useEffect(() => {
    if (dataInicial.length !== 0) {
      formikFacturas.handleSubmit();
    }
  }, [recargar]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    (async () => {
      try {
        const response = await obtenerFoliosDisponibles(session.id_token);
        setFoliosPendientes(response.pendientes);
        setFoliosDisponibles(response.disponibles);
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const columnas = [
    {
      title: "Factura",
      dataIndex: "nFactura",
      fixed: "left",
      align: "center",
      width: 100,
      sorter: (a, b) => a.nFactura - b.nFactura,
    },
    {
      title: "Centro Fact.",
      dataIndex: "codCliente",
      align: "center",
      width: 100,
      sorter: (a, b) => a.codCliente - b.codCliente,
    },
    {
      title: "Cliente",
      dataIndex: "nomCliente",
      align: "center",
      ellipsis: true,
      sorter: (a, b) => a.nomCliente.localeCompare(b.nomCliente),
    },
    {
      title: "Contrato",
      render: (record) =>
        record.folioContrato ? (
          record.folioContrato
        ) : (
          <Button
            type="button"
            icon="calendar plus outline"
            color="blue"
            size="mini"
            onClick={() => listarContratos(record.contratos)}
          />
        ),
      align: "center",
    },
    {
      title: "Emisión",
      render: (record) => moment.utc(record.fEmision).format("DD/MM/YYYY"),
      align: "center",
      sorter: (a, b) => new Date(a.fEmision) - new Date(b.fEmision),
    },
    {
      title: "NETO",
      render: (record) => `$${Intl.NumberFormat("es-CL").format(record.neto)}`,
      align: "center",
      sorter: (a, b) => a.neto - b.neto,
    },
    {
      title: "Tipo Factura",
      dataIndex: "tipoFactura",
      align: "center",
      sorter: (a, b) => a.tipoFactura.localeCompare(b.tipoFactura),
    },
    {
      title: "Tipo Emisión",
      dataIndex: "tipoEmision",
      align: "center",
      sorter: (a, b) => a.tipoEmision.localeCompare(b.tipoEmision),
    },
    {
      title: "Valida Total",
      render: (record) =>
        record.alertaTotal === "OK" ? (
          <Icon name="check" color="green" size="large" />
        ) : (
          <Tooltip
            placement="top"
            title={
              "El total es superior al promedio de las últimas 3 facturas."
            }
          >
            <Icon name="attention" color="yellow" size="large" />
          </Tooltip>
        ),
      align: "center",
      width: 85,
    },
    ...(ocultarAcciones
      ? [
          {
            title: "Softland",
            render: (record) => record.mensajeSoftland,
          },
        ]
      : []),
    ...(!ocultarAcciones
      ? [
          ...(!ocultarEditar
            ? [
                {
                  render: (record) => (
                    <Button
                      type="button"
                      icon="pencil"
                      color="blue"
                      size="mini"
                      onClick={() => editarPrefactura(record)}
                      disabled={obtenerPermisos(session.permissions, 6)}
                    />
                  ),
                  width: 50,
                  align: "center",
                  fixed: "right",
                },
              ]
            : []),
          {
            title: "",
            render: (record) => (
              <Button
                type="button"
                icon="trash alternate outline"
                color="red"
                size="mini"
                disabled={
                  ![0, 1].includes(selectedRowKeys.length) ||
                  obtenerPermisos(session.permissions, 5)
                }
                onClick={() => eliminarFactura(record.nFactura)}
              />
            ),
            align: "center",
            fixed: "right",
            width: 50,
          },
        ]
      : []),
  ];

  const filtrarPorCategoria = (e) => {
    setFiltro(e.target.value);
    setDataFiltrada(
      dataInicial.filter(
        (item) =>
          item.nFactura.toString().includes(e.target.value) ||
          (item.nPrefactura &&
            item.nPrefactura.toString().includes(e.target.value)) ||
          item.codCliente.toString().includes(e.target.value) ||
          item.nomCliente.toString().includes(e.target.value.toUpperCase()) ||
          (item.folioContrato &&
            item.folioContrato.includes(e.target.value.toUpperCase())) ||
          item.tipoFactura.toString().includes(e.target.value.toUpperCase())
      )
    );
  };

  const formikFacturas = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(validationSchema()),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        setFiltro("");
        setDataInicial([]);
        setDataFiltrada([]);
        setFacturasArray([]);
        setSelectedRowKeys([]);
        setLoading(true);
        const response = await listarFacturas(formValue, session.id_token);

        if (formValue.tipoFacturacion === "N") setOcultarEditar(true);
        else setOcultarEditar(false);

        if (formValue.envioSoftland === "S") setOcultarAcciones(true);
        else setOcultarAcciones(false);

        setDataInicial(response);
        setDataFiltrada(response);
      } catch (error) {
        modal.info({
          content: error.message,
        });
      } finally {
        setLoading(false);
      }
    },
  });

  //SELECCIONAR FILAS
  const onSelectChange = (llaveFilaSeleccionada, filaSeleccionada) => {
    setFacturasArray(filaSeleccionada);
    setSelectedRowKeys(llaveFilaSeleccionada);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const tipoFacturacion = [
    { key: 1, text: "Pre Factura", value: "S" },
    { key: 2, text: "Factura", value: "N" },
  ];
  const enviadoSoftland = [
    { key: 1, text: "Si", value: "S" },
    { key: 2, text: "No", value: "N" },
  ];
  const tipoFactura = [
    { key: 1, text: "Cargo Fijo", value: "0" },
    { key: 2, text: "Cargo Variable", value: "1" },
    { key: 3, text: "CF + CV", value: "2" },
    //{ key: 4, text: "Sobreconsumo", value: "21" }, MODIFICAR
    { key: 5, text: "Todos", value: "4" },
  ];

  return (
    <>
      {contextHolder}

      <div className="ctn-card up">
        <Form onSubmit={formikFacturas.handleSubmit}>
          <Form.Group widths={"equal"}>
            <Form.Dropdown
              fluid
              selection
              label="Tipo Facturación"
              name="tipoFacturacion"
              selectOnBlur={false}
              options={tipoFacturacion}
              value={formikFacturas.values.tipoFacturacion}
              error={formikFacturas.errors.tipoFacturacion}
              onChange={(_, data) =>
                formikFacturas.setFieldValue("tipoFacturacion", data.value)
              }
            />
            <Form.Dropdown
              fluid
              selection
              name="tipoFactura"
              options={tipoFactura}
              label="Tipo Factura"
              selectOnBlur={false}
              value={formikFacturas.values.tipoFactura}
              error={formikFacturas.errors.tipoFactura}
              onChange={(_, data) =>
                formikFacturas.setFieldValue("tipoFactura", data.value)
              }
            />
            <Form.Input
              fluid
              type="date"
              name="fechaInicio"
              label="Fecha Inicio"
              value={formikFacturas.values.fechaInicio}
              onChange={formikFacturas.handleChange}
              error={formikFacturas.errors.fechaInicio}
            />
            <Form.Input
              fluid
              type="date"
              name="fechaFin"
              label="Fecha Fin"
              value={formikFacturas.values.fechaFin}
              onChange={formikFacturas.handleChange}
              error={formikFacturas.errors.fechaFin}
            />
            <Form.Dropdown
              fluid
              selection
              name="envioSoftland"
              options={enviadoSoftland}
              label="Enviado a softland"
              value={formikFacturas.values.envioSoftland}
              error={formikFacturas.errors.envioSoftland}
              onChange={(_, data) =>
                formikFacturas.setFieldValue("envioSoftland", data.value)
              }
            />
            <Form.Button
              label="‎"
              content="Buscar"
              type="submit"
              color="black"
              disabled={obtenerPermisos(session.permissions, 2)}
            />
          </Form.Group>
        </Form>

        <Form>
          <Form.Group widths="3">
            <Form.Input
              fluid
              icon="search"
              placeholder="Buscar por Centro Fact, Cliente, Contrato, etc."
              value={filtro}
              onChange={filtrarPorCategoria}
            />
          </Form.Group>
        </Form>

        <Table
          columns={columnas}
          dataSource={dataFiltrada}
          pagination={false}
          rowSelection={ocultarAcciones ? false : rowSelection}
          scroll={{ y: "calc(100vh - 350px)" }}
          loading={loading}
          rowKey="indice"
          className="facturas-tabla"
          bordered
          size="small"
          showSorterTooltip={false}
          footer={() => (
            <div style={{ margin: "0.2em 0" }}>
              <Grid columns="3" verticalAlign="middle" textAlign="center">
                <Grid.Column>
                  Total Facturas: <strong>{dataFiltrada.length}</strong>
                </Grid.Column>
                <Grid.Column>
                  Facturas Emitidas Pendientes:{" "}
                  <strong>{foliosPendientes}</strong>
                </Grid.Column>
                <Grid.Column>
                  Folios Electrónicos Disponibles:{" "}
                  <strong>{foliosDisponibles}</strong>
                </Grid.Column>
              </Grid>
            </div>
          )}
        />

        <div className="btn-navbar between" style={{ marginTop: "1em" }}>
          <div className="btn-navbar">
            <Button
              color="blue"
              content="Enviar a Softland"
              onClick={() => enviarSoftland()}
              disabled={
                ocultarAcciones
                  ? true
                  : false || obtenerPermisos(session.permissions, 3)
              }
            />
            {ocultarEditar ? null : (
              <Button
                color="black"
                content="Emitir ProForma"
                onClick={() => emitirProforma()}
                disabled={
                  ocultarAcciones
                    ? true
                    : false || obtenerPermisos(session.permissions, 4)
                }
              />
            )}
          </div>
          <div>
            <Button
              type="button"
              color="red"
              content={
                ocultarEditar ? "Eliminar Factura" : "Eliminar Pre Factura"
              }
              onClick={() => eliminadoDeFacturas()}
              disabled={
                ocultarAcciones
                  ? true
                  : false || obtenerPermisos(session.permissions, 5)
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

function initialValues() {
  return {
    tipoFacturacion: "",
    tipoFactura: "",
    fechaInicio: moment().startOf("month").format("YYYY-MM-DD"),
    fechaFin: moment.utc().format("YYYY-MM-DD"),
    envioSoftland: "N",
  };
}

function validationSchema() {
  return {
    tipoFacturacion: Yup.string().required(true),
    tipoFactura: Yup.string().required(true),
    fechaInicio: Yup.string().required(true),
    fechaFin: Yup.string().required(true),
    envioSoftland: Yup.string(),
  };
}
