import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function GraficoAnillo({
  leyenda,
  posLeyenda,
  etiqueta,
  valores,
  label,
}) {
  const configuraciones = {
    aspectRatio: 1.5,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  const data = {
    labels: ["Sí, completamente resuelto", "Parcialmente", "No Resuelto"],
    datasets: [
      {
        label: label,
        data: [3200, 650, 320],
        backgroundColor: [
          "rgba(207, 50, 86)",
          "rgba(33, 133, 208)",
          "rgba(242, 113, 28)",
        ],
        borderWidth: 2.5,
        cutout: "65%",
      },
    ],
  };

  return <Doughnut data={data} options={configuraciones} />;
}

/*
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function GraficoAnillo() {
  const configuraciones = {
    aspectRatio: 1.5,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const data = {
    labels: ["Nubeprint", "KFS", "Xerox", "No Monitoreado"],
    datasets: [
      {
        label: "Equipos",
        data: [3200, 650, 320, 200],
        backgroundColor: [
          "rgba(33, 133, 208)",
          "rgba(201, 63, 95)",
          "rgba(251, 189, 8)",
          "rgba(0, 181, 173)",
          "rgba(153, 102, 255)",
          "rgba(255, 159, 64)",
        ],
        borderWidth: 2,
      },
    ],
  };

  return <Doughnut data={data} options={configuraciones} />;
}
*/
