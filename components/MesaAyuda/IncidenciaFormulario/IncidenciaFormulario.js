import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import moment from "moment";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { Form, Button } from "semantic-ui-react";
import { notification, Modal, Upload } from "antd";
import { generarOpcionesDropdown, soloNumeros } from "../../../Function";
import {
  generarTicket,
  subirDocumentos,
  listarDatosContacto,
  obtenerClienteOSerie,
  obtenerTiposContactos,
  obtenerCategoriasIncidentes,
} from "../../../apis";
import { Editor } from "@tinymce/tinymce-react";

export function IncidenciaFormulario({ onRecargar }) {
  const { data: session } = useSession();
  const [api, notificationContextHolder] = notification.useNotification();
  const [modal, modalContextHolder] = Modal.useModal();

  const [dataCliente, setDataCliente] = useState([]);
  const [dataCodCliente, setDataCodCliente] = useState([]);
  const [dataSerieCliente, setDataSerieCliente] = useState([]);
  const [dataNombreCliente, setDataNombreCliente] = useState([]);

  const [dataCorreo, setDataCorreo] = useState([]);
  const [dataTelefono, setDataTelefono] = useState([]);
  const [dataContactos, setDataContactos] = useState([]);

  const [categorias, setCategorias] = useState([]);
  const [tipoProblema, setTipoProblema] = useState([]);
  const [subCategorias, setSubCategorias] = useState([]);

  const [tipoContacto, setTipoContacto] = useState([]);

  const [archivosAdjuntos, setArchivosAdjuntos] = useState([]);

  const onBorrar = () => {
    setDataCliente([]);
    setDataCodCliente([]);
    setDataSerieCliente([]);
    setDataNombreCliente([]);
    setArchivosAdjuntos([]);
    setDataCorreo([]);
    setDataTelefono([]);
    setDataContactos([]);
    formikTicket.resetForm();
  };

  useEffect(() => {
    (async () => {
      if (formikTicket.values.codCliente) {
        try {
          const contactos = await listarDatosContacto(
            formikTicket.values.codCliente,
            session.id_token
          );
          setDataCorreo(generarOpcionesDropdown(contactos, "correoCliente"));
          setDataContactos(generarOpcionesDropdown(contactos, "nombreCliente"));
          setDataTelefono(
            generarOpcionesDropdown(contactos, "telefonoCliente")
          );
        } catch (error) {
          modal.error({
            title: "Ups, algo salió mal",
            content: error.message,
          });
        }
      }
    })();
  }, [dataCodCliente]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    (async () => {
      try {
        const categoria = await obtenerCategoriasIncidentes(session.id_token);
        setCategorias(categoria.categorias);
        setSubCategorias(categoria.subcategorias);

        const contactos = await obtenerTiposContactos(session.id_token);
        setTipoContacto(contactos);
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formikTicket = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object().shape(validationSchema()),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const response = await generarTicket(formValue, session.id_token);

        for await (const archivo of archivosAdjuntos) {
          const extensionPosicion = archivo.name.lastIndexOf(".");
          const renombrarArchivo =
            archivo.name.slice(0, extensionPosicion) +
            `_MDA_${response.ticket}` +
            archivo.name.slice(extensionPosicion);

          const nuevoNombre = new File([archivo], renombrarArchivo, {
            type: archivo.type,
          });
          subirDocumentos(nuevoNombre, session.id_token);
        }

        api.success({
          duration: 3,
          closeIcon: false,
          placement: "top",
          message: response.message,
        });
        onBorrar();
        onRecargar();
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      }
    },
  });

  const listarProblemas = (data) => {
    formikTicket.setFieldValue("categoria", data.value);
    const filtroProblema = subCategorias.filter(
      (item) => item.idCategoria == data.value
    );
    setTipoProblema(
      generarOpcionesDropdown(
        filtroProblema,
        "idSubCategoria",
        "nombreSubCategoria"
      )
    );
  };

  //=========== ASI SE FILTRA EN EL DROPDOWN ===========
  const filtrarValores = async (texto, tipo) => {
    if (texto.length >= 5) {
      const response = await obtenerClienteOSerie(
        tipo,
        texto,
        session.id_token
      );
      const clientesUnicos = new Set();
      const objetosUnicos = response.filter((obj) => {
        if (!clientesUnicos.has(obj.nombreCliente)) {
          clientesUnicos.add(obj.nombreCliente);
          return true;
        }
        return false;
      });
      if (tipo === 0) {
        setDataCodCliente(generarOpcionesDropdown(objetosUnicos, "codCliente"));
      } else if (tipo === 1) {
        setDataSerieCliente(generarOpcionesDropdown(response, "eqSerie"));
      } else {
        setDataNombreCliente(
          generarOpcionesDropdown(objetosUnicos, "codCliente", "nombreCliente")
        );
      }
      setDataCliente(response);
    }
  };
  //=========== ASGINAR VALORES SEGUN LOS DROPDOWN ===========
  const asignarDatosCliente = (data, tipo) => {
    const nombreClienteUnico = new Set();
    if (tipo === 0) {
      const filtroNombre = dataCliente
        .filter((obj) => obj.codCliente === data.value)
        .map((obj) => ({
          key: obj.codCliente,
          text: obj.nombreCliente,
          value: obj.codCliente,
        }));
      const nombreUnico = filtroNombre.filter((obj) => {
        if (!nombreClienteUnico.has(obj.text)) {
          nombreClienteUnico.add(obj.text);
          return true;
        }
        return false;
      });
      setDataSerieCliente(
        filtrarArray(dataCliente, data.value, "eqSerie", "codCliente")
      );
      setDataNombreCliente(nombreUnico);
      formikTicket.setFieldValue("codCliente", data.value);
      formikTicket.setFieldValue("empresa", nombreUnico[0].value);
    } else if (tipo === 1) {
      const filtroSerie = dataCliente.filter(
        (item) => item.eqSerie == data.value
      );

      setDataNombreCliente(
        generarOpcionesDropdown(filtroSerie, "codCliente", "nombreCliente")
      );
      setDataCodCliente(generarOpcionesDropdown(filtroSerie, "codCliente"));
      formikTicket.setFieldValue("serieEquipo", data.value);
      formikTicket.setFieldValue("contrato", filtroSerie[0].folioContrato);
      formikTicket.setFieldValue(
        "fechaTermino",
        moment.utc(filtroSerie[0].fecTermino).format("YYYY-MM-DD")
      );
      formikTicket.setFieldValue("empresa", filtroSerie[0].codCliente);
      formikTicket.setFieldValue("codCliente", filtroSerie[0].codCliente);
    } else {
      const filtroCodCliente = filtrarArray(
        dataCliente,
        data.value,
        "codCliente",
        "codCliente"
      );
      const nombreUnico = filtroCodCliente.filter((obj) => {
        if (!nombreClienteUnico.has(obj.text)) {
          nombreClienteUnico.add(obj.text);
          return true;
        }
        return false;
      });
      setDataCodCliente(nombreUnico);
      setDataSerieCliente(
        filtrarArray(dataCliente, data.value, "eqSerie", "codCliente")
      );
      formikTicket.setFieldValue("empresa", data.value);
      formikTicket.setFieldValue("codCliente", filtroCodCliente[0].value);
    }
  };

  // =========================================================================
  const props = {
    onRemove: (file) => {
      const index = archivosAdjuntos.indexOf(file);
      const eliminarArchivo = archivosAdjuntos.slice();
      eliminarArchivo.splice(index, 1);
      setArchivosAdjuntos(eliminarArchivo);
    },
    beforeUpload: (file) => {
      setArchivosAdjuntos([...archivosAdjuntos, file]);
      return false;
    },
    archivosAdjuntos,
  };
  // =========================================================================

  const agregarDatosDropdown = (value, tipo) => {
    if (tipo === 1) {
      const nuevoContacto = {
        key: dataContactos.slice(-1)[0]?.key + 1 || 0,
        text: value.toUpperCase(),
        value: value,
      };
      setDataContactos([...dataContactos, nuevoContacto]);
    } else if (tipo === 2) {
      const nuevoCorreo = {
        key: dataCorreo.slice(-1)[0]?.key + 1 || 0,
        text: value.toUpperCase(),
        value: value,
      };
      setDataCorreo([...dataCorreo, nuevoCorreo]);
    } else {
      const nuevoFono = {
        key: dataTelefono.slice(-1)[0]?.key + 1 || 0,
        text: value.toUpperCase(),
        value: value,
      };
      setDataTelefono([...dataTelefono, nuevoFono]);
    }
  };

  return (
    <>
      {modalContextHolder}
      {notificationContextHolder}

      <Form onSubmit={formikTicket.handleSubmit}>
        <Form.Group widths={"equal"}>
          <Form.Dropdown
            label="Código Cliente"
            name="codCliente"
            search
            selection
            selectOnBlur={false}
            options={dataCodCliente}
            noResultsMessage={"No hay datos"}
            placeholder="Ejemplo: 98765432"
            onSearchChange={(e, { searchQuery }) =>
              filtrarValores(searchQuery, 0)
            }
            value={formikTicket.values.codCliente}
            error={formikTicket.errors.codCliente}
            onChange={(_, data) => asignarDatosCliente(data, 0)}
          />
          <Form.Dropdown
            label="N° Serie"
            name="serieEquipo"
            search
            selection
            selectOnBlur={false}
            options={dataSerieCliente}
            noResultsMessage={"No hay datos"}
            onSearchChange={(e, { searchQuery }) =>
              filtrarValores(searchQuery, 1)
            }
            placeholder="Ejemplo: A0123B321"
            value={formikTicket.values.serieEquipo}
            error={formikTicket.errors.serieEquipo}
            onChange={(_, data) => asignarDatosCliente(data, 1)}
          />
        </Form.Group>
        <Form.Group widths={"equal"}>
          <Form.Dropdown
            label="Nombre Cliente"
            name="empresa"
            search
            selection
            selectOnBlur={false}
            options={dataNombreCliente}
            noResultsMessage={"No hay datos"}
            placeholder="Ejemplo: STUEDEMANSA S.A."
            onSearchChange={(e, { searchQuery }) =>
              filtrarValores(searchQuery, 2)
            }
            value={formikTicket.values.empresa}
            error={formikTicket.errors.empresa}
            onChange={(_, data) => asignarDatosCliente(data, 2)}
          />
        </Form.Group>
        <Form.Group widths={"equal"}>
          <Form.Input
            label="N° Contrato"
            name="contrato"
            readOnly={true}
            value={formikTicket.values.contrato}
            onChange={formikTicket.handleChange}
            error={formikTicket.errors.contrato}
          />
          <Form.Input
            fluid
            label="Fecha Termino"
            name="fechaTermino"
            readOnly={true}
            value={formikTicket.values.fechaTermino}
            onChange={formikTicket.handleChange}
            error={formikTicket.errors.fechaTermino}
          />
        </Form.Group>

        <Form.Group widths={"equal"}>
          <Form.Dropdown
            label="Tipo de Contacto"
            name="tipoContacto"
            selection
            selectOnBlur={false}
            placeholder="Seleccione el tipo de contacto"
            options={tipoContacto}
            value={formikTicket.values.tipoContacto}
            error={formikTicket.errors.tipoContacto}
            onChange={(_, data) =>
              formikTicket.setFieldValue("tipoContacto", data.value)
            }
          />
          <Form.Dropdown
            fluid
            label="Nombre Solicitante"
            name="nombreContacto"
            search
            selection
            closeOnChange
            allowAdditions
            selectOnBlur={false}
            additionLabel="Añadir contacto: "
            noResultsMessage={"No hay datos"}
            placeholder="Seleccione o ingresa un nombre"
            options={dataContactos}
            value={formikTicket.values.nombreContacto}
            error={formikTicket.errors.nombreContacto}
            onChange={(_, data) =>
              formikTicket.setFieldValue("nombreContacto", data.value)
            }
            onAddItem={(e, { value }) => agregarDatosDropdown(value, 1)}
          />
        </Form.Group>
        <Form.Group widths={"equal"}>
          <Form.Dropdown
            fluid
            label="Correo Electrónico"
            name="correoContacto"
            search
            multiple
            selection
            closeOnChange
            allowAdditions
            selectOnBlur={false}
            additionLabel="Añadir correo: "
            noResultsMessage={"No hay datos"}
            placeholder="Seleccione o ingresa un correo"
            options={dataCorreo}
            value={formikTicket.values.correoContacto}
            error={formikTicket.errors.correoContacto}
            onChange={(_, data) =>
              formikTicket.setFieldValue("correoContacto", data.value)
            }
            onAddItem={(e, { value }) => agregarDatosDropdown(value, 2)}
          />
        </Form.Group>
        <Form.Group widths={"2"}>
          <Form.Dropdown
            fluid
            label="Telefóno / Celular"
            name="fonoContacto"
            search
            selection
            closeOnChange
            allowAdditions
            selectOnBlur={false}
            onKeyPress={soloNumeros}
            additionLabel="Añadir fono: "
            noResultsMessage={"No hay datos"}
            placeholder="Seleccione o ingresa un fono"
            options={dataTelefono}
            value={formikTicket.values.fonoContacto}
            error={formikTicket.errors.fonoContacto}
            onChange={(_, data) =>
              formikTicket.setFieldValue("fonoContacto", data.value)
            }
            onAddItem={(e, { value }) => agregarDatosDropdown(value, 3)}
          />
        </Form.Group>

        <Form.Group widths={"equal"}>
          <Form.Dropdown
            label="Categoría"
            name="categoria"
            selection
            placeholder="Seleccione una categoría"
            options={categorias}
            selectOnBlur={false}
            value={formikTicket.values.categoria}
            error={formikTicket.errors.categoria}
            onChange={(_, data) => listarProblemas(data)}
          />
          <Form.Dropdown
            label="Tipo de Problema"
            name="problema"
            search
            selection
            noResultsMessage={null}
            options={tipoProblema}
            selectOnBlur={false}
            placeholder="Seleccione el tipo de problema"
            value={formikTicket.values.problema}
            error={formikTicket.errors.problema}
            onChange={(_, data) =>
              formikTicket.setFieldValue("problema", data.value)
            }
          />
        </Form.Group>
        <Form.Group widths={"equal"}>
          <Form.Field>
            <label>Descripción</label>
            <Editor
              name="descripcion"
              value={formikTicket.values.descripcion}
              onEditorChange={(newContent) => {
                formikTicket.setFieldValue("descripcion", newContent);
              }}
              apiKey="eiseypjyncmi68fs9sg4n1ze128pvikrebxblffjtcfujv9u"
              init={{
                height: 350,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | ",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths={"equal"}>
          <Form.Field>
            <label>Adjuntos</label>
            <div
              style={{
                border: "2px rgba(180, 180, 180) dashed",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <Upload {...props} listType="picture" fileList={archivosAdjuntos}>
                <Button
                  color="teal"
                  type="button"
                  icon={"upload"}
                  content="Subir Archivos"
                  //content="Subir (Máx: 3)" MODIFICAR
                />
              </Upload>
            </div>
          </Form.Field>
        </Form.Group>
        <Button type="submit" color="blue" content="Crear Ticket" />
        <Button
          type="reset"
          color="black"
          onClick={onBorrar}
          content="Limpiar"
        />
      </Form>
    </>
  );
}

function initialValues() {
  return {
    codCliente: "",
    serieEquipo: "",
    empresa: "",
    contrato: "",
    fechaTermino: "",
    tipoContacto: "",
    nombreContacto: "",
    fonoContacto: "",
    correoContacto: [],
    categoria: "",
    problema: "",
    descripcion: "",
  };
}

function validationSchema() {
  return {
    codCliente: Yup.string().required(true),
    serieEquipo: Yup.string(),
    empresa: Yup.string().required(true),
    contrato: Yup.string(),
    fechaTermino: Yup.string(),
    tipoContacto: Yup.string().required(true),
    nombreContacto: Yup.string().required(true),
    fonoContacto: Yup.string()
      .max(9, " El número de teléfono/celular debe tener exactamente 9 dígitos")
      .min(
        9,
        " El número de teléfono/celular debe tener exactamente 9 dígitos"
      ),
    correoContacto: Yup.array().required(true),
    categoria: Yup.string().required(true),
    problema: Yup.string().required(true),
    descripcion: Yup.string(),
  };
}

function filtrarArray(array, buscar, objeto1, objeto2) {
  return array
    .filter((obj) => obj[objeto2] === buscar)
    .map((obj) => ({
      key: obj[objeto1],
      text: obj[objeto1],
      value: obj[objeto1],
    }));
}
