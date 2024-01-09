import React from "react";
import Link from "next/link";
import { Icon } from "semantic-ui-react";
import { Row, Col } from "antd";
import styles from "./CardPersonalizado.module.css";

export function CardPersonalizado({
  link,
  icono,
  color,
  texto,
  valor,
  porcentaje,
}) {
  return (
    <div className={styles.card}>
      <Link href={link}>
        <Row wrap={false} align={"middle"} justify={"space-between"}>
          <Col>
            <Row className={styles.list}>
              <Col>
                <div className={styles.down}>
                  <label className={styles.title}>{texto}</label>
                </div>
                <label className={styles.number}>
                  {Intl.NumberFormat("es-CL").format(valor)}
                </label>
                {porcentaje ? (
                  <label
                    style={{ color: porcentaje[0] !== "+" ? "red" : "#21ba45" }}
                    className={styles.percentaje}
                  >
                    {porcentaje}%
                  </label>
                ) : null}
              </Col>
            </Row>
          </Col>
          <Col>
            <Icon size="big" circular inverted name={icono} color={color} />
          </Col>
        </Row>
      </Link>
    </div>
  );
}

/**
 * 
 * <div style={{ border: "orange 1px solid", background: "red" }}>
      <Link href={link}>
        <div>
          <Row gutter={[10, 0]}>
            <Col>
              <Row>
                <Col>
                  <Title type="secondary" level={5}>
                    {texto}
                  </Title>
                  <Title
                    level={4}
                    style={{
                      marginTop: "-10px",
                    }}
                  >
                    {valor}
                  </Title>
                </Col>
              </Row>
            </Col>
            <Col>
              <Icon size="big" circular inverted name={icono} color={color} />
            </Col>
          </Row>
        </div>
      </Link>
    </div>
 */
