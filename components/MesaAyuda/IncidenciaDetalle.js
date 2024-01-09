import React from "react";
import moment from "moment";
import { Label } from "semantic-ui-react";
import { obtenerColorEstado } from "../../Function";
import { Descriptions, Tabs, Typography } from "antd";

export function IncidenciaDetalle({ ticket, respuestas }) {
  const { Text } = Typography;

  const tabs = [
    {
      label: <Text strong>Correo Principal</Text>,
      key: 0,
      children: (
        <>
          <iframe
            title="correo principal"
            srcDoc={ticket?.descripcion}
            style={{
              height: "420px",
            }}
          />
        </>
      ),
    },
    ...respuestas.map((item) => ({
      label: <Text strong>Respuesta N°{item.indice}</Text>,
      key: item.indice,
      children: (
        <>
          <iframe
            title="respuestas"
            srcDoc={item.descripcion}
            style={{
              height: "420px",
            }}
          />
        </>
      ),
    })),
  ];

  return (
    <>
      <Descriptions bordered layout="vertical" column={3} size="small">
        <Descriptions.Item label={<strong>Estado</strong>}>
          <Label
            size="small"
            content={ticket?.ultimoEstado}
            color={obtenerColorEstado(ticket?.idUltimoEstado)}
          />
        </Descriptions.Item>
        <Descriptions.Item label={<strong>Creado Por</strong>}>
          {ticket?.usuarioCreador}
        </Descriptions.Item>
        <Descriptions.Item label={<strong>Fecha de Creación</strong>}>
          {moment.utc(ticket?.fechaCreacion).format("YYYY-MM-DD HH:mm")}
        </Descriptions.Item>

        <Descriptions.Item label={<strong>Empresa</strong>}>
          {ticket?.nombreCliente}
        </Descriptions.Item>
        <Descriptions.Item label={<strong>Tipo de Problema</strong>}>
          {ticket?.subCategoria}
        </Descriptions.Item>
        <Descriptions.Item label={<strong>N° Serie</strong>}>
          {ticket?.serieEquipo}
        </Descriptions.Item>

        <Descriptions.Item label={<strong>Nombre Solicitante</strong>}>
          {ticket?.contactoNombre}
        </Descriptions.Item>
        <Descriptions.Item label={<strong>Correo Electrónico</strong>}>
          {ticket?.contactoEmail}
        </Descriptions.Item>
        <Descriptions.Item label={<strong>Telefóno / Celular</strong>}>
          {ticket?.contactoFono}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions
        bordered
        layout="vertical"
        column={1}
        size="small"
        style={{ marginTop: "2em" }}
      >
        <Descriptions.Item label={<strong>Asunto</strong>}>
          {ticket?.asuntoCorreo}
        </Descriptions.Item>
      </Descriptions>

      <Tabs
        className="antd-tab"
        type="card"
        defaultActiveKey="0"
        items={tabs}
        style={{
          marginTop: "1em",
        }}
      />
    </>
  );
}
