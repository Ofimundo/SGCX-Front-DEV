import React, { useEffect, useState } from "react";
import {
  obtenerUsuarios,
  obtenerPerfilUsuario,
  obtenerFuncionPerfil,
  actualizarPerfilUsuario,
  actualizarFuncionPerfil,
} from "../apis";
import { Modal } from "antd";
import { useSession } from "next-auth/react";
import {
  ListarUsuarios,
  ListarPerfiles,
  ModalPersonalizado,
  DrawerPersonalizado,
  AgregarEditarUsuarios,
  CrearUsuarioFormulario,
} from "../components";
import { EnviarNotificaciones } from "../modules";
import { Tab } from "semantic-ui-react";

export default function Usuarios() {
  const { data: session } = useSession();
  const [modal, modalContextHolder] = Modal.useModal();

  const [perfil, setPerfil] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [tamanio, setTamanio] = useState("small");
  const [tituloModal, setTituloModal] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [contenidoModal, setContenidoModal] = useState(null);

  const [tituloDrawer, setTituloDrawer] = useState("");
  const [mostrarDrawer, setMostrarDrawer] = useState(false);
  const [contenidoDrawer, setContenidoDrawer] = useState(null);

  const abrirCerrarModal = () => setMostrarModal((prev) => !prev);
  const abrirCerrarDrawer = () => setMostrarDrawer((prev) => !prev);

  useEffect(() => {
    (async () => {
      try {
        const response = await obtenerUsuarios(session.id_token);
        setUsuarios(response);
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //EDITAR USUARIOS
  const editarDatosUsuario = (data) => {
    //MODIFICAR
    setContenidoModal(<AgregarEditarUsuarios />);
    abrirCerrarModal();
  };

  const mostrarPerfilUsuario = async (data) => {
    try {
      const response = await obtenerPerfilUsuario(data, session.id_token);
      setPerfil(response);
    } catch (error) {
      modal.error({
        title: "Ups, algo salió mal",
        content: error.message,
      });
    }
  };

  const mostrarFuncionPerfil = async (data) => {
    try {
      const response = await obtenerFuncionPerfil(data, session.id_token);
      setFunciones(response);
    } catch (error) {
      modal.error({
        title: "Ups, algo salió mal",
        content: error.message,
      });
    }
  };

  const actualizarPerfil = async (data) => {
    try {
      await actualizarPerfilUsuario(data, session.id_token);
      mostrarPerfilUsuario(data.usuario);
    } catch (error) {
      modal.error({
        title: "Ups, algo salió mal",
        content: error.message,
      });
    }
  };

  const actualizarFuncion = async (data) => {
    try {
      const response = await actualizarFuncionPerfil(data, session.id_token);
      mostrarFuncionPerfil(data.perfil);
    } catch (error) {
      modal.error({
        title: "Ups, algo salió mal",
        content: error.message,
      });
    }
  };

  const crearUsuario = () => {
    setTituloDrawer("Crear Usuario");
    setContenidoDrawer(<CrearUsuarioFormulario />);
    abrirCerrarDrawer();
  };

  const panes = [
    {
      menuItem: { key: "ususario", icon: "users", content: "Usuarios" },
      render: () => (
        <Tab.Pane>
          <ListarUsuarios
            usuarios={usuarios}
            crearUsuario={crearUsuario}
            editarDatosUsuario={editarDatosUsuario}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: "perfiles",
        icon: "shield",
        content: "Perfiles y Funciones",
      },
      render: () => (
        <Tab.Pane>
          <ListarPerfiles
            perfil={perfil}
            usuarios={usuarios}
            funciones={funciones}
            actualizarPerfil={actualizarPerfil}
            actualizarFuncion={actualizarFuncion}
            mostrarFuncionPerfil={mostrarFuncionPerfil}
            mostrarPerfilUsuario={mostrarPerfilUsuario}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: "notifaciones",
        icon: "bell",
        content: "Notificaciones",
      },
      render: () => (
        <Tab.Pane>
          <EnviarNotificaciones />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <>
      {modalContextHolder}

      <Tab
        panes={panes}
        menu={{
          secondary: true,
          pointing: false,
        }}
      />

      <DrawerPersonalizado
        titulo={tituloDrawer}
        mostrar={mostrarDrawer}
        cerrar={abrirCerrarDrawer}
        children={contenidoDrawer}
      />

      <ModalPersonalizado
        tamanio={tamanio}
        titulo={tituloModal}
        mostrar={mostrarModal}
        children={contenidoModal}
        cerrar={abrirCerrarModal}
      />
    </>
  );
}
