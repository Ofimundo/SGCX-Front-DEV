import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function GraficoBarras({ titulo, xtitulo, dataArray }) {
  const configuraciones = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: titulo ? true : false,
        text: titulo,
      },
    },
  };

  const labels = xtitulo;

  const data = {
    labels,
    datasets: [
      {
        label: "Total",
        data: dataArray,
        backgroundColor: "rgba(33, 133, 208, 0.95)",
      },
    ],
  };

  return <Bar options={configuraciones} data={data} />;
}
