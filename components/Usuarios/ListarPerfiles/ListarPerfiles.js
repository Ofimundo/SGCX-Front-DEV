import React, { useState, useEffect } from "react";
import { Transfer, Tag } from "antd";
import { map } from "lodash";
import { Titulo } from "../../";
import { Form, Grid, Label } from "semantic-ui-react";
import { useSession } from "next-auth/react";
import { obtenerPermisos } from "../../../Function";
import { obtenerPerfilUsuario } from "../../../apis";

export function ListarPerfiles(props) {
  const {
    perfil,
    usuarios,
    funciones,
    actualizarPerfil,
    actualizarFuncion,
    mostrarPerfilUsuario,
    mostrarFuncionPerfil,
  } = props;
  const { data: session } = useSession();
  const [perfilID, setPerfilID] = useState([]);
  const [usuarioID, setUsuarioID] = useState([]);
  const [listarPerfiles, setListarPerfiles] = useState([]);
  const [listarUsuarios, setListarUsuarios] = useState(
    DropdownUsuarios(usuarios)
  );

  useEffect(() => {
    //MODIFICAR
    (async () => {
      const response = await obtenerPerfilUsuario(0, session.id_token);
      setListarPerfiles(DropdownPerfiles(response));
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //===================================================
  const perfilAsignado = perfil
    .filter((item) => item.usuarioID !== null)
    .map((item) => item.perfilID);

  const listarPerfilUsuario = perfil.map((item) => ({
    key: item.perfilID,
    perfilID: item.perfilID,
    perfilNombre: item.perfilNombre.toUpperCase(),
  }));

  const moverPerfil = (_, direction, moveKeys) => {
    const data = {
      usuario: usuarioID,
      tipo: direction === "right" ? 1 : 0,
      perfiles: moveKeys.join(","),
    };
    actualizarPerfil(data);
  };

  const guardarUsuarioID = (data) => {
    setUsuarioID(data);
    mostrarPerfilUsuario(data);
  };
  //===================================================

  //===================================================
  const funcionAsignada = funciones
    .filter((item) => item.perfilID !== null)
    .map((item) => item.funcionID);

  const listarFuncionPerfil = funciones.map((item) => ({
    key: item.funcionID,
    funcionID: item.funcionID,
    funcionNombre: item.funcionNombre,
  }));

  const moverFuncion = (_, direction, moveKeys) => {
    const data = {
      perfil: perfilID,
      tipo: direction === "right" ? 1 : 0,
      funciones: moveKeys.join(","),
    };
    actualizarFuncion(data);
  };

  const guardarPerfilID = (data) => {
    setPerfilID(data);
    mostrarFuncionPerfil(data);
  };
  //===================================================

  return (
    <>
      <Grid columns={"equal"} style={{ marginTop: "1em" }} stackable>
        <Grid.Row>
          <Grid.Column>
            <div className="ctn-card">
              <Titulo icono={"user"} texto={"EDITAR PERFIL DE USUARIO"} />
              <Form>
                <Form.Group>
                  <Form.Dropdown
                    width={8}
                    name="usuario"
                    placeholder="Seleccionar o ingresar usuario"
                    search
                    selection
                    selectOnBlur={false}
                    options={listarUsuarios}
                    onChange={(_, data) => guardarUsuarioID(data.value)}
                  />
                </Form.Group>
              </Form>

              <Transfer
                showSearch
                onChange={moverPerfil}
                dataSource={listarPerfilUsuario}
                targetKeys={perfilAsignado}
                rowKey={(record) => record.perfilID}
                titles={[
                  <Label
                    size="small"
                    content={"No Asignados"}
                    color="orange"
                  />,
                  <Label size="small" content={"Asignados"} color="green" />,
                ]}
                listStyle={{
                  width: "100%",
                  height: "50vh",
                  overflowX: "hidden",
                }}
                render={(item) => `${item.perfilID} - ${item.perfilNombre}`}
                disabled={obtenerPermisos(session.permissions, 20)}
              />
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className="ctn-card">
              <Titulo icono={"shield"} texto={"EDITAR FUNCIONES DEL PERFIL"} />
              <Form>
                <Form.Group>
                  <Form.Dropdown
                    width={8}
                    name="perfil"
                    placeholder="Seleccionar o ingresar perfil"
                    search
                    selection
                    selectOnBlur={false}
                    options={listarPerfiles}
                    onChange={(_, data) => guardarPerfilID(data.value)}
                  />
                </Form.Group>
              </Form>

              <Transfer
                showSearch
                onChange={moverFuncion}
                dataSource={listarFuncionPerfil}
                targetKeys={funcionAsignada}
                rowKey={(record) => record.funcionID}
                titles={[
                  <Label
                    size="small"
                    content={"No Asignados"}
                    color="orange"
                  />,
                  <Label size="small" content={"Asignados"} color="green" />,
                ]}
                listStyle={{
                  width: "100%",
                  height: "50vh",
                  overflowX: "hidden",
                }}
                render={(item) => `${item.funcionID} - ${item.funcionNombre}`}
                disabled={obtenerPermisos(session.permissions, 21)}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}

function DropdownUsuarios(data) {
  return map(data, (item) => ({
    key: item.usuarioID,
    text: `${item.usuarioNombre} ${item.usuarioApellido}`,
    value: item.usuarioID,
  }));
}
function DropdownPerfiles(data) {
  return map(data, (item) => ({
    key: item.perfilID,
    text: item.perfilNombre.toUpperCase(),
    value: item.perfilID,
  }));
}
