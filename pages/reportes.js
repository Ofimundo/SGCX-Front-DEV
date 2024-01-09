import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { descargarReportes } from "../apis";
import { useSession } from "next-auth/react";

export default function Reportes() {
  const { data: session } = useSession();

  return (
    <>
      <Grid columns={"4"}>
        <Grid.Row>
          <Grid.Column>
            <div className="ctn-card ctn columns">
              <strong>Reporte Inyección</strong>
              <Button
                fluid
                content="Descargar"
                icon="download"
                color="blue"
                size="small"
                onClick={() => descargarReportes(1, null, session.id_token)}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
