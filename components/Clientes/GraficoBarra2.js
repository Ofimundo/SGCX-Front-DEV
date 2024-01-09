import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

var ok = [38, 44, 49, 31, 46];
var noOK = [38, 44, 49, 31, 46];
var iniciada = [38, 44, 49, 31, 46];
var noIniciada = [38, 44, 49, 31, 46];

var meses = ["Constanza", "Katherine", "Lucy", "Macarena", "Sandra"];

var misoptions = {
  //aspectRatio: ,
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "right",
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      stacked: true,
    },
    y: {
      grid: {
        display: false,
      },
      stacked: true,
    },
  },
};

var midata = {
  labels: meses,
  datasets: [
    {
      label: "Completada",
      data: ok,
      backgroundColor: "rgba(33, 133, 208, 0.95)",
    },
    {
      label: "No Completada",
      data: noOK,
      backgroundColor: "rgba(242, 133, 28, 0.95)",
    },
    {
      label: "No Iniciada",
      data: iniciada,
      backgroundColor: "rgba(0, 181, 173, 0.95)",
    },
  ],
};

export function GraficoBarra2() {
  return <Bar data={midata} options={misoptions} />;
}
