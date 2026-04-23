import React from "react";
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

const Dashboard = () => {
  const data = {
    labels: ["Marrakech", "Ouarzazate", "Agadir", "Casablanca"],
    datasets: [
      {
        label: "Cooperatives per city",
        data: [12, 5, 8, 15],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Cooperatives Statistics",
      },
    },
  };

  return (
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Dashboard</h2>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Dashboard;