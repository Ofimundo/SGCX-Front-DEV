import React, { useState } from "react";
import moment from "moment";
import { Table } from "antd";
import { Form, Button } from "semantic-ui-react";
import { useSession } from "next-auth/react";
import { obtenerClienteOSerie } from "../../apis";
import { generarOpcionesDropdown } from "../../Function";

export function BuscadorContratos({ asignarContrato }) {
  const { data: session } = useSession();

  const [cliente, setCliente] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [nombreCliente, setNombreCliente] = useState([]);

  const columnas = [
    {
      title: "Código Cliente",
      render: (record) => record.codCliente,
      width: "25%",
    },
    {
      title: "Contrato",
      render: (record) => record.folioContrato,
      width: "25%",
    },
    {
      title: "Fecha Vencimiento",
      render: (record) => moment.utc(record.fecTermino).format("DD/MM/YYYY"),
      width: "25%",
    },
    {
      render: (record) => (
        <>
          <Button
            color="blue"
            size="tiny"
            icon="location arrow"
            circular
            onClick={() => asignarContrato(record.folioContrato)}
          />
        </>
      ),
      width: "5%",
      align: "center",
    },
  ];

  const filtrarValores = async (texto) => {
    if (texto.length >= 5) {
      const response = await obtenerClienteOSerie(2, texto, session.id_token);
      const clientesUnicos = new Set();
      const objetosUnicos = response.filter((obj) => {
        if (!clientesUnicos.has(obj.nombreCliente)) {
          clientesUnicos.add(obj.nombreCliente);
          return true;
        }
        return false;
      });
      setNombreCliente(
        generarOpcionesDropdown(objetosUnicos, "codCliente", "nombreCliente")
      );
      setCliente(response);
    }
  };

  const asignarDatosCliente = (data) => {
    const contratos = new Set();
    const filtroPorCodigo = cliente.filter(
      (item) => item.codCliente === data.value
    );
    const contratoUnico = filtroPorCodigo.filter((obj) => {
      if (!contratos.has(obj.folioContrato)) {
        contratos.add(obj.folioContrato);
        return true;
      }
      return false;
    });
    setContratos(contratoUnico);
  };

  return (
    <>
      <Form>
        <Form.Group widths={"equal"}>
          <Form.Dropdown
            label="Nombre Cliente"
            name="empresa"
            search
            selection
            selectOnBlur={false}
            options={nombreCliente}
            noResultsMessage={"No hay datos"}
            placeholder="Ejemplo: STUEDEMANSA S.A."
            onSearchChange={(e, { searchQuery }) => filtrarValores(searchQuery)}
            onChange={(_, data) => asignarDatosCliente(data)}
          />
        </Form.Group>
      </Form>
      <Table
        size="small"
        bordered
        columns={columnas}
        dataSource={contratos}
        rowKey={"folioContrato"}
      />
    </>
  );
}
