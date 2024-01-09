import React from "react";
import { Button, Progress } from "semantic-ui-react";
import { Row, Col } from "antd";

export function EstadisticasAcceso({ texto, valor, color }) {
  return (
    <>
      <div className="ctn-card">
        <Row wrap={false} align={"middle"} justify={"space-between"}>
          <Col>
            <Row>
              <Col>
                <div style={{ marginBottom: "0.5em" }}>
                  <label
                    style={{
                      fontWeight: 600,
                      fontSize: "1.1em",
                      color: "#a5a5a5",
                    }}
                  >
                    {texto}
                  </label>
                </div>
                <label
                  style={{
                    fontWeight: 700,
                    fontSize: "1.7em",
                    color: "#252525",
                  }}
                >
                  {valor}%
                </label>
              </Col>
            </Row>
          </Col>
          <Col>
            <Button content="App" color="blue" />
          </Col>
        </Row>
        <Progress
          size="small"
          color={color}
          percent={valor}
          style={{ margin: "0.5em 0 0" }}
        />
      </div>
    </>
  );
}
