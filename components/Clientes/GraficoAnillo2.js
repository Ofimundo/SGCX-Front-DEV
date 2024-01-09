import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function GraficoAnillo2() {
  const configuraciones = {
    aspectRatio: 1.5,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const data = {
    labels: ["MPS", "Venta"],
    datasets: [
      {
        label: "Equipos",
        data: [4250, 640],
        backgroundColor: ["rgba(33, 133, 208)", "rgba(251, 189, 8)"],
        borderWidth: 2,
      },
    ],
  };

  return <Doughnut data={data} options={configuraciones} />;
}
