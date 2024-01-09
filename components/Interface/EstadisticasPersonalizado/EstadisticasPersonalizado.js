import React from "react";
import { Icon } from "semantic-ui-react";

export function EstadisticasPersonalizado({ icono, color, valor, texto }) {
  return (
    <>
      <div className="ctn columns">
        <Icon name={icono} color={color} circular inverted size="big" />
        <label style={{ fontWeight: "700", fontSize: "1.75em" }}>{valor}</label>
        <label
          style={{ fontWeight: "600", fontSize: "1.25em", color: "#a5a5a5" }}
        >
          {texto}
        </label>
      </div>
    </>
  );
}
