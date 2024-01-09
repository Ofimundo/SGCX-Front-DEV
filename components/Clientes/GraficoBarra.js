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

var sinOig = [711, 767, 700, 797, 759, 756, 723, 715, 841, 871, 854, 864];
var oig = [
  2732, 2747, 2761, 2750, 2871, 2884, 2993, 3014, 2963, 2950, 2930, 2919,
];
var meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

var misoptions = {
  //aspectRatio: 2,
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: true,
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
      label: "Monitoreados",
      data: oig,
      backgroundColor: "rgba(33, 133, 208, 0.95)",
    },
    {
      label: "No Monitoreados",
      data: sinOig,
      backgroundColor: "rgba(242, 133, 28, 0.95)",
    },
  ],
};

export function GraficoBarra() {
  return <Bar data={midata} options={misoptions} />;
}
