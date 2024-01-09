import React from "react";
import { useSession } from "next-auth/react";
import { obtenerPermisos } from "../../../Function";
import { Icon, Grid, Button, Input } from "semantic-ui-react";

export function Titulo(props) {
  const {
    icono,
    texto,
    nombreBoton,
    funcionBoton,
    color,
    codigoFuncion,
    filtro,
  } = props;
  const { data: session } = useSession();

  return (
    <Grid
      columns={"equal"}
      verticalAlign="middle"
      style={{ marginBottom: "2.5px" }}
    >
      <Grid.Column>
        <h4>
          <Icon name={icono} />
          {texto}
        </h4>
      </Grid.Column>
      {nombreBoton && (
        <Grid.Column textAlign="right">
          <Button
            color={color}
            type="submit"
            content={nombreBoton}
            onClick={funcionBoton}
            disabled={obtenerPermisos(session.permissions, codigoFuncion)}
          />
        </Grid.Column>
      )}
      {filtro && (
        <Grid.Column textAlign="right" width={2}>
          <Input fluid />
        </Grid.Column>
      )}
    </Grid>
  );
}
