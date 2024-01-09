import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function GraficoAnilloMDA() {
  const configuraciones = {
    aspectRatio: 1.5,
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
    },
  };
  const data = {
    labels: [
      "Recibidos",
      "Asignados",
      "Gestionando",
      "Derivado Ofitec",
      "Resuelto",
      "Incompleto",
      "Anulado",
    ],
    datasets: [
      {
        label: "Equipos",
        data: [75, 85, 75, 50, 36, 12, 4],
        backgroundColor: [
          "rgba(201, 63, 95)",
          "rgba(33, 133, 208)",
          "rgba(251, 189, 8)",
          "rgba(0, 181, 173)",
          "rgba(153, 102, 255)",
        ],
        borderWidth: 2.5,
        cutout: "65%",
      },
    ],
  };

  return <Doughnut data={data} options={configuraciones} />;
}
