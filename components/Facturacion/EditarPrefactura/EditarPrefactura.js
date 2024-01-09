import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { Table, Modal } from "antd";
import { useSession } from "next-auth/react";
import { Tab, Form, Button, Divider, Grid } from "semantic-ui-react";
import {
  generarRecalculo,
  agregarReferencia,
  eliminarReferencias,
  obtenerLineaDetalle,
  agregarLineaDetalle,
  eliminarLineaDetalle,
  obtenerMaquinasContrato,
  eliminarSeriePrefactura,
  obtenerReferenciaPrefactura,
} from "../../../apis";
import { useStoreRecargar } from "../../../store";
import { soloNumeros, obtenerPermisos } from "../../../Function";

export function EditarPrefactura({
  prefactura,
  referencia,
  indicadores,
  lineaDetalle,
  tipoDocumentos,
  maquinasContrato,
}) {
  const { data: session } = useSession();

  const [modal, contextHolder] = Modal.useModal();
  const [nuevaReferencia, setNuevaReferencia] = useState(referencia);
  const [nuevaMaquina, setNuevaMaquina] = useState(maquinasContrato);
  const [nuevaLineaDetalle, setNuevaLineaDetalle] = useState(lineaDetalle);

  const setRecargar = useStoreRecargar((state) => state.setRecargarFacturas);
  /*
  //RECARGAR LAS LINEAS DE DETALLE PARA EL RECALCULO
  useEffect(() => {
    (async () => {
      if (nuevaLineaDetalle.length === 0) {
        const response = await obtenerLineaDetalle(
          prefactura.nFactura,
          session.id_token
        );
        setNuevaLineaDetalle(response);
      }
    })();
  }, [nuevaLineaDetalle]); // eslint-disable-line react-hooks/exhaustive-deps
*/
  const actualizarDetalles = async (tipo) => {
    if (tipo === 1) {
      const referencia = await obtenerReferenciaPrefactura(
        prefactura.nFactura,
        session.id_token
      );
      setNuevaReferencia(referencia);
    } else if (tipo === 2) {
      const lineaDetalle = await obtenerLineaDetalle(
        prefactura.nFactura,
        session.id_token
      );
      setNuevaLineaDetalle(lineaDetalle);
    } else {
      const maquinas = await obtenerMaquinasContrato(
        prefactura.nFactura,
        session.id_token
      );
      setNuevaMaquina(maquinas);
    }
  };

  const columnnasMaquinas = [
    {
      title: "Contrato N°",
      dataIndex: "contrato",
      width: 90,
    },
    {
      title: "Serie",
      dataIndex: "serie",
      width: 90,
    },
    {
      title: "N° Parte",
      dataIndex: "nParte",
      width: 90,
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Habilitación",
      render: (record) => moment.utc(record.habilitacion).format("DD/MM/YYYY"),
      width: 90,
    },
    {
      title: "Cargo Fijo Eq",
      dataIndex: "cargoFijo",
      width: 90,
    },
    {
      title: "Moneda C. Fijo",
      dataIndex: "moneda",
      width: 90,
    },
    {
      title: "Cargo Fijo $",
      dataIndex: "cargoFijoPesos",
      width: 90,
    },
    {
      title: "",
      render: (record) => (
        <Button
          type="button"
          icon="trash alternate outline"
          color="red"
          size="tiny"
          onClick={() => eliminarMaquina(record)}
          disabled={
            nuevaMaquina.length === 1
              ? true
              : false || obtenerPermisos(session.permissions, 19)
          }
        />
      ),
      align: "center",
      width: 70,
      fixed: "right",
    },
  ];

  const columnasDetalle = [
    {
      title: "Codigo",
      dataIndex: "codigo",
      width: 90,
      align: "center",
    },
    {
      title: "Descripcion",
      dataIndex: "descripcion",
    },
    {
      render: (record) => (
        <Button
          icon="minus"
          color="red"
          size="tiny"
          onClick={() => eliminarDetalle(record)}
          disabled={obtenerPermisos(session.permissions, 19)}
        />
      ),
      align: "center",
      width: 70,
    },
  ];

  const columnasReferencias = [
    {
      title: "N° Referencia",
      dataIndex: "fila",
      width: 120,
      align: "center",
    },
    {
      title: "Tipo Documento SII",
      dataIndex: "codigo",
      width: 160,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      width: 200,
    },
    {
      title: "N° Documento",
      dataIndex: "documento",
      width: 160,
    },
    {
      title: "Fecha documento",
      render: (record) => moment.utc(record.fecha).format("DD/MM/YYYY"),
      width: 160,
    },
    {
      render: (record) => (
        <Button
          icon="minus"
          color="red"
          size="tiny"
          onClick={() => eliminarReferencia(record)}
          disabled={obtenerPermisos(session.permissions, 19)}
        />
      ),
      align: "center",
      width: 70,
    },
  ];

  //RECIBIR LOS DATOS DEL FORMULARIO PARA AGREGAR REFERENCIAS
  const formikReferencia = useFormik({
    initialValues: {
      tipoDocumento: "",
      numDocumento: "",
      fechaDocumento: "",
    },
    validationSchema: Yup.object({
      tipoDocumento: Yup.string().required(true),
      numDocumento: Yup.string().required(true),
      fechaDocumento: Yup.string().required(true),
    }),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        await agregarReferencia(
          prefactura.nFactura,
          formValue,
          session.id_token
        );
        actualizarDetalles(1);
        formikReferencia.resetForm();
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      }
    },
  });

  //RECIBIR LOS DATOS DEL FORMULARIO DE LINEA DE DETALLE
  const formikDetalle = useFormik({
    initialValues: { textoDetalle: "" },
    validationSchema: Yup.object({ textoDetalle: Yup.string().required(true) }),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        await agregarLineaDetalle(
          prefactura.nFactura,
          formValue.textoDetalle,
          session.id_token
        );
        actualizarDetalles(2);
        formikDetalle.resetForm();
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      }
    },
  });

  //RECIBIR LOS DATOS DEL FORMULARIO PARA RECALCULAR
  const formikRecalcular = useFormik({
    initialValues: {
      dolar: indicadores?.dolar || "",
      uf: indicadores?.uf || "",
      vendedor: prefactura?.vendedor || "",
    },
    validationSchema: Yup.object({
      dolar: Yup.string().required(true),
      uf: Yup.string().required(true),
      vendedor: Yup.string().required(true),
    }),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const dataPrefactura = {
          numFactura: prefactura.nFactura,
          vendedor: formValue.vendedor,
          dolar: formValue.dolar,
          uf: formValue.uf,
          recalcular:
            formValue.dolar !== indicadores.dolar ||
            formValue.uf !== indicadores.uf
              ? "S"
              : "N",
        };
        const response = await generarRecalculo(
          dataPrefactura,
          session.id_token
        );
        actualizarDetalles(2);
        setRecargar();
        modal.success({
          content: response.message,
        });
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      }
    },
  });

  const eliminarReferencia = async (data) => {
    try {
      await eliminarReferencias(
        prefactura.nFactura,
        data.fila,
        session.id_token
      );
      actualizarDetalles(1);
    } catch (error) {
      modal.error({
        title: "Ups, algo salió mal",
        content: error.message,
      });
    }
  };

  const eliminarDetalle = async (data) => {
    try {
      await eliminarLineaDetalle(
        prefactura.nFactura,
        data.fila,
        session.id_token
      );
      actualizarDetalles(2);
    } catch (error) {
      modal.error({
        title: "Ups, algo salió mal",
        content: error.message,
      });
    }
  };

  const eliminarMaquina = async (equipo) => {
    try {
      const response = await eliminarSeriePrefactura(
        equipo.serie,
        prefactura.nFactura,
        session.id_token
      );
      setRecargar();
      actualizarDetalles(3);
      modal.success({
        content: response.message,
      });
    } catch (error) {
      modal.error({
        title: "Ups, algo salió mal",
        content: error.message,
      });
    }
  };

  const panes = [
    {
      menuItem: "Encabezado / Detalle",
      render: () => (
        <div style={{ marginTop: "1em" }}>
          <Tab.Pane>
            <Form onSubmit={formikRecalcular.handleSubmit}>
              <Form.Group>
                <Form.Field onChange={formikRecalcular.handleChange}>
                  <Form.Input
                    name="dolar"
                    label="Dolar USD"
                    maxLength={6}
                    onKeyPress={soloNumeros}
                    value={formikRecalcular.values.dolar}
                    onChange={formikRecalcular.handleChange}
                    error={formikRecalcular.errors.dolar}
                  />
                </Form.Field>
                <Form.Field onChange={formikRecalcular.handleChange}>
                  <Form.Input
                    name="uf"
                    label="U.F. - Unidad de Fomento"
                    maxLength={9}
                    onKeyPress={soloNumeros}
                    value={formikRecalcular.values.uf}
                    onChange={formikRecalcular.handleChange}
                    error={formikRecalcular.errors.uf}
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Input
                    name="vendedor"
                    label="Vendedor"
                    value={formikRecalcular.values.vendedor}
                    onChange={formikRecalcular.handleChange}
                    error={formikRecalcular.errors.vendedor}
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Button
                    content="Actualizar"
                    label="‎"
                    color="blue"
                    type="submit"
                    disabled={obtenerPermisos(session.permissions, 16)}
                  />
                </Form.Field>
              </Form.Group>
            </Form>

            <Divider
              horizontal
              content="Referencias"
              style={{ margin: "25px 0" }}
            />

            <Form onSubmit={formikReferencia.handleSubmit}>
              <Grid
                columns={"equal"}
                verticalAlign="middle"
                style={{ marginBottom: "2.5px" }}
              >
                <Grid.Column>
                  <Form.Dropdown
                    fluid
                    selection
                    label="Tipo Documento SII"
                    placeholder="Seleccionar..."
                    name="tipoDocumento"
                    selectOnBlur={false}
                    options={tipoDocumentos}
                    value={formikReferencia.values.tipoDocumento}
                    error={formikReferencia.errors.tipoDocumento}
                    onChange={(_, data) =>
                      formikReferencia.setFieldValue(
                        "tipoDocumento",
                        data.value
                      )
                    }
                  />
                </Grid.Column>
                <Grid.Column>
                  <Form.Input
                    fluid
                    maxLength={18}
                    label="N° Documento"
                    placeholder="Ejem: 123456"
                    name="numDocumento"
                    value={formikReferencia.values.numDocumento}
                    onChange={formikReferencia.handleChange}
                    error={formikReferencia.errors.numDocumento}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Form.Input
                    fluid
                    type="date"
                    name="fechaDocumento"
                    label="Fecha Documento"
                    value={formikReferencia.values.fechaDocumento}
                    onChange={formikReferencia.handleChange}
                    error={formikReferencia.errors.fechaDocumento}
                  />
                </Grid.Column>

                <Grid.Column>
                  <Form.Button
                    color="green"
                    label="‎"
                    type="submit"
                    content="Agregar"
                    disabled={
                      nuevaReferencia.length === 5
                        ? true
                        : false || obtenerPermisos(session.permissions, 17)
                    }
                  />
                </Grid.Column>
              </Grid>
            </Form>

            <Table
              columns={columnasReferencias}
              dataSource={nuevaReferencia}
              pagination={false}
              rowKey="fila"
              size="small"
              bordered
            />

            <Divider
              horizontal
              content="Lineas de detalle"
              style={{ margin: "25px 0" }}
            />

            <Form onSubmit={formikDetalle.handleSubmit}>
              <Form.Group>
                <Form.Field width={4}>
                  <Form.Input
                    name="textoDetalle"
                    value={formikDetalle.values.textoDetalle}
                    onChange={formikDetalle.handleChange}
                    error={formikDetalle.errors.textoDetalle}
                  />
                </Form.Field>
                <Form.Field>
                  <Button
                    color="green"
                    type="submit"
                    content="Agregar"
                    disabled={obtenerPermisos(session.permissions, 18)}
                  />
                </Form.Field>
              </Form.Group>
            </Form>

            <Table
              columns={columnasDetalle}
              dataSource={nuevaLineaDetalle}
              scroll={{ y: "30vh" }}
              pagination={false}
              rowKey="indice"
              size="small"
              bordered
            />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: "Máquinas Incluidas en el Cálculo",
      render: () => (
        <div style={{ marginTop: "1em" }}>
          <Tab.Pane>
            <Table
              columns={columnnasMaquinas}
              dataSource={nuevaMaquina}
              scroll={{ x: "80vw", y: "60vh" }}
              pagination={false}
              rowKey="indice"
              size="small"
              bordered
              footer={() => (
                <div style={{ margin: "0.2em 0" }}>
                  <Grid columns="3" verticalAlign="middle" textAlign="center">
                    <Grid.Column>
                      Total Maquinas: <strong>{nuevaMaquina.length}</strong>
                    </Grid.Column>
                  </Grid>
                </div>
              )}
            />
          </Tab.Pane>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <Tab panes={panes} />
    </>
  );
}
/*
<Descriptions
  layout="vertical"
  size="small"
  column={3}
  labelStyle={{ color: "black", fontWeight: "500" }}
>
  <Descriptions.Item label="Factura">
    {prefactura?.nFactura || ""}
  </Descriptions.Item>
  <Descriptions.Item label="Vendedor">
    {prefactura?.vendedor || ""}
  </Descriptions.Item>
  <Descriptions.Item label="Cliente">
    {prefactura?.nomCliente || ""}
  </Descriptions.Item>
</Descriptions>
*/

/*

<Form onSubmit={formikDetalle.handleSubmit}>
  <Grid
    columns={"equal"}
    verticalAlign="middle"
    style={{ marginBottom: "2.5px" }}
  >
    <Grid.Column>
      <h4>
        <Icon name="pencil" />
        LINEAS DE DETALLE
      </h4>
    </Grid.Column>
    <Grid.Column textAlign="right" width={6}>
      <Form.Input
        fluid
        name="textoDetalle"
        value={formikDetalle.values.textoDetalle}
        onChange={formikDetalle.handleChange}
        error={formikDetalle.errors.textoDetalle}
        style={{ marginLeft: "60px" }}
      />
    </Grid.Column>
    <Grid.Column textAlign="right" width={4}>
      <Button color="green" type="submit" content="Agregar" />
    </Grid.Column>
  </Grid>
</Form>
*/
