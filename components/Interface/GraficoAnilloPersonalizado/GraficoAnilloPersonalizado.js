import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function GraficoAnilloPersonalizado({
  tamaño,
  leyenda,
  posLeyenda,
  etiqueta,
  valores,
  label,
}) {
  const configuraciones = {
    aspectRatio: tamaño,
    plugins: {
      legend: {
        display: leyenda,
        position: posLeyenda,
      },
    },
  };
  const data = {
    labels: etiqueta,
    datasets: [
      {
        label: label,
        data: valores,
        backgroundColor: [
          "rgba(207, 50, 86)",
          "rgba(33, 133, 208)",
          "rgba(242, 113, 28)",
          "rgba(153, 102, 255)",
          "rgba(251, 189, 8)",
          "rgba(0, 181, 173)",
          "rgba(165, 103, 63)",
        ],
        borderWidth: 2.5,
        cutout: "65%",
      },
    ],
  };

  return <Doughnut data={data} options={configuraciones} />;
}
