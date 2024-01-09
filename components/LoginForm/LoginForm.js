import React from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button, Grid } from "semantic-ui-react";
import logoOfimundo from "../../public/img/logo-principal.webp";

export function LoginForm() {
  return (
    <>
      <Grid columns={1} textAlign="center" verticalAlign="middle">
        <Grid.Column>
          <Grid.Column style={{ marginBottom: "1em" }}>
            <Image
              width={280}
              priority={true}
              src={logoOfimundo}
              alt="logo ofimundo"
            />
          </Grid.Column>

          <Grid.Column>
            <Button
              fluid
              size="large"
              type="button"
              icon="microsoft"
              color="facebook"
              content="Iniciar sesión con Microsoft"
              onClick={(e) => {
                e.preventDefault();
                signIn("azure-ad", null, { prompt: "login" });
              }}
            />
          </Grid.Column>
        </Grid.Column>
      </Grid>
    </>
  );
}
