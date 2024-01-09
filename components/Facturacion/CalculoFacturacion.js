import React, { useState, useEffect } from "react";
import { Form, Message, Grid } from "semantic-ui-react";
import { useSession } from "next-auth/react";
import { Modal } from "antd";
import moment from "moment";
import * as Yup from "yup";
import { useFormik } from "formik";
import { obtenerPermisos } from "../../Function";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { obtenerIndicadores, generarCalculo } from "../../apis";

export function CalculoFacturacion(props) {
  const { onRecargar } = props;
  const { data: session } = useSession();

  const [mensaje, setMensaje] = useState();
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const [modal, contextHolder] = Modal.useModal();

  //AL RENDERIZAR LA PAGINA POR 1° SE EJECUTA ESTO
  useEffect(() => {
    (async () => {
      obtenerIndicadoresPorFecha();
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //DATA PARA LOS DROPDOWN (COMBOBOX)
  const tipoFacturacion = [
    { key: 1, text: "Pre Factura", value: "1" },
    { key: 2, text: "Factura", value: "0" },
  ];

  const filtrosFacturas = [
    { key: 1, text: "Todos", value: "0" },
    { key: 2, text: "Centro Facturación", value: "1" },
    { key: 3, text: "Contrato", value: "2" },
  ];

  //RECIBIR LOS DATOS DEL FORMULARIO
  const formikCalculo = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object().shape(validationSchema()),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      modal.confirm({
        title: "¿Quieres realizar el cálculo?",
        content: (
          <label>
            Si le das <strong>Aceptar</strong> no debes cerrar esta ventana
          </label>
        ),
        icon: <ExclamationCircleFilled />,
        async onOk() {
          try {
            const response = await generarCalculo(formValue, session.id_token);
            modal.success({
              content: response.message,
            });

            formikCalculo.resetForm();
          } catch (error) {
            modal.error({
              title: "Ups, algo salió mal",
              content: error.message,
            });
          } finally {
            onRecargar();
          }
        },
      });
    },
  });

  //OBTENER LOS INDICADORES DEL DIA
  const obtenerIndicadoresPorFecha = async (e) => {
    try {
      setMostrarMensaje(false);
      formikCalculo.setFieldValue(
        "fechaIndicadores",
        e?.target.value || moment.utc().format("YYYY-MM-DD")
      );

      const response = await obtenerIndicadores(
        e?.target.value || moment.utc().format("YYYY-MM-DD"),
        session.id_token
      );

      formikCalculo.setFieldValue("dolar", response[0]?.valor_moneda || "");
      formikCalculo.setFieldValue("uf", response[1]?.valor_moneda || "");

      if (response[0].habil == "false") {
        setMostrarMensaje(true);
        setMensaje(
          <p>
            La fecha seleccionada corresponde a{" "}
            <strong>fin de semana o feriado</strong>, se ha seleccionado el día
            hábil más cercano{" "}
            <strong>
              {moment.utc(response[0].EqmFec).format("DD/MM/YYYY")}
            </strong>
          </p>
        );

        formikCalculo.setFieldValue("fechaIndicadores", response[0].EqmFec);
      }
    } catch (error) {
      setMostrarMensaje(true);
      setMensaje(<strong>{error.message}</strong>);
      formikCalculo.setFieldValue("uf", "");
      formikCalculo.setFieldValue("dolar", "");
    }
  };

  return (
    <>
      {contextHolder}

      <Form onSubmit={formikCalculo.handleSubmit}>
        <Grid columns={"equal"} style={{ marginTop: "1em" }} stackable>
          <Grid.Row stretched>
            <Grid.Column>
              <div className="ctn-card">
                <Form.Group widths={"2"}>
                  <Form.Input
                    fluid
                    label="Fecha Moneda"
                    readOnly={false}
                    type="date"
                    name="fechaIndicadores"
                    value={formikCalculo.values.fechaIndicadores}
                    error={formikCalculo.errors.fechaIndicadores}
                    onChange={obtenerIndicadoresPorFecha}
                    onClick={(event) => event.target.blur()}
                    max={moment.utc().endOf("day").format("YYYY-MM-DD")}
                  />
                </Form.Group>
                <Form.Group widths={"equal"}>
                  <Form.Field>
                    <label>Valor USD</label>
                    <Form.Input
                      fluid
                      readOnly
                      name="dolar"
                      value={formikCalculo.values.dolar}
                      onChange={formikCalculo.handleChange}
                      error={formikCalculo.errors.dolar}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Valor U.F.</label>
                    <Form.Input
                      fluid
                      readOnly
                      name="uf"
                      value={formikCalculo.values.uf}
                      onChange={formikCalculo.handleChange}
                      error={formikCalculo.errors.uf}
                    />
                  </Form.Field>
                </Form.Group>
                {mostrarMensaje ? <Message info>{mensaje}</Message> : null}
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className="ctn-card">
                <Form.Group widths={"equal"}>
                  <Form.Dropdown
                    fluid
                    selection
                    label="Tipo de Facturación"
                    name="tipoFact"
                    placeholder="Ejem: Pre Factura"
                    selectOnBlur={false}
                    options={tipoFacturacion}
                    value={formikCalculo.values.tipoFact}
                    error={formikCalculo.errors.tipoFact}
                    onChange={(_, data) =>
                      formikCalculo.setFieldValue("tipoFact", data.value)
                    }
                  />
                  <Form.Input
                    fluid
                    label="Fecha Emisión"
                    type="date"
                    name="fechaEmision"
                    value={formikCalculo.values.fechaEmision}
                    onChange={formikCalculo.handleChange}
                    error={formikCalculo.errors.fechaEmision}
                    max={moment.utc().endOf("month").format("YYYY-MM-DD")}
                  />
                </Form.Group>

                <Form.Group widths={"equal"}>
                  <Form.Dropdown
                    fluid
                    label="Filtro"
                    selection
                    name="tipoFiltro"
                    options={filtrosFacturas}
                    value={formikCalculo.values.tipoFiltro}
                    error={formikCalculo.errors.tipoFiltro}
                    onChange={(_, data) =>
                      formikCalculo.setFieldValue("tipoFiltro", data.value)
                    }
                  />

                  <Form.Input
                    fluid
                    label={
                      formikCalculo.values.tipoFiltro === "1"
                        ? "Centro Facturación"
                        : formikCalculo.values.tipoFiltro === "2"
                        ? "N° Contrato"
                        : "‎"
                    }
                    name="filtroValor"
                    maxLength={15}
                    value={formikCalculo.values.filtroValor}
                    error={formikCalculo.errors.filtroValor}
                    onChange={formikCalculo.handleChange}
                    disabled={
                      formikCalculo.values.tipoFiltro.includes(0) ? true : false
                    }
                  />
                </Form.Group>
                <Form.Group widths={"equal"}>
                  <Form.Button
                    type="submit"
                    color="blue"
                    content="Procesar"
                    disabled={obtenerPermisos(session.permissions, 1)}
                  />
                </Form.Group>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </>
  );
}

function initialValues() {
  return {
    fechaIndicadores: moment.utc().format("YYYY-MM-DD"),
    dolar: "",
    uf: "",
    tipoFact: "",
    fechaEmision: moment.utc().format("YYYY-MM-DD"),
    tipoFiltro: "0",
    filtroValor: "",
  };
}

function validationSchema() {
  return {
    fechaIndicadores: Yup.string().required(true),
    dolar: Yup.string().required(true),
    uf: Yup.string().required(true),
    tipoFact: Yup.string().required(true),
    fechaEmision: Yup.string().required(true),
    tipoFiltro: Yup.string().required(true),
    filtroValor: Yup.string().when("tipoFiltro", {
      is: (val) => val != "0",
      then: (val) => val.required(true),
      otherwise: (val) => val.notRequired(),
    }),
  };
}
