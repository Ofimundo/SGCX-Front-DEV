import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function GraficoLineal() {
  var beneficios = [0, 56, 20, 36, 80, 40, 30, 20, 25, 30, 12, 60];
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

  var midata = {
    labels: meses,
    datasets: [
      // Cada una de las líneas del gráfico
      {
        label: "Facturado",
        data: beneficios,
        tension: 0.25,
        fill: true,
        borderColor: "rgb(33, 133, 208)",
        backgroundColor: "rgba(33, 133, 208, 0.5)",
        pointRadius: 5,
        pointBorderColor: "rgb(33, 133, 208)",
        pointBackgroundColor: "rgb(33, 133, 208)",
      },
    ],
  };

  var misoptions = {
    //aspectRatio: 3.5,
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <>
      <Line data={midata} options={misoptions} />
    </>
  );
}
