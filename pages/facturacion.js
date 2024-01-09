import React, { useState, useEffect } from "react";
import { Modal, Result } from "antd";
import { useSession } from "next-auth/react";
import {
  CalculoManual,
  ListarFacturas,
  EditarPrefactura,
  ModalPersonalizado,
  CalculoFacturacion,
  ListarFacturasErrores,
  TarjetasCalculoResumen,
  ListarContratosAgrupados,
} from "../components";
import { Tab } from "semantic-ui-react";
import { useStoreFacturas, useStoreRecargar } from "../store";
import {
  resumenCalculo,
  generarProforma,
  eliminarFacturas,
  obtenerLineaDetalle,
  enviarFacturasSoftland,
  obtenerMaquinasContrato,
  obtenerDetallePrefactura,
  obtenerReferenciaPrefactura,
  obtenerTipoDocumentosPrefactura,
} from "../apis";
import { ExclamationCircleFilled } from "@ant-design/icons";

export default function Facturacion() {
  const { data: session } = useSession();

  const [cargando, setCargando] = useState(false);
  const [resumen, setResumen] = useState([]);
  const [recargar, setRecargar] = useState(false);

  const recargarListado = useStoreRecargar(
    (state) => state.setRecargarFacturas
  );
  const facturasArray = useStoreFacturas((state) => state.facturasArray);

  const [modal, contextHolder] = Modal.useModal();

  const [tamanio, setTamanio] = useState("large");
  const [tituloModal, setTituloModal] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [contenidoModal, setContenidoModal] = useState(null);

  const onRecargar = () => setRecargar((prev) => !prev);
  const abrirCerrarModal = () => setMostrarModal((prev) => !prev);

  useEffect(() => {
    (async () => {
      try {
        setCargando(true);
        const response = await resumenCalculo(session.id_token);
        setResumen(response);
      } catch (error) {
        modal.error({
          title: "Ups, algo salió mal",
          content: error.message,
        });
      } finally {
        setCargando(false);
      }
    })();
  }, [recargar]); // eslint-disable-line react-hooks/exhaustive-deps

  const editarPrefactura = async (data) => {
    try {
      const tipoDocumentos = await obtenerTipoDocumentosPrefactura(
        session.id_token
      );
      const referencia = await obtenerReferenciaPrefactura(
        data.nFactura,
        session.id_token
      );
      const lineaDetalle = await obtenerLineaDetalle(
        data.nFactura,
        session.id_token
      );
      const indicadores = await obtenerDetallePrefactura(
        data.nFactura,
        session.id_token
      );
      const maquinasContrato = await obtenerMaquinasContrato(
        data.nFactura,
        session.id_token
      );

      setTamanio("large");
      setContenidoModal(
        <EditarPrefactura
          prefactura={data}
          referencia={referencia}
          lineaDetalle={lineaDetalle}
          indicadores={indicadores[0]}
          tipoDocumentos={tipoDocumentos}
          maquinasContrato={maquinasContrato}
        />
      );
    } catch (error) {
      setTamanio("small");
      setContenidoModal(
        <Result
          status="500"
          title={<strong>500</strong>}
          subTitle={<h3>{error.message}</h3>}
        />
      );
    } finally {
      abrirCerrarModal();
    }
  };

  const emitirProforma = async () => {
    if (facturasArray.length !== 0) {
      modal.confirm({
        title: "¿Quieres emitir la Proforma",
        content: (
          <label>
            Si le das <strong>Aceptar</strong> no debes cerrar esta ventana
          </label>
        ),
        icon: <ExclamationCircleFilled />,
        async onOk() {
          try {
            const nFacturas = facturasArray.map((item) => item.nFactura);
            const response = await generarProforma(nFacturas, session.id_token);
            modal.success({
              content: response.message,
            });
          } catch (error) {
            modal.error({
              title: "Ups, algo salió mal",
              content: error.message,
            });
          }
        },
      });
    } else {
      modal.info({
        content: "No hay facturas seleccionadas",
      });
    }
  };

  const enviarSoftland = () => {
    if (facturasArray.length !== 0) {
      modal.confirm({
        title: "¿Quieres enviar las facturas a Softland",
        content: (
          <label>
            Si le das <strong>Aceptar</strong> no debes cerrar esta ventana
          </label>
        ),
        icon: <ExclamationCircleFilled />,
        async onOk() {
          try {
            const nFacturas = facturasArray.map((item) => item.nFactura);
            const response = await enviarFacturasSoftland(
              nFacturas,
              session.id_token
            );

            recargarListado();

            modal.success({
              content: response.message,
            });
          } catch (error) {
            modal.error({
              title: "Ups, algo salió mal",
              content: error.message,
            });
          }
        },
      });
    } else {
      modal.info({
        content: "No hay facturas seleccionadas",
      });
    }
  };

  const verContratosAgrupados = (data) => {
    setTamanio("small");
    setContenidoModal(
      <ListarContratosAgrupados contratos={JSON.parse(data)} />
    );
    abrirCerrarModal();
  };

  //VER PRE(FACTURAS) CON ERRORES/NO EMITIDAS
  const listarFacturasErrores = async () => {
    setTamanio("large");
    setContenidoModal(<ListarFacturasErrores onRecargar={onRecargar} />);
    abrirCerrarModal();
  };

  //ELIMINAR UNA (PRE) FACTURA
  const eliminarFactura = async (data) => {
    modal.confirm({
      content: "¿Quieres eliminar esta factura?",
      icon: <ExclamationCircleFilled />,
      async onOk() {
        try {
          const response = await eliminarFacturas([data], session.id_token);
          onRecargar();
          modal.success({
            content: response.message,
          });
        } catch (error) {
          modal.error({
            title: "Ups, algo salió mal",
            content: error.message,
          });
        }
      },
    });
  };

  //ELIMINADO MASIVO DE (PRE) FACTURAS
  const eliminadoDeFacturas = async () => {
    if (facturasArray.length !== 0) {
      modal.confirm({
        title: "¿Quieres eliminar estas facturas?",
        content: (
          <label>
            Si le das <strong>Aceptar</strong> no debes cerrar esta ventana
          </label>
        ),
        icon: <ExclamationCircleFilled />,
        async onOk() {
          try {
            const nFacturas = facturasArray.map((item) => item.nFactura);
            const response = await eliminarFacturas(
              nFacturas,
              session.id_token
            );
            onRecargar();
            modal.success({
              content: response.message,
            });
          } catch (error) {
            modal.error({
              title: "Ups, algo salió mal",
              content: error.message,
            });
          }
        },
      });
    } else {
      modal.info({
        content: "No hay facturas seleccionadas",
      });
    }
  };

  const paneles = [
    {
      menuItem: {
        key: "calculo",
        icon: "calculator",
        content: "Cálculo Facturación",
      },
      render: () => (
        <Tab.Pane>
          <CalculoFacturacion onRecargar={onRecargar} />

          <TarjetasCalculoResumen
            cargando={cargando}
            resumen={resumen}
            listarFacturas={listarFacturasErrores}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: "factura",
        icon: "file alternate outline",
        content: "Control Facturación Electrónica",
      },
      render: () => (
        <Tab.Pane>
          <ListarFacturas
            recargar={recargar}
            enviarSoftland={enviarSoftland}
            emitirProforma={emitirProforma}
            eliminarFactura={eliminarFactura}
            editarPrefactura={editarPrefactura}
            listarContratos={verContratosAgrupados}
            eliminadoDeFacturas={eliminadoDeFacturas}
          />
        </Tab.Pane>
      ),
    },
    /*
    {
      menuItem: {
        key: "manual",
        icon: "dollar sign",
        content: "Facturación Manual",
      },
      render: () => (
        <Tab.Pane active={false}>
          <CalculoManual />
        </Tab.Pane>
      ),
    },
    */
  ];

  return (
    <>
      {contextHolder}
      <Tab
        renderActiveOnly={true}
        panes={paneles}
        menu={{
          secondary: true,
          pointing: false,
        }}
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
