import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import Link from "next/link";
import Image from "next/image";
import logoOfimundo from "../../../public/img/logo-principal-bn.webp";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { obtenerIdsPerfil, obtenerPermisos } from "../../../Function";
import {
  FaPlug,
  FaFilePen,
  FaHeadset,
  FaUserGroup,
  FaChartLine,
  FaBoxesStacked,
  FaCalendarCheck,
  FaClipboardCheck,
  FaCircleDollarToSlot,
} from "react-icons/fa6";
import { RiProfileLine } from "react-icons/ri";
import { TbHeartRateMonitor } from "react-icons/tb";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaShippingFast, FaCalculator } from "react-icons/fa";
import { FundProjectionScreenOutlined } from "@ant-design/icons";

export function Sidebar() {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();

  const [ruta, setRuta] = useState([]);

  useEffect(() => {
    const itemsFiltrado = items.filter((item) => item !== undefined);
    const sinHijos = itemsFiltrado.filter((items) => items.children === null);
    const conHijos = itemsFiltrado.filter((items) => items.children);

    const rutaSeleccionada = [
      ...sinHijos,
      ...conHijos.flatMap((items) => items.children),
    ];

    setRuta(
      rutaSeleccionada
        .filter((items) => pathname.includes(items.label.props.href))
        .map((items) => items.key)
    );
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const items = [
    getItem("Apps", "1", "", null, ""),
    obtenerIdsPerfil(session.profile, [2, 9]) &&
      !obtenerPermisos(session.permissions, 34) &&
      getItem("Contratos", "1.0", <FaFilePen />, null, "/contratos"),
    obtenerIdsPerfil(session.profile, 10) &&
      !obtenerPermisos(session.permissions, 37) &&
      getItem("Encuestas", "1.7", <FaClipboardCheck />, null, "/encuestas"),
    obtenerIdsPerfil(session.profile, 1) &&
      !obtenerPermisos(session.permissions, 36) &&
      getItem("Contadores", "1.6", <FaCalculator />, null, "/contadores"),
    obtenerIdsPerfil(session.profile, [5, 7]) &&
      getItem(
        "Despachos",
        "2.5",
        <FaBoxesStacked />,
        [
          !obtenerPermisos(session.permissions, 35) &&
            getItem(
              "Seguimiento de Envíos",
              "2.5.1",
              <FaShippingFast />,
              null,
              "/seguimiento-envios"
            ),
        ],
        undefined
      ),
    obtenerIdsPerfil(session.profile, 2) &&
      !obtenerPermisos(session.permissions, 24) &&
      getItem(
        "Facturación",
        "1.1",
        <FaCircleDollarToSlot />,
        null,
        "/facturacion"
      ),
    obtenerIdsPerfil(session.profile, [4, 5, 8]) &&
      getItem(
        "Gestión de Proyectos",
        "1.2",
        <FundProjectionScreenOutlined />,
        [
          !obtenerPermisos(session.permissions, 26) &&
            getItem(
              "Seguimiento de Habilitación",
              "1.2.1",
              <FaCalendarCheck />,
              null,
              "/seguimiento-habilitacion"
            ),
        ],
        undefined
      ),
    obtenerIdsPerfil(session.profile, 7) &&
      !obtenerPermisos(session.permissions, 27) &&
      getItem("Mesa de Ayuda", "1.3", <FaHeadset />, null, "/mesa-ayuda"),
    obtenerIdsPerfil(session.profile, 6) &&
      !obtenerPermisos(session.permissions, 23) &&
      getItem(
        "Equipos Desconectados",
        "1.4",
        <FaPlug />,
        null,
        "/equipos-desconectados"
      ),
    obtenerIdsPerfil(session.profile, 1) &&
      !obtenerPermisos(session.permissions, 28) &&
      getItem("Usuarios", "1.5", <FaUserGroup />, null, "/usuarios"),
    obtenerIdsPerfil(session.profile, 1) && {
      type: "divider",
    },
    obtenerIdsPerfil(session.profile, 1) &&
      getItem("En Desarrollo", "2", "", null, ""),
    obtenerIdsPerfil(session.profile, 1) &&
      getItem("Monitoreo", "2.1", <TbHeartRateMonitor />, null, "/monitoreo"),
    obtenerIdsPerfil(session.profile, 1) &&
      getItem("Reportes", "2.2", <FaChartLine />, null, "/reportes"),
    obtenerIdsPerfil(session.profile, 1) &&
      getItem(
        "Modelo de Atención",
        "2.3",
        <RiProfileLine />,
        [
          getItem(
            "Reporte Ejecutivo",
            "2.3.1",
            <AiOutlineDashboard />,
            null,
            "/atencion-clientes"
          ),
        ],
        undefined
      ),
  ];

  return (
    <>
      <div className="antd-menu-logo" onClick={() => router.push("/")}>
        <Image
          priority={true}
          src={logoOfimundo}
          alt="logo ofimundo"
          width={170}
        />
      </div>

      <Menu
        selectable
        mode="inline"
        selectedKeys={ruta}
        items={items}
        className="antd-menu"
      />
    </>
  );
}

function getItem(label, key, icon, children, url = "") {
  return {
    key,
    icon,
    children,
    label: <Link href={url}>{label}</Link>,
  };
}
