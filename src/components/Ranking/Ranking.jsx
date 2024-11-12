import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

export default function HistoricalRankingModal({
  isOpen,
  onClose,
  rankingData,
  title,
  timeRange,
  songDetails, // Información adicional de la canción
}) {
  if (!isOpen) return null;

  const chartData = {
    labels: rankingData.map((data) => data.date),
    datasets: [
      {
        label: `Ranking de ${title}`,
        data: rankingData.map((data) => data.rank),
        borderColor: "#1DB954",
        backgroundColor: "rgba(29, 185, 84, 0.3)",
        tension: 0.3, // Suaviza las líneas del gráfico
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        reverse: true,
        title: {
          display: true,
          text: "Ranking",
          color: "#ffffff",
        },
        ticks: {
          color: "#ffffff",
          stepSize: 5,
        },
      },
      x: {
        title: {
          display: true,
          text: "Fecha",
          color: "#ffffff",
        },
        ticks: {
          color: "#ffffff",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1DB954",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
      },
    },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white max-w-2xl w-full">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-sm text-gray-400 mb-4">
              Historial de ranking en el período "{timeRange}"
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full text-white focus:outline-none"
          >
            ✕
          </button>
        </div>
        <div className="flex items-center mb-6">
          <img
            src={songDetails.albumCover}
            alt={songDetails.albumName}
            className="w-20 h-20 rounded-lg shadow-md"
          />
          <div className="ml-4">
            <p className="font-semibold">{songDetails.albumName}</p>
            <p className="text-sm text-gray-400">
              {songDetails.artistNames.join(", ")}
            </p>
          </div>
        </div>
        <div className="mb-6">
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-[#1DB954] hover:bg-green-600 rounded text-white"
            onClick={() => window.open(songDetails.spotifyUrl, "_blank")}
          >
            Ver en Spotify
          </button>
          <button
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
