import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import "./Dashboard.css";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
);

const Dashboard = () => {
  // Pie Chart 1: Project Overview
  const pieData1 = {
    labels: ["Total Projects", "Accepted", "Pending"],
    datasets: [
      {
        data: [100, 70, 30], // Example data
        backgroundColor: ["#4B9EFB", "#10B981", "#F59E0B"],
        hoverOffset: 4,
      },
    ],
  };

  // Pie Chart 2: Assigned vs Unassigned in Accepted
  const pieData2 = {
    labels: ["Accepted Projects", "Assigned", "Unassigned"],
    datasets: [
      {
        data: [70, 50, 20], // Example data
        backgroundColor: ["#10B981", "#3B82F6", "#EF4444"],
        hoverOffset: 4,
      },
    ],
  };

  // Bar Chart: Priority
  const barData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Low Priority",
        data: [10, 0, 0],
        backgroundColor: "#10B981",
      },
      {
        label: "Medium Priority",
        data: [0, 25, 0],
        backgroundColor: "#F59E0B",
      },
      {
        label: "High Priority",
        data: [0, 0, 15],
        backgroundColor: "#EF4444",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      x: {
        beginAtZero: true,
        stacked: true,
        barThickness: 40,
      },
      y: {
        beginAtZero: true,
        stacked: true,
      },
    },
  };

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-heading">Dashboard</h2>

      <div className="dashboard-charts">
        <div className="dashboard-chart-tile dashboard-pie-tile">
          <h3 className="dashboard-chart-title">Project Overview</h3>
          <Pie
            data={pieData1}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>

        <div className="dashboard-chart-tile dashboard-pie-tile">
          <h3 className="dashboard-chart-title">Project Assignment</h3>
          <Pie
            data={pieData2}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>

        <div className="dashboard-chart-tile dashboard-bar-tile">
          <h3 className="dashboard-chart-title">Project Priority</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
