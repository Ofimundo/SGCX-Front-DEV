import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Form, Image, Button, Dropdown, Checkbox } from "semantic-ui-react";

export function AgregarEditarUsuarios() {
  const formikUsuario = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(newValidationSchema()),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      console.log(formValue);
    },
  });

  return (
    <>
      <Form onSubmit={formikUsuario.handleSubmit}>
        <Form.Group widths={"2"}>
          <Form.Field>
            <label>Usuario</label>
            <Form.Input
              name="usuario"
              placeholder="Nombre del usuario"
              value={formikUsuario.values.usuario}
              onChange={formikUsuario.handleChange}
              error={formikUsuario.errors.usuario}
            />
          </Form.Field>
          <Form.Field>
            <label>Nombre Usuario</label>
            <Form.Input
              name="nombre"
              placeholder="Nombre usuario"
              value={formikUsuario.values.nombre}
              onChange={formikUsuario.handleChange}
              error={formikUsuario.errors.nombre}
            />
          </Form.Field>
        </Form.Group>

        <div className="add-edit-product__active">
          <Checkbox
            toggle
            checked={formikUsuario.values.activo}
            onChange={(_, data) =>
              formikUsuario.setFieldValue("activo", data.checked)
            }
          />
          Producto activo
        </div>

        <Form.Button type="submit" color="blue" fluid content={"Crear"} />
      </Form>
    </>
  );
}

function initialValues(data) {
  return {
    nombre: data?.nombre || "",
    precio: data?.precio || "",
    categoria: data?.id_categoria || "",
    activo: data?.activo ? true : false,
    imagen: "",
  };
}

function newValidationSchema() {
  return {
    nombre: Yup.string().required(true),
    precio: Yup.number().required(true),
    categoria: Yup.number().required(true),
    activo: Yup.boolean().required(true),
    imagen: Yup.string().required(true),
  };
}
