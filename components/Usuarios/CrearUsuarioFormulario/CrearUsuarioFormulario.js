import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Form } from "semantic-ui-react";
import { useSession } from "next-auth/react";
import { crearNuevoUsuario } from "../../../apis";
import { obtenerPermisos } from "../../../Function";

export function CrearUsuarioFormulario() {
  const { data: session } = useSession();

  //RECIBIR LOS DATOS DEL FORMULARIO
  const formikUsuario = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object().shape(validationSchema()),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        await crearNuevoUsuario(formValue, session.id_token); //MODIFICAR
        formikUsuario.resetForm();
      } catch (error) {
        alert(error); //MODIFICAR
      }
    },
  });

  return (
    <>
      <Form onSubmit={formikUsuario.handleSubmit}>
        <Form.Field>
          <label>Nombre Usuario</label>
          <Form.Input
            fluid
            maxLength={15}
            name="usuarioNombre"
            placeholder="Ejem: John"
            value={formikUsuario.values.usuarioNombre}
            onChange={formikUsuario.handleChange}
            error={formikUsuario.errors.usuarioNombre}
          />
        </Form.Field>
        <Form.Field>
          <label>Apellido Usuario</label>
          <Form.Input
            fluid
            maxLength={30}
            name="usuarioApellido"
            placeholder="Ejem: Doe"
            value={formikUsuario.values.usuarioApellido}
            onChange={formikUsuario.handleChange}
            error={formikUsuario.errors.usuarioApellido}
          />
        </Form.Field>
        <Form.Field>
          <label>Usuario</label>
          <Form.Input
            fluid
            maxLength={15}
            name="usuarioCodigo"
            placeholder="Ejem: jdoe"
            value={formikUsuario.values.usuarioCodigo}
            onChange={formikUsuario.handleChange}
            error={formikUsuario.errors.usuarioCodigo}
          />
        </Form.Field>
        <Form.Field>
          <Form.Button
            type="submit"
            color="black"
            content="Crear"
            disabled={obtenerPermisos(session.permissions, 8)}
          />
        </Form.Field>
      </Form>
    </>
  );
}

function initialValues() {
  return {
    usuarioNombre: "",
    usuarioApellido: "",
    usuarioCodigo: "",
  };
}

function validationSchema() {
  return {
    usuarioNombre: Yup.string().required(true),
    usuarioApellido: Yup.string().required(true),
    usuarioCodigo: Yup.string().required(true),
  };
}
