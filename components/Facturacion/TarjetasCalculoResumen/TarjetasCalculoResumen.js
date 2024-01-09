import React from "react";
import { Spin } from "antd";
import { Icon, Statistic, Grid } from "semantic-ui-react";

export function TarjetasCalculoResumen({ cargando, resumen, listarFacturas }) {
  function iconoFactura(tipo) {
    if (tipo === "CARGO FIJO") return "dollar sign";
    else if (tipo === "CARGO VARIABLE") return "balance scale";
    else if (tipo === "CF + CV") return "exchange";
    else return "exclamation triangle";
  }

  function colorIconoFactura(tipo) {
    if (tipo === "CARGO FIJO") return "green";
    else if (tipo === "CARGO VARIABLE") return "red";
    else if (tipo === "CF + CV") return "blue";
    else return "yellow";
  }

  return (
    <>
      <Grid columns={"equal"} style={{ marginTop: "1em" }} stackable>
        <Grid.Row stretched>
          <Grid.Column width={3}>
            <div
              className="ctn-card"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => listarFacturas()}
            >
              <Spin spinning={cargando}>
                <Statistic size="small">
                  <Statistic.Value
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "0.2em",
                    }}
                  >
                    <Icon name="file excel outline" color="red" />
                    {resumen[1]?.TOTAL || 0}
                  </Statistic.Value>
                  <Statistic.Label>NO EMITIDAS</Statistic.Label>
                </Statistic>
              </Spin>
            </div>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <div className="ctn-card">
              <Spin spinning={cargando}>
                <strong>PREFACTURA</strong>
                <Statistic.Group widths={4} size="tiny">
                  {resumen
                    .filter(
                      (element) => element.TIPO_FACTURACION === "PREFACTURA"
                    )
                    .map((item, index) => (
                      <Statistic key={index}>
                        <Statistic.Value
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "0.25em",
                          }}
                        >
                          <Icon
                            name={iconoFactura(item.TIPO_FACTURA)}
                            color={colorIconoFactura(item.TIPO_FACTURA)}
                          />
                          {item.TOTAL}
                        </Statistic.Value>
                        <Statistic.Label>{item.TIPO_FACTURA}</Statistic.Label>
                      </Statistic>
                    ))}
                </Statistic.Group>
              </Spin>
            </div>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <div className="ctn-card">
              <Spin spinning={cargando}>
                <strong>FACTURA</strong>
                <Statistic.Group widths={4} size="tiny">
                  {resumen
                    .filter((element) => element.TIPO_FACTURACION === "FACTURA")
                    .map((item, index) => (
                      <Statistic key={index}>
                        <Statistic.Value
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "0.25em",
                          }}
                        >
                          <Icon
                            name={iconoFactura(item.TIPO_FACTURA)}
                            color={colorIconoFactura(item.TIPO_FACTURA)}
                          />
                          {item.TOTAL}
                        </Statistic.Value>
                        <Statistic.Label>{item.TIPO_FACTURA}</Statistic.Label>
                      </Statistic>
                    ))}
                </Statistic.Group>
              </Spin>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
