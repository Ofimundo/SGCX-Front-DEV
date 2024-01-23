import React, { useState } from "react";
import * as Yup from "yup";
import moment from "moment";
import { useFormik } from "formik";
import { Table, Modal, Spin } from "antd";
import { resultadosEncuesta } from "../apis";
import { useSession } from "next-auth/react";
import { Grid, Form, Button } from "semantic-ui-react";
import { GraficoBarras, CardPersonalizado } from "../components";
import { ExcelFile, ExcelSheet, ExcelColumn } from "react-xlsx-wrapper";

export default function Encuestas() {
  const { data: session } = useSession();
  const [modal, contextHolder] = Modal.useModal();

  const [filtro, setFiltro] = useState("");
  const [resumen, setResumen] = useState([]);
  const [detalle, setDetalle] = useState([]);
  const [detalleFiltro, setDetalleFiltro] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [preguntaUno, setPreguntaUno] = useState([]);
  const [preguntaDos, setPreguntaDos] = useState([]);
  const [preguntaTres, setPreguntaTres] = useState([]);

  const formikFiltros = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(ValidationSchema()),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        setFiltro("");
        setCargando(true);
        const response = await resultadosEncuesta(
          formValue.mesInicio,
          formValue.tipoSoporte,
          session.id_token
        );
        setResumen(response.resumen);
        setDetalle(response.detalle);
        setDetalleFiltro(response.detalle);
        setPreguntaUno(
          response.graficos.filter((item) => item.pregunta === 1).reverse()
        );
        setPreguntaDos(
          response.graficos.filter((item) => item.pregunta === 2).reverse()
        );
        setPreguntaTres(
          response.graficos.filter((item) => item.pregunta === 3)
        );
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      } finally {
        setCargando(false);
      }
    },
  });

  const columnas = [
    {
      title: "N° Ticket",
      dataIndex: "folioTicket",
      sorter: (a, b) => a.folioTicket - b.folioTicket,
      width: 90,
    },
    {
      title: "Nombre Técnico",
      dataIndex: "nombreTecnico",
      sorter: (a, b) => a.nombreTecnico.localeCompare(b.nombreTecnico),
      width: 130,
    },
    {
      title: "Nombre Usuario",
      dataIndex: "nombreUsuario",
      sorter: (a, b) => a.nombreUsuario.localeCompare(b.nombreUsuario),
      width: 130,
      ellipsis: true,
    },
    {
      title: "Correo",
      dataIndex: "emailUsuario",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Teléfono",
      dataIndex: "fonoUsuario",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Rut Empresa",
      dataIndex: "rutEmpresa",
      width: 100,
    },
    {
      title: "Pregunta 1",
      dataIndex: "respuestaUno",
      sorter: (a, b) => Intl.Collator().compare(a.respuestaUno, b.respuestaUno),
      width: 100,
    },
    {
      title: "Pregunta 2",
      dataIndex: "respuestaDos",
      sorter: (a, b) => Intl.Collator().compare(a.respuestaDos, b.respuestaDos),
      width: 100,
    },
    {
      title: "Pregunta 3",
      dataIndex: "respuestaTres",
      sorter: (a, b) =>
        Intl.Collator().compare(a.respuestaTres, b.respuestaTres),
      width: 120,
    },
  ];

  const filtrarPorColumnas = (e) => {
    setFiltro(e.target.value);
    setDetalleFiltro(
      detalle.filter(
        (item) =>
          item.folioTicket.toString().includes(e.target.value.toUpperCase()) ||
          item.nombreTecnico.toString().includes(e.target.value.toUpperCase())
      )
    );
  };

  return (
    <>
      {contextHolder}

      <Form onSubmit={formikFiltros.handleSubmit}>
        <Form.Group widths={"4"}>
          <Form.Dropdown
            fluid
            label="Soporte Técnico"
            name="tipoSoporte"
            selection
            selectOnBlur={false}
            options={[
              { key: 1, text: "Presencial", value: "4" },
              { key: 2, text: "Remoto", value: "6" },
              { key: 3, text: "Todos", value: "4,6" },
            ]}
            placeholder="Seleccione el tipo de soporte"
            value={formikFiltros.values.tipoSoporte}
            error={formikFiltros.errors.tipoSoporte}
            onChange={(_, data) =>
              formikFiltros.setFieldValue("tipoSoporte", data.value)
            }
          />
          <Form.Input
            fluid
            name="mesInicio"
            type="month"
            label="Mes"
            value={formikFiltros.values.mesInicio}
            onChange={formikFiltros.handleChange}
            error={formikFiltros.errors.mesInicio}
          />
          <Form.Button label="‎" type="submit" color="blue" content="Buscar" />
        </Form.Group>
      </Form>

      <Grid columns="equal" stackable style={{ marginTop: "1em" }}>
        <Grid.Row stretched>
          <Grid.Column>
            <Spin spinning={cargando}>
              <CardPersonalizado
                link={""}
                icono={"file alternate outline"}
                color={"blue"}
                texto={"Encuestas"}
                valor={resumen["Encuestas"] || 0}
              />
            </Spin>
          </Grid.Column>
          <Grid.Column>
            <Spin spinning={cargando}>
              <CardPersonalizado
                link={""}
                icono={"check circle outline"}
                color={"green"}
                texto={"Completadas"}
                valor={resumen["Completadas"] || 0}
              />
            </Spin>
          </Grid.Column>
          <Grid.Column>
            <Spin spinning={cargando}>
              <CardPersonalizado
                link={""}
                icono={"hourglass half"}
                color={"orange"}
                texto={"Pendientes"}
                valor={resumen["Pendientes"] || 0}
              />
            </Spin>
          </Grid.Column>
          <Grid.Column>
            <Spin spinning={cargando}>
              <CardPersonalizado
                link={""}
                icono={"ban"}
                color={"violet"}
                texto={"Caducadas"}
                valor={resumen["Caducadas"] || 0}
              />
            </Spin>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column>
            <Spin spinning={cargando}>
              <div className="ctn-card" style={{ height: "360px" }}>
                <GraficoBarras
                  titulo={
                    "¿Qué tan sencillo resultó solicitar asistencia técnica?"
                  }
                  xtitulo={[
                    "Muy Fácil",
                    "Fácil",
                    "Neutral",
                    "Difícil",
                    "Muy Difícil",
                  ]}
                  dataArray={preguntaUno.map((item) => item.total)}
                />
              </div>
            </Spin>
          </Grid.Column>
          <Grid.Column>
            <Spin spinning={cargando}>
              <div className="ctn-card" style={{ height: "360px" }}>
                <GraficoBarras
                  titulo={
                    "¿Cómo evaluarias al técnico que atendió tu solicitud?"
                  }
                  xtitulo={[
                    "Excelente",
                    "Bueno",
                    "Regular",
                    "Malo",
                    "Muy Malo",
                  ]}
                  dataArray={preguntaDos.map((item) => item.total)}
                />
              </div>
            </Spin>
          </Grid.Column>
          <Grid.Column>
            <Spin spinning={cargando}>
              <div className="ctn-card" style={{ height: "360px" }}>
                <GraficoBarras
                  titulo={"¿Se resolvió el problema técnico presentado?"}
                  xtitulo={[
                    "Completamente Resuelto",
                    "Parcialmente Resuelto",
                    "No Resuelto",
                  ]}
                  dataArray={preguntaTres.map((item) => item.total)}
                />
              </div>
            </Spin>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <div className="ctn-card">
              <Form>
                <Form.Group widths="4">
                  <Form.Input
                    fluid
                    label="Filtros"
                    icon="search"
                    value={filtro}
                    onChange={filtrarPorColumnas}
                    placeholder="Buscar por ticket o técnico"
                  />
                  <Form.Field>
                    <label>‎</label>
                    <ExcelFile
                      element={<Button color="blue" icon="download" />}
                      filename="Resultados Encuestas"
                    >
                      <ExcelSheet data={detalleFiltro} name="Encuesta PSC">
                        <ExcelColumn label="N° Ticket" value="folioTicket" />
                        <ExcelColumn
                          label="Nombre Técnico"
                          value="nombreTecnico"
                        />
                        <ExcelColumn
                          label="Nombre Usuario"
                          value="nombreUsuario"
                        />
                        <ExcelColumn label="Correo" value="emailUsuario" />
                        <ExcelColumn label="Teléfono" value="fonoUsuario" />
                        <ExcelColumn label="Rut Empresa" value="rutEmpresa" />
                        <ExcelColumn label="Pregunta 1" value="respuestaUno" />
                        <ExcelColumn label="Pregunta 2" value="respuestaDos" />
                        <ExcelColumn label="Pregunta 3" value="respuestaTres" />
                      </ExcelSheet>
                    </ExcelFile>
                  </Form.Field>
                </Form.Group>
              </Form>

              <Table
                bordered
                size="small"
                loading={cargando}
                columns={columnas}
                dataSource={detalleFiltro}
                rowKey={"folioTicket"}
                scroll={{ x: "90vw" }}
                pagination={{ defaultPageSize: 15 }}
                showSorterTooltip={false}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}

function initialValues() {
  return {
    tipoSoporte: "",
    mesInicio: moment.utc().format("YYYY-MM"),
  };
}

function ValidationSchema() {
  return {
    tipoSoporte: Yup.string().required(true),
    mesInicio: Yup.string().required(true),
  };
}
