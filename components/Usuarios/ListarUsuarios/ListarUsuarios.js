import React, { useState, useEffect } from "react";
import { Table, Tag } from "antd";
import { useSession } from "next-auth/react";
import { obtenerPermisos } from "../../../Function";
import { Icon, Button, Grid, Form } from "semantic-ui-react";

export function ListarUsuarios(props) {
  const { usuarios, crearUsuario, editarDatosUsuario } = props;
  const { data: session } = useSession();

  const [filtro, setFiltro] = useState("");
  const [dataInicial, setDataInicial] = useState([]);
  const [dataFiltrada, setDataFiltrada] = useState([]);

  useEffect(() => {
    if (dataInicial.length === 0 || dataFiltrada.length === 0) {
      setDataInicial(usuarios);
      setDataFiltrada(usuarios);
    }
  }, [usuarios]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns = [
    {
      title: "Usuario",
      render: (record) => record.usuarioCodigo,
      width: 90,
    },
    {
      title: "Nombre",
      render: (record) => record.usuarioNombre,
      width: 90,
    },
    {
      title: "Apellidos",
      render: (record) => record.usuarioApellido,
      width: 90,
    },
    {
      title: "Correo Electrónico",
      render: (record) => record.usuarioCodigo + "@ofimundo.cl",
      width: 90,
    },
    {
      title: "Activo",
      render: (record) =>
        record.usuarioEstado ? (
          <Icon name="check" color="green" size="large" />
        ) : (
          <Icon name="x" color="red" size="large" />
        ),
      width: 80,
      align: "center",
    },
    {
      title: "Perfiles",
      dataIndex: "usuarioPerfil",
      key: "usuarioPerfil",
      render: (usuarioPerfil) => (
        <span>
          {Array.isArray(usuarioPerfil)
            ? usuarioPerfil.map((perfil, index) => (
                <Tag key={index} color="blue">
                  {perfil.toUpperCase()}
                </Tag>
              ))
            : usuarioPerfil}
        </span>
      ),
      width: 200,
    },

    {
      render: (record) => (
        <Button
          type="button"
          icon="pencil"
          color="blue"
          size="mini"
          onClick={() => editarDatosUsuario(record)}
          disabled={obtenerPermisos(session.permissions, 9)}
        />
      ),
      width: 40,
      align: "center",
    },
  ];

  //FILTRO
  const filtrarPorCategoria = (e) => {
    setFiltro(e.target.value);
    setDataFiltrada(
      dataInicial.filter(
        (item) =>
          item.usuarioCodigo
            .toUpperCase()
            .includes(e.target.value.toUpperCase()) ||
          item.usuarioNombre
            .toUpperCase()
            .includes(e.target.value.toUpperCase()) ||
          item.usuarioApellido
            .toUpperCase()
            .includes(e.target.value.toUpperCase())
      )
    );
  };

  return (
    <>
      <div className="ctn-card up">
        <div className="btn-navbar between">
          <Form>
            <Form.Group>
              <Form.Input
                icon="search"
                value={filtro}
                placeholder="Buscar por usuario, nombre, apellido, etc."
                onChange={filtrarPorCategoria}
              />
            </Form.Group>
          </Form>

          <Button
            color="blue"
            type="submit"
            content="Crear Usuario"
            onClick={() => crearUsuario()}
          />
        </div>

        <Table
          columns={columns}
          dataSource={dataFiltrada}
          scroll={{ x: 80 }}
          rowKey="usuarioID"
          size="small"
          bordered
          footer={() => (
            <div style={{ margin: "0.2em 0" }}>
              <Grid columns="3" verticalAlign="middle" textAlign="center">
                <Grid.Column>
                  Total Usuarios: <strong>{dataFiltrada.length}</strong>
                </Grid.Column>
              </Grid>
            </div>
          )}
        />
      </div>
    </>
  );
}
