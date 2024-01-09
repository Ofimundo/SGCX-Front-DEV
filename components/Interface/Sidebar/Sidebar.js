import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import Link from "next/link";
import Image from "next/image";
import logoOfimundo from "../../../public/img/logo-principal-bn.webp";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { obtenerIdsPerfil, obtenerPermisos } from "../../../Function";
import {
  ApiOutlined,
  TeamOutlined,
  FundProjectionScreenOutlined,
} from "@ant-design/icons";
import { SlEarphonesAlt } from "react-icons/sl";
import { FaBoxes, FaShippingFast } from "react-icons/fa";
import { BiLineChart, BiCalendarCheck } from "react-icons/bi";
import { RiProfileLine } from "react-icons/ri";
import { AiOutlineDashboard } from "react-icons/ai";
import { MdOutlineAttachMoney } from "react-icons/md";
import { TbFileDollar, TbHeartRateMonitor } from "react-icons/tb";
import { LiaFileContractSolid } from "react-icons/lia";

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
    obtenerIdsPerfil(session.profile, 2) &&
      !obtenerPermisos(session.permissions, 34) &&
      getItem("Contratos", "1.0", <LiaFileContractSolid />, null, "/contratos"),
    obtenerIdsPerfil(session.profile, [5, 7]) &&
      getItem(
        "Despachos",
        "2.5",
        <FaBoxes />,
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
      getItem("Facturación", "1.1", <TbFileDollar />, null, "/facturacion"),
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
              <BiCalendarCheck />,
              null,
              "/seguimiento-habilitacion"
            ),
        ],
        undefined
      ),
    obtenerIdsPerfil(session.profile, 7) &&
      !obtenerPermisos(session.permissions, 27) &&
      getItem("Mesa de Ayuda", "1.3", <SlEarphonesAlt />, null, "/mesa-ayuda"),
    obtenerIdsPerfil(session.profile, 6) &&
      !obtenerPermisos(session.permissions, 23) &&
      getItem(
        "Equipos Desconectados",
        "1.4",
        <ApiOutlined />,
        null,
        "/equipos-desconectados"
      ),
    obtenerIdsPerfil(session.profile, 1) &&
      !obtenerPermisos(session.permissions, 28) &&
      getItem("Usuarios", "1.5", <TeamOutlined />, null, "/usuarios"),
    obtenerIdsPerfil(session.profile, 1) && {
      type: "divider",
    },
    obtenerIdsPerfil(session.profile, 1) &&
      getItem("En Desarrollo", "2", "", null, ""),
    obtenerIdsPerfil(session.profile, 1) &&
      getItem("Monitoreo", "2.1", <TbHeartRateMonitor />, null, "/monitoreo"),
    obtenerIdsPerfil(session.profile, 1) &&
      getItem("Reportes", "2.2", <BiLineChart />, null, "/reportes"),
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
